import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login-callback',
  standalone: true,
  templateUrl: './callback.component.html',
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
export class CallbackComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.checkAuth().subscribe((result) => {
      if (result.isAuthenticated) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
