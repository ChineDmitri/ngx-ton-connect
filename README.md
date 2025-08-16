# NgxTonConnect Workspace

This workspace contains the Angular NgxTonConnect library and a demo application show how to use it.

## Workspace Contents

- **projects/ngx-ton-connect/** - The Angular NgxTonConnect library
- **projects/ngx-demo-ton-connect/** - Demo application using the library

## NgxTonConnect

A Angular library to easily integrate with TonConnect SKD with reactive signals.
  
### Key Features

- ✅ SDK TonConnect official 
- ✅ Signaux Angular réactifs (Angular 17+)
- ✅ TypeScript with types 
- ✅ Handle state connection 
- ✅ Support transaction for TON

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Build the library

```bash
ng build ngx-ton-connect
```

### 3. Run the demo application

```bash
ng serve
```

Open http://localhost:4200 to see the demo in action.

## Demo Structure

The demo app (`projects/ngx-demo-ton-connect/`) montre comment :

- ✅ How configure NgxTonConnect in the Angular application
- ✅ How display the list of available wallets
- ✅ How connect/disconnect a TON wallet
- ✅ How display the information of the connected account
- ✅ How send test transactions
- ✅ How manage errors and loading state

## Configuration

### TonConnect Manifest

L'application utilise un manifest de démonstration hébergé sur GitHub :
```
https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json
```

For production, you must create your own JSON manifest, for example:

```json
{
  "url": "https://votre-domaine.com",
  "name": "Votre Application",
  "iconUrl": "https://votre-domaine.com/icon.png",
  "termsOfUseUrl": "https://votre-domaine.com/terms",
  "privacyPolicyUrl": "https://votre-domaine.com/privacy"
}
```

### Angular Configuration

Dans `projects/ngx-demo-ton-connect/src/app/app.config.ts` :

```typescript
import { provideNgxTonConnect } from 'ngx-ton-connect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxTonConnect(environment.ngxTonconnectConfig),
  ],
};
```

## Library Usage

### Importing the service

```typescript
import { NgxTonConnectService } from 'ngx-ton-connect';

@Component({...})
export class MonComposant {
  constructor(private tonConnect: NgxTonConnectService) {}

  // Reactive state with signals
  isConnected = computed(() => !!this.tonConnect.account());
  wallets = computed(() => this.tonConnect.wallets());
  
  async connect() {
    await this.tonConnect.connect();
  }
}
```

### Available Signals

- `wallet()` - Wallet connecté
- `wallets()` - Liste des wallets disponibles  
- `account()` - Informations du compte
- `accountAddress()` - Adresse du compte
- `network()` - Réseau (mainnet/testnet)
- `isConnecting()` - État de connexion en cours
- `error()` - Dernière erreur

### Main Methods

- `connect(wallet?)` - Connecter un wallet
- `disconnect()` - Déconnecter
- `sendTestTransaction()` - Transaction de test
- `loadWallets()` - Charger les wallets
- `refreshWallets()` - Actualiser la liste

## Available Scripts

```bash
# Development
npm run start              # Démarre l'app démo
npm run build              # Construit tout
npm run watch              # Mode watch pour développement

# Testing & quality
npm run test               # Lance les tests
npm run lint               # Vérifie le code
npm run lint:fix           # Corrige les erreurs de lint
npm run format             # Formate le code avec Prettier

# Library
ng build ngx-ton-connect   # Construit uniquement la librairie
ng test ngx-ton-connect    # Tests de la librairie
```

## Development

### Adding New Features

1. Modify the service dans `projects/ngx-ton-connect/src/lib/`
2. Build the library : `ng build ngx-ton-connect`
3. Test in the demo : `ng serve`
4. Add tests if necessary

### File Structure

```
projects/
├── ngx-ton-connect/          # Library principale
│   ├── src/lib/
│   │   ├── ngx-ton-connect.service.ts
│   │   ├── config/
│   │   └── public-api.ts
│   └── README.md
└── ngx-demo-ton-connect/     # Application démo
    ├── src/app/
    │   ├── app.component.ts
    │   ├── app.component.html
    │   ├── app.component.scss
    │   └── app.config.ts
    └── src/environments/
```

## Production

### Publishing the Library

```bash
# 1. Construire la librairie
ng build ngx-ton-connect

# 2. Navigate to the dist folder
cd dist/ngx-ton-connect

# 3. Publish to npm
npm publish
```

### Deploying the Demo

```bash
# Construire pour la production
ng build ngx-demo-ton-connect --configuration production

# Files are located in dist/ngx-demo-ton-connect/
```

## Technologies Used

- **Angular 17** - Framework with reactive signals
- **TonConnect SDK 3.2** - Official TON SDK
- **TypeScript** - Typed language
- **SCSS** - Advanced styling
- **ESLint + Prettier** - Code quality

## Resources

- [Documentation TonConnect](https://docs.ton.org/develop/dapps/ton-connect/overview)
- [SDK TonConnect GitHub](https://github.com/ton-connect/sdk)
- [TON Blockchain](https://ton.org/)
- [Angular Signals](https://angular.io/guide/signals)

## License

MIT