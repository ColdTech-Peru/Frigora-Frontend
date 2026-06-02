import { Component, Input, inject } from '@angular/core'
import { Router } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import { CommonModule } from '@angular/common'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'

export type UserRole = 'Owner' | 'Provider'

interface NavItem {
  labelKey: string
  icon: string
  route?: string
  children?: NavItem[]
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  @Input() set role(value: UserRole) {
    this._role = value
    this.buildMenu()
  }

  // Las dejamos públicas (sin protected) para que el HTML no se queje
  items: NavItem[] = []
  router = inject(Router)

  private _role: UserRole = 'Owner'

  constructor() {
    this.buildMenu()
  }

  private buildMenu(): void {
    // Aquí está tu menú forzado para probar solo la pantalla de técnicos
    this.items = [

      {
        labelKey: 'provider.dashboard.title', // Usa la llave de traducción que prefieras
        icon: 'dashboard',
        route: '/provider/dashboard'
      },

      {
        labelKey: 'nav.technician_management',
        icon: 'group',
        route: '/provider/technicians'
      },
      {
        labelKey: 'nav.services_hub',
        icon: 'group',
        route: '/provider/services-hub'
      },
      {
        labelKey: 'nav.completed-services',
        icon: 'group',
        route: '/provider/completed-services'
      },
      {
        labelKey: 'nav.service-list',
        icon: 'group',
        route: '/provider/service-list'
      }

    ];
  }

  // Funciones públicas para que el HTML (sidebar.html) pueda usarlas sin error
  navigate(route: string): void {
    this.router.navigate([route])
  }

  hasChildren(item: NavItem): boolean {
    return !!item.children?.length
  }
}
