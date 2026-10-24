import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { MessageService } from '../core/message.service';
import { Conversation, Message } from '../core/models';
import { errorMessage } from '../core/utils';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  template: `
    <a routerLink="/messages" class="muted">← Toutes les conversations</a>
    <div class="card chat">
      @if (info) {
        <div class="chat-head">
          <strong>{{ info.other_username }}</strong>
          <span class="muted"> — Projet : </span>
          <a [routerLink]="['/projects', info.project_id]">{{ info.project_title }}</a>
        </div>
      }
      <div class="chat-box" #box>
        @for (m of messages; track m.id) {
          <div class="bubble" [class.mine]="m.sender_id === auth.user()?.id">
            <div>{{ m.content }}</div>
            <small>{{ m.created_at | date: 'dd/MM HH:mm' }}</small>
          </div>
        }
        @if (messages.length === 0) {
          <p class="muted center">Commencez la discussion : présentez-vous et proposez votre prix.</p>
        }
      </div>
      @if (error) { <p class="error">{{ error }}</p> }
      <form class="chat-form" (ngSubmit)="send()">
        <input name="text" [(ngModel)]="text" placeholder="Votre message…" maxlength="2000" autocomplete="off" />
        <button class="btn" [disabled]="!text.trim() || sending">Envoyer</button>
      </form>
    </div>
  `,
})
export class ChatComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  private svc = inject(MessageService);
  private route = inject(ActivatedRoute);

  @ViewChild('box') box?: ElementRef<HTMLDivElement>;

  id = 0;
  info?: Conversation;
  messages: Message[] = [];
  text = '';
  sending = false;
  error = '';
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.get(this.id).subscribe({
      next: (i) => (this.info = i),
      error: (e) => (this.error = errorMessage(e)),
    });
    this.load();
    this.timer = setInterval(() => this.load(), 4000); // actualisation toutes les 4 s
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  private load() {
    this.svc.messages(this.id).subscribe((list) => {
      const changed = list.length !== this.messages.length;
      this.messages = list;
      if (changed) setTimeout(() => this.scrollDown());
    });
  }

  send() {
    const content = this.text.trim();
    if (!content) return;
    this.sending = true;
    this.error = '';
    this.svc.send(this.id, content).subscribe({
      next: (m) => {
        this.messages = [...this.messages, m];
        this.text = '';
        this.sending = false;
        setTimeout(() => this.scrollDown());
      },
      error: (e) => { this.error = errorMessage(e); this.sending = false; },
    });
  }

  private scrollDown() {
    const el = this.box?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
