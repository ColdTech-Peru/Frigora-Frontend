import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonToggleModule
  ],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css',
})
export class AdminSettings {
  private fb = inject(FormBuilder);
  public translate = inject(TranslateService);

  settingsForm = this.fb.group({
    lightMode: ['day'],
    notifications: this.fb.group({
      sms: [true],
      email: [false],
      calls: [false],
      social: [true]
    }),
    alarm: ['bells']
  });

  get alarmOptions() {
    return [
      { label: this.translate.instant('admin.settings.alarm.bells'), value: 'bells' },
      { label: this.translate.instant('admin.settings.alarm.chime'), value: 'chime' },
      { label: this.translate.instant('admin.settings.alarm.pop'), value: 'pop' },
      { label: this.translate.instant('admin.settings.alarm.none'), value: 'none' }
    ];
  }
}
