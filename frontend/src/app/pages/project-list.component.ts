import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Project } from '../core/models';
import { ProjectService } from '../core/project.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe],
  template: `
    <div class="page-header">
      <h2>Projets à vendre</h2>
      <form (ngSubmit)="load()" class="search">
        <input name="q" [(ngModel)]="q" placeholder="Rechercher un projet…" />
        <button class="btn small">Rechercher</button>
      </form>
    </div>

    @if (loading) { <p class="muted">Chargement…</p> }
    @else if (projects.length === 0) { <p class="muted">Aucun projet trouvé.</p> }

    <div class="grid">
      @for (p of projects; track p.id) {
        <a class="card project" [routerLink]="['/projects', p.id]">
          @if (svc.imageUrl(p.screenshot); as img) {
            <img [src]="img" [alt]="p.title" />
          } @else {
            <div class="placeholder">Pas de capture</div>
          }
          <h3>{{ p.title }}</h3>
          <p class="price">{{ p.price | currency: 'USD' : 'symbol' : '1.0-2' }}</p>
          <p class="muted">par {{ p.developer_username }}</p>
        </a>
      }
    </div>
  `,
})
export class ProjectListComponent implements OnInit {
  svc = inject(ProjectService);
  projects: Project[] = [];
  q = '';
  loading = true;

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.list(this.q.trim() || undefined).subscribe({
      next: (r) => { this.projects = r; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
