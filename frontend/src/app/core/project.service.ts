import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Project } from './models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/projects`;

  list(q?: string) {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    return this.http.get<Project[]>(this.api, { params });
  }

  mine() {
    return this.http.get<Project[]>(`${this.api}/mine`);
  }

  get(id: number) {
    return this.http.get<Project>(`${this.api}/${id}`);
  }

  create(data: FormData) {
    return this.http.post<Project>(this.api, data);
  }

  update(id: number, data: FormData) {
    return this.http.put<Project>(`${this.api}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  imageUrl(path: string | null): string | null {
    return path ? `${environment.apiUrl}${path}` : null;
  }
}
