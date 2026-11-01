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
      <form (ngSubmit)="search()" class="search">
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
          <p class="price">{{ p.price | currency: 'TND' : 'symbol' : '1.0-2' }}</p>
          <p class="muted">par {{ p.developer_username }}</p>
        </a>
      }
    </div>
    @if (total > pageSize) {
      <div class="row between">
        <button class="btn secondary" (click)="previousPage()" [disabled]="skip === 0">Précédent</button>
        <span class="muted">Page {{ pageNumber }} — {{ total }} projet(s)</span>
        <button class="btn secondary" (click)="nextPage()" [disabled]="skip + pageSize >= total">Suivant</button>
      </div>
    }
  `,
})
export class ProjectListComponent implements OnInit {
  svc = inject(ProjectService);
  projects: Project[] = [];
  q = '';
  loading = true;
  readonly pageSize = 12;
  skip = 0;
  total = 0;

  get pageNumber() {
    return Math.floor(this.skip / this.pageSize) + 1;
  }

  ngOnInit() { this.load(); }

  search() {
    this.skip = 0;
    this.load();
  }

  previousPage() {
    this.skip = Math.max(0, this.skip - this.pageSize);
    this.load();
  }

  nextPage() {
    if (this.skip + this.pageSize < this.total) {
      this.skip += this.pageSize;
      this.load();
    }
  }

  load() {
    this.loading = true;
    this.svc.list(this.q.trim() || undefined, this.skip, this.pageSize).subscribe({
      next: (r) => {
        this.projects = r.items;
        this.total = r.total;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
