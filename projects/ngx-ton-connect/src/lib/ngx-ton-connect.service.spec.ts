import { TestBed } from '@angular/core/testing';

import { NgxTonconnectService } from './ngx-ton-connect.service';
import { TON_CONNECT_CONFIG } from './config/TonConnectConfig.interface';

describe('NgxTonconnectService', () => {
  let service: NgxTonconnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TON_CONNECT_CONFIG,
          useValue: {
            manifestUrl:
              'https://raw.githubusercontent.com/ton-blockchain/dns/main/tonconnect-manifest.json',
          },
        },
      ],
    });
    service = TestBed.inject(NgxTonconnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('connect logs manifest url', () => {
    const spy = spyOn(console, 'log');
    service.connect();
    expect(spy).toHaveBeenCalledWith(
      'Connecting to TON Connect... Manifest URL :',
      'https://raw.githubusercontent.com/ton-blockchain/dns/main/tonconnect-manifest.json'
    );
  });
});
