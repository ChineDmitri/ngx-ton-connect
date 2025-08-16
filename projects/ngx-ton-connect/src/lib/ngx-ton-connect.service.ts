import { Inject, Injectable, Optional, signal } from '@angular/core';
import { TonConnect, WalletInfoRemote, WalletInfo, CHAIN, Account, Wallet } from '@tonconnect/sdk';
import { TonConnectConfig, TON_CONNECT_CONFIG } from './config/TonConnectConfig.interface';

/**
 * Service Angular for integrating TonConnect SDK with reactive signals.
 */
@Injectable({ providedIn: 'root' })
export class NgxTonConnectService {
  private tonConnect: TonConnect | null = null;

  // Reactive state with Angular signals - API Compatible
  wallet         = signal<WalletInfoRemote | null>(null);
  wallets        = signal<WalletInfo[]>([]);
  accountAddress = signal<string | null>(null);
  network        = signal<CHAIN | null>(null);
  isConnecting   = signal<boolean>(false);
  error          = signal<string | null>(null);

  // New signals for future compatibility
  account      = signal<Account | null>(null);
  walletsList  = signal<WalletInfo[]>([]);

  constructor(
    @Optional() 
    @Inject(TON_CONNECT_CONFIG) private config?: TonConnectConfig
  ) {
    this.initializeTonConnect();
  }

  /**
   * Initialize TonConnect with the provided manifest URL
   */
  private async initializeTonConnect(): Promise<void> {
    if (!this.config?.manifestUrl) {
      const errorMsg = 'TonConnect manifestUrl not configured. Please provide TON_CONNECT_CONFIG.';
      console.error('[NgxTonConnect]', errorMsg);
      this.error.set(errorMsg);
      return;
    }

    try {
      this.tonConnect = new TonConnect({ manifestUrl: this.config.manifestUrl });

      // Restore existing connection
      await this.tonConnect.restoreConnection();

      // Update state
      this.updateState();

      // Subscribe to status changes
      this.subscribeToStatusChanges();

      // Load available wallets
      await this.loadAvailableWallets();

      console.log('[NgxTonConnect] Initialized successfully');
    } catch (error) {
      const errorMsg = `Error initializing TonConnect: ${error}`;
      console.error('[NgxTonConnect]', errorMsg);
      this.error.set(errorMsg);
    }
  }

  /**
   * Update the wallet and account state
   */
  private updateState(): void {
    if (!this.tonConnect) return;

    // Connected wallet
    const connectedWallet = this.tonConnect.wallet;
    if (connectedWallet && this.isWalletInfoRemote(connectedWallet)) {
      this.wallet.set(connectedWallet);
    } else {
      this.wallet.set(null);
    }

    // Account information
    const accountInfo: Account | null = this.tonConnect.account;
    if (accountInfo) {
      this.accountAddress.set(accountInfo.address);
      this.network.set(accountInfo.chain);
      this.account.set(accountInfo);
    } else {
      this.accountAddress.set(null);
      this.network.set(null);
      this.account.set(null);
    }

    this.error.set(null);
  }

  /**
   * Subscribe to status changes of the TonConnect instance
   */
  private subscribeToStatusChanges(): void {
    if (!this.tonConnect) return;

    this.tonConnect.onStatusChange((wallet: any) => {
      console.log('[NgxTonConnect] Status change:', wallet);
      this.updateState();

      // Stop the connecting indicator
      if (this.isConnecting()) {
        this.isConnecting.set(false);
      }
    });
  }

  /**
   * Get the list of available wallets
   */
  private async loadAvailableWallets(): Promise<void> {
    if (!this.tonConnect) return;

    try {
      const walletsList = await this.tonConnect.getWallets();
      this.wallets.set(walletsList);
      this.walletsList.set(walletsList); // Compatibility
      console.log('[NgxTonConnect] Wallets loaded:', walletsList.length);
    } catch (error) {
      console.error('[NgxTonConnect] Error loading wallets:', error);
      this.error.set(`Error loading wallets: ${error}`);
    }
  }

