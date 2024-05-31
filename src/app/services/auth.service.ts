import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  from,
  map,
  Observable,
  tap,
} from 'rxjs';
import { AppwriteApi } from '../appwrite';
import { LoginDto, RegisterDto } from '../models/login.model';
import { ID } from 'appwrite';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly appwriteAPI = inject(AppwriteApi);
  private readonly router = inject(Router);

  private _user = new BehaviorSubject<any | null>(
    null
  );
  readonly user$ = from(this.appwriteAPI.account.getSession('current'));// this._user.asObservable();

  login(loginDto: LoginDto) {
    const authReq = this.appwriteAPI.account.createEmailSession(loginDto.email, loginDto.password);

    return from(authReq).pipe(
      concatMap(() => this.appwriteAPI.account.get()),
      tap((user: any) => this._user.next(user))
    );
  }

  register(registerDto: RegisterDto) {
    const authReq = this.appwriteAPI.account.create(ID.unique(), registerDto.email, registerDto.password, registerDto.name);
    return from(authReq);
  }

  isLoggedIn(): Observable<boolean> {
    return from(this.appwriteAPI.account.get())
      .pipe(
        tap(user => this._user.next(user)),
        map((user) => true),
        catchError(async (err) => { console.log(`error: ${JSON.stringify(err)}`); return false }));
  }

  async logout() {
    try {
      await this.appwriteAPI.account.deleteSession('current');
    } catch (e) {
      console.log(`${e}`);
    } finally {
      this.router.navigate(['/']);
      this._user.next(null);
    }
  }
}