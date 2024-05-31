import { Routes } from '@angular/router';
import { userLoggedGuard } from './guards/user-logged.guard';

export const routes: Routes = [
    {
        path: 'chat',
        loadComponent: () =>
            import('./chat/chat.component').then((m) => m.ChatComponent),
        canActivate: [userLoggedGuard]
        // CanActivateFn: [userLoggedGuard]
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./register/register.component').then((m) => m.RegisterComponent),
    },
    {
        path: '',
        loadComponent: () =>
            import('./login/login.component').then((m) => m.LoginComponent),
    },
];