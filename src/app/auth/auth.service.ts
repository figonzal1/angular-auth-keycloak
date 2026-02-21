import { inject, Injectable } from '@angular/core';
import { LoginResponse, OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);

  checkAuth(): Observable<LoginResponse> {
    return this.oidcSecurityService.checkAuth();
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService
      .logoffAndRevokeTokens()
      .subscribe((result) => console.log('Logout complete'));
  }

  getAccessToken$(): Observable<string> {
    return this.oidcSecurityService.getAccessToken();
  }

  getIdToken$(): Observable<string> {
    return this.oidcSecurityService.getIdToken();
  }

  getUserData$(): Observable<UserDataResult> {
    return this.oidcSecurityService.userData$;
  }

  isAuthenticated(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$.pipe(map((result) => result.isAuthenticated));
  }

  isAuthenticatedValue(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$.pipe(map((result) => result.isAuthenticated));
  }
}
