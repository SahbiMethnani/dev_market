import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../core/models';
import { ProjectService } from '../core/project.service';

@Component({
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="page-header">
      <h2>Mes projets</h2>
      <a class="btn" routerLink="/projects/new">+ Publier un projet</a>
    </div>
    @if (projects.length === 0) { <p class="muted">Vous n'avez encore publié aucun projet.</p> }
    <div class="grid">
      @for (p of projects; track p.id) {
        <div class="card project">
          @if (svc.imageUrl(p.screenshot); as img) {
            <img [src]="img" [alt]="p.title" />
          } @else {
            <div class="placeholder">Pas de capture</div>
          }
          <h3>{{ p.title }}</h3>
          <p class="price">{{ p.price | currency: 'USD' : 'symbol' : '1.0-2' }}</p>
          <div class="row">
            <a class="btn small" [routerLink]="['/projects', p.id]">Voir</a>
            <a class="btn small secondary" [routerLink]="['/projects', p.id, 'edit']">Modifier</a>
            <button class="btn small danger" (click)="remove(p)">Supprimer</button>
          </div>
        </div>
      }
    </div>
  `,
})
export class MyProjectsComponent implements OnInit {
  svc = inject(ProjectService);
  projects: Project[] = [];

  ngOnInit() {
    this.svc.mine().subscribe((r) => (this.projects = r));
  }

  remove(p: Project) {
    if (!confirm(`Supprimer « ${p.title} » ?`)) return;
    this.svc.delete(p.id).subscribe(() => (this.projects = this.projects.filter((x) => x.id !== p.id)));
  }
}
