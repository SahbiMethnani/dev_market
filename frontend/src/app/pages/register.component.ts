import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Role } from '../core/models';
import { errorMessage } from '../core/utils';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-shell">
    <div class="card narrow">
      <h2>Créer un compte</h2>
      <form (ngSubmit)="submit()" #f="ngForm">
        <label>Nom d'utilisateur
          <input name="username" [(ngModel)]="username" minlength="3" required />
        </label>
        <label>Email
          <input type="email" name="email" [(ngModel)]="email" required />
        </label>
        <label>Mot de passe (6 caractères min.)
          <input type="password" name="password" [(ngModel)]="password" minlength="6" required />
        </label>
        <label>Je suis
          <select name="role" [(ngModel)]="role">
            <option value="client">Client (je cherche un projet)</option>
            <option value="developer">Développeur (je vends mes projets)</option>
          </select>
        </label>
        @if (error) { <p class="error">{{ error }}</p> }
        <button class="btn" [disabled]="f.invalid || loading">S'inscrire</button>
      </form>
      <p class="muted">Déjà inscrit ? <a routerLink="/login">Connexion</a></p>
    </div>
    </div>
  `,
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  username = '';
  email = '';
  password = '';
  role: Role = 'client';
  error = '';
  loading = false;

  submit() {
    this.loading = true;
    this.error = '';
    this.auth
      .register({ username: this.username, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (e) => { this.error = errorMessage(e); this.loading = false; },
      });
  }
}
