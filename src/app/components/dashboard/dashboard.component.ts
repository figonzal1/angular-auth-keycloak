import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styles: [
    `
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
    `,
  ],
})
export class DashboardComponent {
  private oidcSecurityService = inject(OidcSecurityService);
  private router = inject(Router);

  userData$ = this.oidcSecurityService.userData$;
  accessToken$ = this.oidcSecurityService.getAccessToken();

  logout(): void {
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
