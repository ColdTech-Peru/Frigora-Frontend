import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Layout } from './shared/presentation/components/layout/layout';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './shared/infrastructure/theme-service';
import { Header } from './shared/presentation/components/header/header';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Frigora-Frontend');

  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private translate: TranslateService;

  get isAuthRoute(): boolean {
    return this.router.url.includes('/auth');
  }

  constructor() {
    this.translate = inject(TranslateService);
    this.translate.addLangs(['en', 'es']);
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.theme.init();
  }
}
