import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Observable, from, tap } from 'rxjs';

export const userLoggedGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn().pipe(tap((isLogged: boolean) => !isLogged ? router.navigateByUrl('/login') : ''));
};
