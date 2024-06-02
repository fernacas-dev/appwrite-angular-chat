import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subscription, map, merge, share, startWith, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChatService, Message } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly chatService = inject(ChatService);
  private readonly formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    message: ['', [Validators.required]],
  });

  user$ = this.authService.user$;
  messages$: Observable<Message[]> = this.chatService.messages$;

  _send$ = new ReplaySubject<string>();

  send$ = this._send$.pipe(
    switchMap((message) => this.chatService.sendMessage(message)),
    tap(() => this.form.reset()),
    share(),
  );

  loading$: Observable<boolean> = new Observable<boolean>();

  ngOnInit() {
    this.chatService.startWSConnection();

    this.loading$ = merge(
      this.send$.pipe(map(() => true)),
      this.messages$.pipe(map(() => false)),
    ).pipe(startWith(true));
  }
  ngOnDestroy() {
    this.chatService.stopWSConnection();
  }
  sendMessage() {
    this._send$.next(this.form.controls['message'].value);

    window.scrollTo(0, window.scrollY + 2000);
  }

  async logout() {
    this.authService.logout();
  }
}
