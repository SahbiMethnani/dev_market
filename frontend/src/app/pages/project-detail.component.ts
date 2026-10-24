import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { MessageService } from '../core/message.service';
import { Project } from '../core/models';
import { ProjectService } from '../core/project.service';
import { errorMessage } from '../core/utils';

@Component({
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  template: `
    @if (project; as p) {
      <a routerLink="/projects" class="back-link">← Retour aux projets</a>
      <div class="card detail">
        @if (svc.imageUrl(p.screenshot); as img) {
          <img [src]="img" [alt]="p.title" class="hero" />
        }
        <h2>{{ p.title }}</h2>
        <p class="price big">{{ p.price | currency: 'USD' : 'symbol' : '1.0-2' }}</p>
        <p class="muted">Publié par <strong>{{ p.developer_username }}</strong> le {{ p.created_at | date: 'dd/MM/yyyy' }}</p>
        <p class="description">{{ p.description }}</p>
        @if (p.url) {
          <p><a [href]="p.url" target="_blank" rel="noopener noreferrer">Voir le projet en ligne ↗</a></p>
        }

        @if (error) { <p class="error">{{ error }}</p> }

        <div class="row">
          @if (auth.user(); as u) {
            @if (u.role === 'client') {
              <button class="btn" (click)="contact(p)">Contacter le développeur / Négocier</button>
            } @else if (u.id === p.developer_id) {
              <a class="btn secondary" [routerLink]="['/projects', p.id, 'edit']">Modifier</a>
              <button class="btn danger" (click)="remove(p)">Supprimer</button>
            }
          } @else {
            <a class="btn" routerLink="/login">Connectez-vous pour contacter le développeur</a>
          }
        </div>
      </div>
    } @else if (notFound) {
      <p class="error">Projet introuvable.</p>
    } @else {
      <p class="muted">Chargement…</p>
    }
  `,
})
export class ProjectDetailComponent implements OnInit {
  svc = inject(ProjectService);
  auth = inject(AuthService);
  private messages = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  project?: Project;
  notFound = false;
  error = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.get(id).subscribe({
      next: (p) => (this.project = p),
      error: () => (this.notFound = true),
    });
  }

  contact(p: Project) {
    this.messages.start(p.id).subscribe({
      next: (c) => this.router.navigate(['/messages', c.id]),
      error: (e) => (this.error = errorMessage(e)),
    });
  }

  remove(p: Project) {
    if (!confirm('Supprimer définitivement ce projet ?')) return;
    this.svc.delete(p.id).subscribe({
      next: () => this.router.navigate(['/my-projects']),
      error: (e) => (this.error = errorMessage(e)),
    });
  }
}
