import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthStoreService } from '../../../application/iam.store';
import {LanguageSwitcher} from '../../../../shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-register',
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
    MatRadioModule,
    MatProgressSpinnerModule,
    MatIconModule,
    LanguageSwitcher
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public authStore = inject(AuthStoreService);
  private translate = inject(TranslateService);

  loading = false;
  registrationSuccess = false;
  localErrors: { message: string }[] = [];

  registerForm = this.fb.nonNullable.group({
    roles: ['Owner', Validators.required],
    name: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  roleOptions = [
    {
      label: this.translate.instant('auth.register.roles.owner'),
      value: 'Owner',
      description: this.translate.instant('auth.register.roles.ownerDesc')
    },
    {
      label: this.translate.instant('auth.register.roles.provider'),
      value: 'Provider',
      description: this.translate.instant('auth.register.roles.providerDesc')
    }
  ];

  async onSubmit(): Promise<void> {
    this.localErrors = [];
    this.registrationSuccess = false;

    if (this.registerForm.invalid) {
      this.localErrors.push({
        message: this.translate.instant('validation.required', { field: this.translate.instant('common.all') })
      });
      return;
    }

    this.loading = true;
    const formData = this.registerForm.getRawValue();

    const success = await this.authStore.register(formData);

    if (success) {
      this.registrationSuccess = true;
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 1500);
    }

    this.loading = false;
  }
}
