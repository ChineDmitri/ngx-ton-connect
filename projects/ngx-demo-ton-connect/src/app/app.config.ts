import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideNgxTonConnect } from 'ngx-ton-connect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNgxTonConnect(environment.ngxTonconnectConfig),
  ],
};
