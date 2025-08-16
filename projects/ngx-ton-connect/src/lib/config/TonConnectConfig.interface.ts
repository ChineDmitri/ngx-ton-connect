import { InjectionToken, Provider } from '@angular/core';

export interface TonConnectConfig {
  /** TON Connect manifest URL */
  manifestUrl?: string;
}

/**
 * Injection token used to provide the TonConnect configuration.
 */
export const TON_CONNECT_CONFIG = new InjectionToken<TonConnectConfig>('TON_CONNECT_CONFIG');

/** Default (empty) config used when none is provided. */
export const DEFAULT_TON_CONNECT_CONFIG: TonConnectConfig = {};

/**
 * Helper function to provide the TonConnect configuration in a standalone / application config style.
 *
 * Example (app.config.ts):
 *   providers: [
 *     provideTonConnectConfig({ manifestUrl: 'https://example.com/tonconnect-manifest.json' })
 *   ]
 */
// Backward/alternate naming helper (alias) to avoid confusion with import names
export function provideNgxTonConnect(config: TonConnectConfig): Provider {
  return { provide: TON_CONNECT_CONFIG, useValue: config };
}
