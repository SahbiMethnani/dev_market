import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="navbar">
        <a routerLink="/projects" class="brand" (click)="navOpen = false">Dev<span>Market</span></a>
        <button
          type="button"
          class="nav-toggle"
          (click)="navOpen = !navOpen"
          [attr.aria-expanded]="navOpen"
          aria-controls="main-nav"
          aria-label="Menu de navigation"
        >
          @if (navOpen) {
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          } @else {
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          }
        </button>
        <nav id="main-nav" [class.is-open]="navOpen">
          <a routerLink="/projects" routerLinkActive="active" (click)="navOpen = false">Projets</a>
          @if (auth.user(); as u) {
            @if (u.role === 'developer') {
              <a routerLink="/my-projects" routerLinkActive="active" (click)="navOpen = false">Mes projets</a>
              <a routerLink="/projects/new" routerLinkActive="active" (click)="navOpen = false">Publier</a>
            }
            <a routerLink="/messages" routerLinkActive="active" (click)="navOpen = false">Messagerie</a>
            <span class="user">{{ u.username }} · {{ u.role === 'developer' ? 'Développeur' : 'Client' }}</span>
            <button type="button" class="btn small secondary" (click)="auth.logout(); navOpen = false">Déconnexion</button>
          } @else {
            <a routerLink="/login" routerLinkActive="active" (click)="navOpen = false">Connexion</a>
            <a routerLink="/register" class="btn small" (click)="navOpen = false">Inscription</a>
          }
        </nav>
      </header>
      <main class="container">
        <router-outlet />
      </main>
      <footer class="app-footer">DevMarket achetez et vendez des projets prêts à l'emploi by <a href="https://omc-solutions.netlify.app/" target="_blank" rel="noopener noreferrer">OMC Solutions</a></footer>
    </div>
  `,
})
export class AppComponent {
  auth = inject(AuthService);
  navOpen = false;
}
