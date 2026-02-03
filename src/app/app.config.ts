import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth.interceptor';
import { OidcSecurityService, provideAuth } from 'angular-auth-oidc-client';
import { getAuthConfig } from './auth/auth.config';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAuth({
      config: getAuthConfig(),
    }),
    provideAppInitializer(() => {
      const oidcSecurityService = inject(OidcSecurityService);
      return firstValueFrom(oidcSecurityService.checkAuth());
    }),
  ],
};
