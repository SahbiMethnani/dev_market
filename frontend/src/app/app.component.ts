import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <a routerLink="/projects" class="brand">DevMarket</a>
      <nav>
        <a routerLink="/projects" routerLinkActive="active">Projets</a>
        @if (auth.user(); as u) {
          @if (u.role === 'developer') {
            <a routerLink="/my-projects" routerLinkActive="active">Mes projets</a>
            <a routerLink="/projects/new" routerLinkActive="active">Publier</a>
          }
          <a routerLink="/messages" routerLinkActive="active">Messagerie</a>
          <span class="user">{{ u.username }} ({{ u.role === 'developer' ? 'dév' : 'client' }})</span>
          <button class="btn small secondary" (click)="auth.logout()">Déconnexion</button>
        } @else {
          <a routerLink="/login" routerLinkActive="active">Connexion</a>
          <a routerLink="/register" class="btn small">Inscription</a>
        }
      </nav>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  auth = inject(AuthService);
}
