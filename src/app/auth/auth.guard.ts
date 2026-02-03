import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);

  return oidcSecurityService.checkAuth().pipe(
    take(1),
    map((result) => {
      if (result.isAuthenticated) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    }),
  );
};