  /**
   * Type guard for WalletInfoRemote
   */
  private isWalletInfoRemote(wallet: any): wallet is WalletInfoRemote {
    return wallet && 
           typeof wallet === 'object' && 
           'name' in wallet &&
           'imageUrl' in wallet;
  }

  // === PUBLIC METHODS - COMPATIBLE API ===

  /**
   * Get the list of wallets (legacy API)
   */
  loadWallets(): void {
    this.loadAvailableWallets().catch(error => {
      console.error('[NgxTonConnect] Error loading wallets:', error);
      this.error.set(`Error loading wallets: ${error}`);
    });
  }

  /**
   * Connect to a specific wallet or the first available wallet
   */
  async connect(targetWallet?: WalletInfo): Promise<void> {
    if (!this.tonConnect) {
      this.error.set('TonConnect not initialized');
      return;
    }

    if (this.tonConnect.connected) {
      console.log('[NgxTonConnect] Already connected');
      return;
    }

    this.isConnecting.set(true);
    this.error.set(null);

    try {
      let walletToConnect = targetWallet;

      // If no specific wallet, use the first one in the list
      if (!walletToConnect && this.wallets().length > 0) {
        walletToConnect = this.wallets()[0];
      }

      // If still no wallet, load the list first
      if (!walletToConnect) {
        await this.loadAvailableWallets();
        if (this.wallets().length > 0) {
          walletToConnect = this.wallets()[0];
        }
      }

      if (!walletToConnect) {
        const errorMsg = 'No wallet available. Please check your internet connection and the manifest URL.';
        console.warn('[NgxTonConnect]', errorMsg);
        this.error.set(errorMsg);
        this.isConnecting.set(false);
        return;
      }

      console.log('[NgxTonConnect] Try connecting to:', walletToConnect.name);
      console.log('[NgxTonConnect] Wallet type:', this.getWalletType(walletToConnect));

      // Check wallet type and use the correct connection method
      if (this.isInjectedWallet(walletToConnect)) {
        console.log('[NgxTonConnect] Connecting via injected wallet');
        // For injected wallets (browser extensions)
        const universalUrl = await this.tonConnect.connect(walletToConnect);
        if (typeof universalUrl === 'string') {
          this.openUniversalLink(universalUrl);
        }
      } else {
        console.log('[NgxTonConnect] Connecting via universal link');
        // For remote wallets (mobile/desktop) - always use universal links
        const universalUrl = await this.tonConnect.connect(walletToConnect);
        
        if (typeof universalUrl === 'string') {
          console.log('[NgxTonConnect] Opening universal link:', universalUrl);
          this.openUniversalLink(universalUrl);

          // Timeout to stop the connection indicator if the user does not act
          setTimeout(() => {
            if (this.isConnecting() && !this.tonConnect?.connected) {
              console.log('[NgxTonConnect] Connection timeout - stopping indicator');
              this.isConnecting.set(false);
            }
          }, 60000); // 60 seconds

        } else {
          console.warn('[NgxTonConnect] No universal link received');
          this.isConnecting.set(false);
        }
      }

    } catch (error: any) {
      console.error('[NgxTonConnect] Connection error:', error);

      // Specific wallet error handling
      if (error.message?.includes('WalletNotInjectedError')) {
        this.error.set('This wallet is not installed as a browser extension. Please use the mobile or desktop app of the wallet.');
      } else if (error.message?.includes('UserRejectsError')) {
        this.error.set('Connection cancelled by user.');
      } else {
        this.error.set(`Connection error: ${error.message || error}`);
      }
      
      this.isConnecting.set(false);
    }
  }

  /**
   * Verify if a wallet is of injected type (browser extension)
   */
  private isInjectedWallet(wallet: WalletInfo): boolean {
    // An injected wallet usually does not have a universalLink
    // and has a jsBridgeKey or similar property
    const walletAny = wallet as any;
    return !!(walletAny.jsBridgeKey || walletAny.injected) && !walletAny.universalLink;
  }

