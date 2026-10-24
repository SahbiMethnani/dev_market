import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, Role, User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = environment.apiUrl;

  user = signal<User | null>(this.loadUser());

  get token(): string | null {
    return localStorage.getItem('token');
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/login`, { email, password })
      .pipe(tap((r) => this.store(r)));
  }

  register(data: { username: string; email: string; password: string; role: Role }) {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/register`, data)
      .pipe(tap((r) => this.store(r)));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  private store(r: AuthResponse) {
    localStorage.setItem('token', r.access_token);
    localStorage.setItem('user', JSON.stringify(r.user));
    this.user.set(r.user);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
