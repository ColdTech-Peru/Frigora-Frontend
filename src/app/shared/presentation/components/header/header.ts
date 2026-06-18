
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatTooltipModule } from '@angular/material/tooltip'
import { CommonModule } from '@angular/common'
import { LanguageSwitcher } from '../language-switcher/language-switcher'
import { ThemeService } from '../../../infrastructure/theme-service'
import { AuthStoreService } from '../../../../iam/application/iam.store'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    LanguageSwitcher,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  readonly theme = inject(ThemeService)
  private router = inject(Router)
  private translate = inject(TranslateService)
  readonly authStore = inject(AuthStoreService)

  get appName(): string {
    return this.translate.instant('common.appName')
  }

  goToDashboard(): void {
    const role = this.authStore.currentUserRole
    if (role === 'Provider') {
      this.router.navigate(['/provider/dashboard'])
    } else {
      this.router.navigate(['/dashboard'])
    }
  }

  handleSignOut(): void {
    this.authStore.logout()
    this.router.navigate(['/auth/login'])
  }
}
