import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oidcSecurityService: OidcSecurityService) {}

  checkAuth(): Observable<any> {
    return this.oidcSecurityService.checkAuth();
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe();
  }

  getAccessToken$(): Observable<string> {
    return this.oidcSecurityService.getAccessToken();
  }

  getIdToken$(): Observable<string> {
    return this.oidcSecurityService.getIdToken();
  }

  getUserData$(): Observable<any> {
    return this.oidcSecurityService.userData$;
  }

  isAuthenticated(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map(result => result.isAuthenticated)
    );
  }

  isAuthenticatedValue(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map(result => result.isAuthenticated)
    );
  }
}
