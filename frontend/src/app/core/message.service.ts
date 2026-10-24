import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Conversation, Message } from './models';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/conversations`;

  start(projectId: number) {
    return this.http.post<Conversation>(this.api, { project_id: projectId });
  }

  list() {
    return this.http.get<Conversation[]>(this.api);
  }

  get(id: number) {
    return this.http.get<Conversation>(`${this.api}/${id}`);
  }

  messages(id: number) {
    return this.http.get<Message[]>(`${this.api}/${id}/messages`);
  }

  send(id: number, content: string) {
    return this.http.post<Message>(`${this.api}/${id}/messages`, { content });
  }
}
