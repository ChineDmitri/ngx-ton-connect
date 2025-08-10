import { Inject, Injectable, Optional } from '@angular/core';
import {
  TonConnectConfig,
  TON_CONNECT_CONFIG,
  DEFAULT_TON_CONNECT_CONFIG,
} from './config/TonConnectConfig.interface';

@Injectable({
  providedIn: 'root',
})
export class NgxTonconnectService {
  private readonly config: TonConnectConfig;

  constructor(
    @Optional()
    @Inject(TON_CONNECT_CONFIG)
    config: TonConnectConfig | null
  ) {
    this.config = config ?? DEFAULT_TON_CONNECT_CONFIG;
  }

  connect() {
    console.log(
      'Connecting to TON Connect... Manifest URL :',
      this.config.manifestUrl
    );
    // Connection logic here
  }

  exoTest(a: number, b: number): number {
  console.log('Executing test with parameters:', a, b);
    return a + b; // Example operation
  }
}
