import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-4">
      <nav class="bg-white shadow-md mb-6">
        <div class="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 class="text-xl font-bold">Dashboard</h1>
          <button
            (click)="logout()"
            class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Datos del Usuario</h2>

          <div *ngIf="userData$ | async as userData" class="space-y-4">
            <div>
              <p class="text-gray-600">Datos Completos:</p>
              <pre class="text-sm bg-gray-50 p-4 rounded overflow-auto">{{ userData | json }}</pre>
            </div>

            <div class="mt-6 p-4 bg-gray-100 rounded">
              <p class="text-gray-600 mb-2">Token de Acceso:</p>
              <p class="text-xs break-all font-mono">{{ (accessToken$ | async) }}</p>
            </div>
          </div>

          <div *ngIf="!(userData$ | async)" class="text-center py-8">
            <p class="text-gray-500">Cargando datos del usuario...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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
