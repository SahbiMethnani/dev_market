import { Routes } from '@angular/router';
import { authGuard, developerGuard } from './core/guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'projects' },
  { path: 'login', loadComponent: () => import('./pages/login.component').then((m) => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register.component').then((m) => m.RegisterComponent) },
  { path: 'projects', loadComponent: () => import('./pages/project-list.component').then((m) => m.ProjectListComponent) },
  {
    path: 'projects/new',
    canActivate: [authGuard, developerGuard],
    loadComponent: () => import('./pages/project-form.component').then((m) => m.ProjectFormComponent),
  },
  {
    path: 'projects/:id/edit',
    canActivate: [authGuard, developerGuard],
    loadComponent: () => import('./pages/project-form.component').then((m) => m.ProjectFormComponent),
  },
  { path: 'projects/:id', loadComponent: () => import('./pages/project-detail.component').then((m) => m.ProjectDetailComponent) },
  {
    path: 'my-projects',
    canActivate: [authGuard, developerGuard],
    loadComponent: () => import('./pages/my-projects.component').then((m) => m.MyProjectsComponent),
  },
  {
    path: 'messages',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/conversations.component').then((m) => m.ConversationsComponent),
  },
  {
    path: 'messages/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/chat.component').then((m) => m.ChatComponent),
  },
  { path: '**', redirectTo: 'projects' },
];
