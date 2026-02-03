import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styles: [`
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.6s ease-out;
    }
  `]
})
export class LoginComponent {
  isLoading = false;

  constructor(private oidcSecurityService: OidcSecurityService) {}

  login(): void {
    this.isLoading = true;
    this.oidcSecurityService.authorize();
  }
}
