import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { LoginDto } from '../models/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: 'login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  login() {
    if (this.form.valid) {
      const loginDto = this.form.value as LoginDto;
      this.authService
        .login(loginDto)
        .pipe(
          tap(() => {
            this.router.navigate(['/chat']);
          })
        )
        .subscribe();
    }
  }
}