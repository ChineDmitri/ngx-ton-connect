# NgxTonconnect

An Angular library to easily integrate TonConnect into your Angular applications with reactive signals.

## Features

- ✅ Full integration of the official TonConnect SDK
- ✅ Angular reactive signals for synchronous state management
- ✅ Full TypeScript support
- ✅ Simple and intuitive API
- ✅ Automatic connect/disconnect management
- ✅ Transaction support
- ✅ Compatible with Angular 17+

## Installation

```bash
npm install ngx-ton-connect @tonconnect/sdk
```

## Configuration

### 1. TonConnect Manifest Configuration

Create a publicly accessible JSON manifest file (for example `public/tonconnect-manifest.json`):

```json
{
  "url": "https://your-domain.com",
  "name": "Your App",
  "iconUrl": "https://your-domain.com/icon.png",
  "termsOfUseUrl": "https://your-domain.com/terms",
  "privacyPolicyUrl": "https://your-domain.com/privacy"
}
```

### 2. Angular Configuration

In your `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideNgxTonConnect } from 'ngx-ton-connect';

export const appConfig: ApplicationConfig = {
  providers: [
    // your other providers...
    provideNgxTonConnect({
      manifestUrl: 'https://your-domain.com/tonconnect-manifest.json'
    }),
  ],
};
```

## Usage

### In your component

```typescript
import { Component, computed } from '@angular/core';
import { NgxTonConnectService } from 'ngx-ton-connect';

@Component({
  selector: 'app-wallet',
  template: `
    <div *ngIf="!isConnected">
      <h3>Connect a wallet</h3>
      <button 
        *ngFor="let wallet of availableWallets()" 
        (click)="connectWallet(wallet)"
        [disabled]="isConnecting()">
        {{ wallet.name }}
      </button>
      <button (click)="connectWallet()" [disabled]="isConnecting()">
        {{ isConnecting() ? 'Connecting...' : 'Auto Connect' }}
      </button>
    </div>

    <div *ngIf="isConnected">
      <h3>Wallet connected</h3>
      <p><strong>Wallet:</strong> {{ walletName() }}</p>
      <p><strong>Address:</strong> {{ accountAddress() }}</p>
      <p><strong>Network:</strong> {{ networkName() }}</p>
      
      <button (click)="sendTestTransaction()">
        Send Test Transaction
      </button>
      <button (click)="disconnect()">Disconnect</button>
    </div>

    <div *ngIf="error()" class="error">
      Error: {{ error() }}
    </div>
  `
})
export class WalletComponent {
  constructor(private tonConnect: NgxTonConnectService) {}

  // Reactive signals
  isConnected = computed(() => !!this.tonConnect.account());
  availableWallets = computed(() => this.tonConnect.wallets());
  isConnecting = computed(() => this.tonConnect.isConnecting());
  error = computed(() => this.tonConnect.error());

  // Methods
  async connectWallet(wallet?: any) {
    await this.tonConnect.connect(wallet);
  }

  async disconnect() {
    await this.tonConnect.disconnect();
  }

  async sendTestTransaction() {
    await this.tonConnect.sendTestTransaction();
  }

  // Display helpers
  walletName() {
    return this.tonConnect.wallet()?.name || 'None';
  }

  accountAddress() {
    const account = this.tonConnect.account();
    if (!account) return 'Not connected';
    const addr = account.address;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  }

  networkName() {
    const account = this.tonConnect.account();
    return account?.chain === '-239' ? 'Mainnet' : 
           account?.chain === '-3' ? 'Testnet' : 
           'Unknown';
  }
}
```

## API Reference

### NgxTonConnectService

#### Signals

- `wallet()` - Currently connected wallet (`WalletInfoRemote | null`)
- `wallets()` - List of available wallets (`WalletInfo[]`)
- `account()` - Connected account info (`{address: string, chain: CHAIN, publicKey: string} | null`)
- `accountAddress()` - Connected account address (`string | null`)
- `network()` - Current network (`CHAIN | null`)
- `isConnecting()` - Connection state (`boolean`)
- `error()` - Last error (`string | null`)

#### Methods

- `connect(wallet?: WalletInfo)` - Connect to a specific wallet or automatically
- `disconnect()` - Disconnect current wallet
- `loadWallets()` - Load available wallets
- `refreshWallets()` - Refresh wallet list
- `sendTestTransaction()` - Send a test transaction (0.001 TON)
- `getDebugInfo()` - Get debug information
- `snapshot()` - Get a snapshot of the current state

#### Getters

- `isConnected` - Whether a wallet is connected
- `connectedWallet` - Connected wallet
- `connectedAccount` - Connected account
- `availableWallets` - Available wallets

## Examples

### Send a custom transaction

```typescript
async sendTransaction() {
  if (!this.tonConnect.isConnected) {
    console.error('Wallet not connected');
    return;
  }

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
    messages: [
      {
        address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
        amount: '1000000000' // 1 TON in nanotons
      }
    ]
  };

  try {
    await this.tonConnect.sendTransaction(transaction);
    console.log('Transaction sent successfully');
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}
```

### Error handling

```typescript
ngOnInit() {
  // Listen for errors
  effect(() => {
    const error = this.tonConnect.error();
    if (error) {
      this.handleError(error);
    }
  });
}

private handleError(error: string) {
  // Display error to the user
  console.error('TonConnect error:', error);
  // Or use a notification service
}
```

### Check connection

```typescript
async checkConnection() {
  if (this.tonConnect.isConnected) {
    const account = this.tonConnect.account();
    console.log('Connected to:', account?.address);
  } else {
    console.log('No wallet connected');
  }
}
```

## Development

### Build the library

```bash
ng build ngx-ton-connect
```

### Test the demo application

```bash
ng serve
```

## Contribution

Contributions are welcome! Please:

1. Fork the project  
2. Create a feature branch (`git checkout -b add_feature/my-feature`)  
3. Commit your changes (`git commit -am 'Add my feature'`)  
4. Push to the branch (`git push origin add_feature/my-feature`)  
5. Create a Pull Request  

## License

MIT

## Support

- [TonConnect Documentation](https://docs.ton.org/develop/dapps/ton-connect/overview)
- [TonConnect SDK](https://github.com/ton-connect/sdk)
- [TON Blockchain](https://ton.org/)