  /**
   * Determine the wallet type for debugging
   */
  private getWalletType(wallet: WalletInfo): string {
    const walletAny = wallet as any;
    if (walletAny.jsBridgeKey || walletAny.injected) {
      return 'injected';
    }
    if (walletAny.universalLink) {
      return 'remote';
    }
    return 'unknown';
  }

  /**
   * Open the universal link based on device type
   */
  private openUniversalLink(url: string): void {
    if (typeof window === 'undefined') return;

    console.log('[NgxTonConnect] Opening universal link:', url);

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      // On mobile, redirect directly
      console.log('[NgxTonConnect] Mobile redirecting to:', url);
      window.location.href = url;
    } else {
      // On desktop (Linux, Windows, Mac), open in a new tab
      console.log('[NgxTonConnect] Desktop opening in new tab:', url);
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        // If the popup is blocked, try a direct redirect
        console.warn('[NgxTonConnect] Popup blocked, attempting direct redirect');
        window.location.href = url;
      } else {
        // Show a message to the user on desktop
        console.log('[NgxTonConnect] New window opened for wallet connection');

        // Optionnel: afficher un message informatif
        setTimeout(() => {
          if (!this.tonConnect?.connected) {
            console.log('[NgxTonConnect] Si l\'application wallet ne s\'ouvre pas automatiquement, copiez ce lien:', url);
          }
        }, 3000);
      }
    }
  }

  /**
   * Disconnect the current wallet
   */
  async disconnect(): Promise<void> {
    if (!this.tonConnect) return;

    try {
      await this.tonConnect.disconnect();
      console.log('[NgxTonConnect] Disconnected successfully');

    } catch (error) {
      console.error('[NgxTonConnect] Disconnection error:', error);
      this.error.set(`Disconnection error: ${error}`);
    }
  }

  /**
   * Envoie une transaction de test (0.001 TON vers soi-même)
   */
  async sendTestTransaction(): Promise<void> {
    if (!this.tonConnect || !this.tonConnect.connected || !this.accountAddress()) {
      this.error.set('Wallet not connected');
      return;
    }

    const currentAddress = this.accountAddress();
    if (!currentAddress) {
      this.error.set('No connected account');
      return;
    }

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        messages: [
          {
            address: currentAddress,
            amount: '1000000' // 0.001 TON en nanotons
          }
        ]
      };

      await this.tonConnect.sendTransaction(transaction);
      console.log('[NgxTonConnect] Test transaction sent');
      this.error.set(null);

    } catch (error) {
      console.error('[NgxTonConnect] Transaction error:', error);
      this.error.set(`Transaction error: ${error}`);
    }
  }

  // === METHODS FOR FUTURE COMPATIBILITY ===

  /**
   * Refresh the list of available wallets
   */
  async refreshWallets(): Promise<void> {
    await this.loadAvailableWallets();
  }

  /**
   * Getters for simplified access to data
   */
  get isConnected(): boolean {
    return this.tonConnect?.connected ?? false;
  }

  get connectedWallet(): WalletInfoRemote | null {
    return this.wallet();
  }

  get connectedAccount() {
    return this.account();
  }

  get availableWallets(): WalletInfo[] {
    return this.wallets();
  }

  /**
   * Debugging information
   */
  getDebugInfo() {
    return {
      isConnected: this.isConnected,
      wallet: this.wallet(),
      account: this.account(),
      accountAddress: this.accountAddress(),
      network: this.network(),
      walletsCount: this.wallets().length,
      isConnecting: this.isConnecting(),
      error: this.error(),
      manifestUrl: this.config?.manifestUrl
    };
  }

  /**
   * Snapshot of the state (old API)
   */
  snapshot() {
    return {
      manifestUrl: this.config?.manifestUrl,
      connected: !!this.accountAddress(),
      wallet: this.wallet(),
      accountAddress: this.accountAddress(),
      network: this.network(),
      walletsCount: this.wallets().length,
      isConnecting: this.isConnecting(),
      error: this.error(),
    };
  }
}
