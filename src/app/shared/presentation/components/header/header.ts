import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { LanguageSwitcher } from '../language-switcher/language-switcher'
import { ThemeService } from '../../../infrastructure/theme-service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    LanguageSwitcher,
    MatTooltip
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  readonly theme = inject(ThemeService);
  private router = inject(Router)
  private translate = inject(TranslateService)

  get appName(): string {
    return this.translate.instant('common.appName')
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }
}
