import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  from,
  map,
  Observable,
  of,
  switchMap,
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

  readonly user$ = this._user.pipe(
    switchMap(() => this.appwriteAPI.account.getSession('current')),
    catchError(err => of(null)),
  )

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
    return this.user$.pipe(map((user) => user === null ? false : true));
  }

  async logout() {
    try {
      await this.appwriteAPI.account.deleteSession('current');
    } catch (e) {
      console.log(`${e}`);
    } finally {
      this._user.next(null);
      this.router.navigateByUrl('/login');
    }
  }
}