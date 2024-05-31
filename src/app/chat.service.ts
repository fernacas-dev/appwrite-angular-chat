import { inject, Injectable } from '@angular/core';
import { ID, Models, Permission, RealtimeResponseEvent, Role } from 'appwrite';
import { BehaviorSubject, take, concatMap, filter } from 'rxjs';

import { AppwriteApi, AppwriteEnvironment } from './appwrite';
import { AuthService } from './auth.service';

export type Message = Models.Document & {
  user: string;
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private appwriteAPI = inject(AppwriteApi);
  private appwriteEnvironment = inject(AppwriteEnvironment);

  private _messages$ = new BehaviorSubject<Message[]>([]);
  readonly messages$ = this._messages$.asObservable();

  constructor(private authService: AuthService) { }

  loadMessages() {
    this.appwriteAPI.database
      .listDocuments<Message>(
        this.appwriteEnvironment.databaseId,
        this.appwriteEnvironment.chatCollectionId,
        [],
        /* 100,
         0,
         undefined,
         undefined,
         [],
         ['ASC']*/
      )
      .then((response) => {
        this._messages$.next(response.documents);
      });
  }

  sendMessage(message: string) {
    return this.authService.user$.pipe(
      filter((user: any) => !!user),
      take(1),
      concatMap((user: any) => {
        const data = {
          user: user!.name,
          message,
        };

        return this.appwriteAPI.database.createDocument(
          this.appwriteEnvironment.databaseId,
          this.appwriteEnvironment.chatCollectionId,
          ID.unique(),
          data,
          [
            Permission.read(Role.any()),
          ]
        );
      })
    );
  }

  listenToMessages() {
    return this.appwriteAPI.database.client.subscribe(
      `databases.chatdb.collections.messages.documents`,
      (res: RealtimeResponseEvent<Message>) => {
        if (res.events.includes('databases.chatdb.collections.messages.documents.*.create')) {
          const messages: Message[] = [...this._messages$.value, res.payload];

          this._messages$.next(messages);
        }
      }
    );
  }
}