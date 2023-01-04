​import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { AuthService } from './auth.service';

@Component({
 selector: 'app-login',
 standalone: true,
 imports: [ReactiveFormsModule],
 template: `
   <div class="app-container">
     <div class="content">
       <span class="appwrite-chat">Angular Chat</span>

       <div class="login-container">
         <form [formGroup]="form" class="login-form" (ngSubmit)="login()">
           <p class="login-name">
             <label for="name">Name</label>

             <input
               type="text"
               id="name"
               formControlName="name"
               placeholder="Enter Name"
             />
           </p>

           <button type="submit">Start Chatting</button>
         </form>
       </div>
     </div>
   </div>
 `
})
export class LoginComponent {
 form = new FormGroup({
   name: new FormControl('', { nonNullable: true }),
 });

 constructor(
   private authService: AuthService,
   private router: Router
 ) {}

 login() {
   const name = this.form.controls.name.value;

   this.authService
     .login(name)
     .pipe(
       tap(() => {
         this.router.navigate(['/chat']);
       })
     )
     .subscribe();
 }
}