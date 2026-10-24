import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from '../core/message.service';
import { Conversation } from '../core/models';

@Component({
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <h2>Messagerie</h2>
    @if (loaded && conversations.length === 0) {
      <p class="muted">Aucune conversation. Ouvrez un projet et cliquez sur « Contacter le développeur ».</p>
    }
    <div class="list">
      @for (c of conversations; track c.id) {
        <a class="card conv" [routerLink]="['/messages', c.id]">
          <div class="row between">
            <strong>{{ c.other_username }}</strong>
            <span class="muted">{{ c.last_message_at | date: 'dd/MM HH:mm' }}</span>
          </div>
          <div class="muted">Projet : {{ c.project_title }}</div>
          <div class="row between">
            <span class="snippet">{{ c.last_message ?? 'Aucun message pour le moment' }}</span>
            @if (c.unread > 0) { <span class="badge">{{ c.unread }}</span> }
          </div>
        </a>
      }
    </div>
  `,
})
export class ConversationsComponent implements OnInit, OnDestroy {
  private svc = inject(MessageService);
  conversations: Conversation[] = [];
  loaded = false;
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.load();
    this.timer = setInterval(() => this.load(), 8000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  private load() {
    this.svc.list().subscribe((r) => { this.conversations = r; this.loaded = true; });
  }
}
