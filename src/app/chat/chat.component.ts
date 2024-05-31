import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

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

  messageunSubscribe!: () => void;
  form = new FormGroup({
    message: new FormControl('', { nonNullable: true }),
  });

  user$ = this.authService.user$;
  messages$ = this.chatService.messages$;

  ngOnInit() {
    this.chatService.loadMessages();
    this.messageunSubscribe = this.chatService.listenToMessages();
  }
  ngOnDestroy() {
    this.messageunSubscribe();
  }
  sendMessage() {
    const message = this.form.controls.message.value;

    this.chatService
      .sendMessage(message)
      .pipe(
        tap(() => {
          this.form.reset();
        })
      )
      .subscribe();
  }

  async logout() {
    this.authService.logout();
  }
}
