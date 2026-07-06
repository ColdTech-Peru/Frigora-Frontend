import { Component, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStoreService } from '../../../application/iam.store';
import {LanguageSwitcher} from '../../../../shared/presentation/components/language-switcher/language-switcher';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    LanguageSwitcher,
    MatCheckbox
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public authStore = inject(AuthStoreService);

  loading = false;

  loginForm = this.fb.nonNullable.group({
    username: [''],
    password: [''],
    rememberMe: [false]
  });

  constructor() {
    const rememberedUser = localStorage.getItem('rememberedUsername');

    if (rememberedUser) {
      this.loginForm.patchValue({
        username: rememberedUser,
        rememberMe: true
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.loading = true;

    const { username, password, rememberMe } =
      this.loginForm.getRawValue();

    if (rememberMe) {
      localStorage.setItem('rememberedUsername', username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }

    const success = await this.authStore.login(username, password);

    this.loading = false;

    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}

