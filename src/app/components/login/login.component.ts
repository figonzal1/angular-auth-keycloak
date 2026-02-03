import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  constructor(private oidcSecurityService: OidcSecurityService) {}

  login(): void {
    this.oidcSecurityService.authorize();
  }
}
