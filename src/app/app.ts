import { Component, inject, signal } from '@angular/core';
import {Layout} from './shared/presentation/components/layout/layout';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './shared/infrastructure/theme-services';

@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frigora-Frontend');
  private readonly theme = inject(ThemeService);
  private translate: TranslateService;
  ngOnInit(): void {
    this.theme.init();
  }
  constructor() {
    this.translate = inject(TranslateService);
    this.translate.addLangs(['en', 'es']);
    this.translate.use('en');
  }
}
