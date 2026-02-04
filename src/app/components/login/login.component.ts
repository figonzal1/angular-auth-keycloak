import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
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
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoading = false;

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  login(): void {
    this.isLoading = true;
    this.authService.login();
  }
}
