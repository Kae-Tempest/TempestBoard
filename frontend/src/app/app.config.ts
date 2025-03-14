import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { loggingInterceptor } from '@core/interecptor/logginInterceptor';
import { authInterceptor } from '@core/interecptor/authInterceptor';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ConfigService } from '@core/service/configService';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([loggingInterceptor, authInterceptor])),
    { provide: ConfigService },
  ],
};
