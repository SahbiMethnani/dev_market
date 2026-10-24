import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { errorMessage } from '../core/utils';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-shell">
    <div class="card narrow">
      <h2>Connexion</h2>
      <form (ngSubmit)="submit()" #f="ngForm">
        <label>Email
          <input type="email" name="email" [(ngModel)]="email" required />
        </label>
        <label>Mot de passe
          <input type="password" name="password" [(ngModel)]="password" required />
        </label>
        @if (error) { <p class="error">{{ error }}</p> }
        <button class="btn" [disabled]="f.invalid || loading">Se connecter</button>
      </form>
      <p class="muted">Pas de compte ? <a routerLink="/register">Inscrivez-vous</a></p>
    </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  error = '';
  loading = false;

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/projects']),
      error: (e) => { this.error = errorMessage(e); this.loading = false; },
    });
  }
}
