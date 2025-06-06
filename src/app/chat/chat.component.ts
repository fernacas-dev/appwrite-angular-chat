import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, ReplaySubject, map, merge, share, startWith, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChatService, Message } from '../services/chat.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly chatService = inject(ChatService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly themeService = inject(ThemeService);

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  isDarkMode() {
    return this.themeService.darkMode$;
  };

  form: FormGroup = this.formBuilder.group({
    message: ['', [Validators.required]],
  });

  user$ = this.authService.user$;
  messages$: Observable<Message[]> = this.chatService.messages$;

  _send$ = new ReplaySubject<string>();

  send$ = this._send$.pipe(
    switchMap((message) => this.chatService.sendMessage(message)),
    share(),
  );

  loading$: Observable<boolean> = new Observable<boolean>();

  ngOnInit() {
    this.chatService.startWSConnection();

    this.loading$ = merge(
      this.send$.pipe(map(() => true)),
      this.messages$.pipe(map(() => false)),
    ).pipe(startWith(true), share());
  }
  ngOnDestroy() {
    this.chatService.stopWSConnection();
  }
  sendMessage() {
    const message = this.form.controls['message'].value;
    this.form.reset();
    this._send$.next(message);
    window.scrollTo(0, window.scrollY + 2000);
  }

  async logout() {
    this.authService.logout();
  }
}
