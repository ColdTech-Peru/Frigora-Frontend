import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private snackBar = inject(MatSnackBar);

  showPassword = false;

  userForm = this.fb.nonNullable.group({
    name: ['Juan Pablo'],
    lastName: ['Contreras Garcia'],
    user: ['juanupc'],
    email: [{ value: 'juanupc@gmail.com', disabled: true }],
    registrationDate: [{ value: '09-18-2025', disabled: true }],
    lastConnection: [{ value: '11-11-2025', disabled: true }],
    password: ['juan2025'],
    plan: [{ value: 'Plan Pro', disabled: true }]
  });

  ngOnInit(): void {
    // Aquí podrías suscribirte a tu AuthStoreService para llenar el formulario con datos reales
    // const currentUser = this.authStore.currentUser;
    // if (currentUser) this.userForm.patchValue(currentUser);
  }

  saveProfile(): void {
    console.log('Saved profile', this.userForm.getRawValue());
    this.snackBar.open(this.translate.instant('admin.alert.save'), 'OK', { duration: 3000 });
  }

  cancelChanges(): void {
    this.userForm.reset();
    this.snackBar.open(this.translate.instant('admin.alert.cancel'), 'OK', { duration: 3000 });
  }
}
