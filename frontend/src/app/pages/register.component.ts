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

        <form (ngSubmit)="submit()" #f="ngForm" novalidate>

          <label>
            Nom d'utilisateur
            <input
              type="text"
              name="username"
              [(ngModel)]="username"
              #usernameCtrl="ngModel"
              minlength="3"
              maxlength="30"
              pattern="[a-zA-Z0-9_-]+"
              required
              autocomplete="username"
              placeholder="Example : sahbi123"
            />
          </label>

          @if (usernameCtrl.invalid && usernameCtrl.touched) {
            <p class="error">
              @if (usernameCtrl.errors?.['required']) {
                Le nom d'utilisateur est obligatoire.
              } @else if (usernameCtrl.errors?.['minlength']) {
                Le nom d'utilisateur doit contenir au moins 3 caractères.
              } @else if (usernameCtrl.errors?.['maxlength']) {
                Le nom d'utilisateur ne doit pas dépasser 30 caractères.
              } @else if (usernameCtrl.errors?.['pattern']) {
                Utilisez uniquement des lettres, des chiffres, _ ou -.
              }
            </p>
          }

          <label>
            Email
            <input
              type="email"
              name="email"
              [(ngModel)]="email"
              #emailCtrl="ngModel"
              required
              email
              maxlength="254"
              autocomplete="email"
              placeholder="Entrer votre adresse email"
            />
          </label>

          @if (emailCtrl.invalid && emailCtrl.touched) {
            <p class="error">
              @if (emailCtrl.errors?.['required']) {
                L'adresse email est obligatoire.
              } @else {
                Veuillez saisir une adresse email valide.
              }
            </p>
          }

          <label>
            Mot de passe
            <input
              type="password"
              name="password"
              [(ngModel)]="password"
              #passwordCtrl="ngModel"
              minlength="8"
              maxlength="128"
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,128}"
              required
              autocomplete="new-password"
              placeholder="Choix un mot de passe sécurisé"
            />
          </label>

          @if (passwordCtrl.invalid && passwordCtrl.touched) {
            <p class="error">
              @if (passwordCtrl.errors?.['required']) {
                Le mot de passe est obligatoire.
              } @else if (passwordCtrl.errors?.['minlength'] || passwordCtrl.errors?.['maxlength']) {
                Le mot de passe doit contenir entre 8 et 128 caractères.
              } @else if (passwordCtrl.errors?.['pattern']) {
                Utilisez au moins une minuscule, une majuscule, un chiffre et un caractère spécial.
              }
            </p>
          }

          <label>
            Je suis
            <select
              name="role"
              [(ngModel)]="role"
              #roleCtrl="ngModel"
              required
            >
              <option value="client">Client (je cherche un projet)</option>
              <option value="developer">Développeur (je vends mes projets)</option>
            </select>
          </label>

          @if (roleCtrl.invalid && roleCtrl.touched) {
            <p class="error">Veuillez sélectionner un rôle.</p>
          }

          @if (error) {
            <p class="error">{{ error }}</p>
          }

          <button class="btn" type="submit" [disabled]="f.invalid || loading">
            {{ loading ? 'Inscription en cours...' : "S'inscrire" }}
          </button>
        </form>

        <p class="muted">
          Déjà inscrit ? <a routerLink="/login">Connexion</a>
        </p>
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
    if (this.loading) return;

    this.error = '';

    const username = this.username.trim();
    const email = this.email.trim();

    if (!username || !email || !this.password) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    this.loading = true;

    this.auth.register({
      username,
      email,
      password: this.password,
      role: this.role,
    }).subscribe({
      next: () => {
        this.router.navigate(['/projects']);
      },
      error: (e) => {
        this.error = errorMessage(e);
        this.loading = false;
      },
    });
  }
}
