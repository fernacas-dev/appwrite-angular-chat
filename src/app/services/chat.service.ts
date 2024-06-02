import { inject, Injectable } from '@angular/core';
import { ID, Models, Permission, Query, RealtimeResponseEvent, Role } from 'appwrite';
import { BehaviorSubject, take, concatMap, filter, tap, map, switchMap, from, Observable, share, ReplaySubject, debounceTime } from 'rxjs';

import { AppwriteApi, AppwriteEnvironment } from '../appwrite';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.development';

export type Message = Models.Document & {
  user: string;
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly appwriteAPI = inject(AppwriteApi);
  private readonly appwriteEnvironment = inject(AppwriteEnvironment);
  private readonly authService = inject(AuthService);

  private _messages$ = new BehaviorSubject<Message[]>([]);
  readonly messages$ = this._messages$.asObservable().pipe(
    switchMap(() => this.loadMessages()),
    share(),
  );

  stopWSConnection!: () => void;

  startWSConnection() {
    this.stopWSConnection = this.appwriteAPI.database.client.subscribe(
      `databases.${environment.databaseId}.collections.${environment.chatCollectionId}.documents`,
      (res: RealtimeResponseEvent<Message>) => {
        if (res.events.includes(`databases.${environment.databaseId}.collections.${environment.chatCollectionId}.documents.*.create`)) {
          const messages: Message[] = [...this._messages$.value, res.payload];
          this._messages$.next(messages);
        }
      }
    );
  }

  loadMessages(): Observable<Message[]> {
    return from(this.appwriteAPI.database
      .listDocuments<Message>(
        this.appwriteEnvironment.databaseId,
        this.appwriteEnvironment.chatCollectionId,
        [
          Query.limit(1000),
          Query.orderAsc('$createdAt')
        ]
        // 100,
        //  0,
        //  undefined,
        //  undefined,
        //  [],
        //  ['ASC']
      ))
      .pipe(
        tap(() => console.log('getting messages')),
        map((response) => response.documents),
      )
  }

  sendMessage(message: string) {
    return this.authService.user$.pipe(
      debounceTime(100),
      filter((user: any) => !!user),
      take(1),
      switchMap((user) => !user.name ? this.appwriteAPI.account.get() : user),
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
      }),
    );
  }
}