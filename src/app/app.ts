import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // <-- Importamos Router y RouterOutlet
import { CommonModule } from '@angular/common'; // <-- Necesario si usas *ngIf
import { Layout } from './shared/presentation/components/layout/layout';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './shared/infrastructure/theme-service';
import { Header } from './shared/presentation/components/header/header';
@Component({
  selector: 'app-root',
  // Asegúrate de agregar RouterOutlet y CommonModule aquí:
  imports: [Layout, RouterOutlet, CommonModule, Header],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Frigora-Frontend');

  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router); // <-- Inyectamos el router aquí

  private translate: TranslateService;

  // Creamos el getter para saber si estamos en la ruta de IAM
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
