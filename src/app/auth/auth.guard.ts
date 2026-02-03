import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const oidcSecurityService = inject(OidcSecurityService);

  return oidcSecurityService.isAuthenticated$.pipe(
    map((result) => {
      if (result.isAuthenticated) {
        return true;
      }
      oidcSecurityService.authorize();
      return false;
    }),
  );
};
