import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideNgxTonConnect } from 'ngx-ton-connect';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNgxTonConnect(environment.ngxTonconnectConfig)
  ]
};
