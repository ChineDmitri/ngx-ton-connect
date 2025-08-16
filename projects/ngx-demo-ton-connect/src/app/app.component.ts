import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxTonConnectService } from 'ngx-ton-connect';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'TonConnect Demo';

  constructor(public tonConnect: NgxTonConnectService) {}

  // Signaux calculés pour l'affichage avec l'API compatible
  connectedWallet = computed(() => this.tonConnect.wallet());
  connectedAccount = computed(() => this.tonConnect.account());
  availableWallets = computed(() => this.tonConnect.wallets());
  isConnecting = computed(() => this.tonConnect.isConnecting());
  error = computed(() => this.tonConnect.error());

  // Getter pour la compatibilité avec le template
  get isConnected(): boolean {
    return !!this.connectedAccount();
  }

  // Méthodes adaptées à l'API compatible
  async connectWallet(wallet?: unknown) {
    await this.tonConnect.connect(wallet as never);
  }

  async disconnectWallet() {
    await this.tonConnect.disconnect();
  }

  async sendTestTransaction() {
    await this.tonConnect.sendTestTransaction();
  }

  async refreshWallets() {
    await this.tonConnect.refreshWallets();
  }

  // Helpers pour l'affichage
  getWalletName(): string {
    return this.connectedWallet()?.name || 'Aucun wallet';
  }

  getAccountAddress(): string {
    const account = this.connectedAccount();
    if (!account?.address) return 'Non connecté';
    
    // Afficher une version tronquée de l'adresse
    const addr = account.address;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  }

  getNetworkName(): string {
    const account = this.connectedAccount();
    return account?.chain === '-239' ? 'Mainnet' : 
           account?.chain === '-3' ? 'Testnet' : 
           account?.chain || 'Inconnu';
  }

  getDebugInfo() {
    return this.tonConnect.getDebugInfo();
  }

  // TrackBy pour la performance de la liste des wallets
  trackWallet(index: number, wallet: { name: string }): string {
    return wallet.name || index.toString();
  }
}
