import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
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
