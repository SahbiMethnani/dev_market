import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Project } from '../core/models';
import { ProjectService } from '../core/project.service';
import { errorMessage } from '../core/utils';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card narrow">
      <h2>{{ editId ? 'Modifier le projet' : 'Publier un projet' }}</h2>
      <form (ngSubmit)="submit()" #f="ngForm">
        <label>Nom du projet *
          <input name="title" [(ngModel)]="title" minlength="3" maxlength="150" required />
        </label>
        <label>Prix (TND) *
          <input type="number" name="price" [(ngModel)]="price" min="1" step="0.01" required />
        </label>
        <label>Description * (10 caractères minimum)
          <textarea name="description" rows="6" [(ngModel)]="description" minlength="10" required></textarea>
        </label>
        <label>URL du projet <span class="muted">(optionnel)</span>
          <input type="url" name="url" [(ngModel)]="url" placeholder="https://…" />
        </label>
        <label>Capture d'écran <span class="muted">(optionnel — PNG, JPEG ou WEBP, 5 Mo max)</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" (change)="onFile($event)" />
        </label>

        @if (preview) { <img [src]="preview" class="preview" alt="Aperçu" /> }
        @if (existingScreenshot && !file) {
          <label class="inline">
            <input type="checkbox" name="rm" [(ngModel)]="removeScreenshot" /> Supprimer la capture actuelle
          </label>
        }

        @if (error) { <p class="error">{{ error }}</p> }
        <div class="row">
          <button class="btn" [disabled]="f.invalid || loading">
            {{ editId ? 'Enregistrer' : 'Publier' }}
          </button>
          <a class="btn secondary" routerLink="/my-projects">Annuler</a>
        </div>
      </form>
    </div>
  `,
})
export class ProjectFormComponent implements OnInit {
  private svc = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  editId: number | null = null;
  title = '';
  price: number | null = null;
  description = '';
  url = '';
  file: File | null = null;
  preview: string | null = null;
  existingScreenshot: string | null = null;
  removeScreenshot = false;
  error = '';
  loading = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.svc.get(this.editId).subscribe((p: Project) => {
        this.title = p.title;
        this.price = p.price;
        this.description = p.description;
        this.url = p.url ?? '';
        this.existingScreenshot = p.screenshot;
        this.preview = this.svc.imageUrl(p.screenshot);
      });
    }
  }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.error = '';
    if (f && f.size > 5 * 1024 * 1024) {
      this.error = 'Capture trop lourde (5 Mo maximum)';
      input.value = '';
      return;
    }
    this.file = f;
    if (f) {
      const reader = new FileReader();
      reader.onload = () => (this.preview = reader.result as string);
      reader.readAsDataURL(f);
    }
  }

  submit() {
    const fd = new FormData();
    fd.append('title', this.title);
    fd.append('price', String(this.price));
    fd.append('description', this.description);
    if (this.url.trim()) fd.append('url', this.url.trim());   // champ optionnel
    if (this.file) fd.append('screenshot', this.file);        // champ optionnel
    if (this.editId) fd.append('remove_screenshot', String(this.removeScreenshot));

    this.loading = true;
    this.error = '';
    const req = this.editId ? this.svc.update(this.editId, fd) : this.svc.create(fd);
    req.subscribe({
      next: (p) => this.router.navigate(['/projects', p.id]),
      error: (e) => { this.error = errorMessage(e); this.loading = false; },
    });
  }
}
