import { Component, Input, inject } from '@angular/core'
import { Router } from '@angular/router'
import {TranslatePipe, TranslateService} from '@ngx-translate/core'
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

  protected items: NavItem[] = []
  protected router = inject(Router)

  private _role: UserRole = 'Owner'

  constructor() {
    this.buildMenu()
  }

  private buildMenu(): void {
    if (this._role === 'Provider') {
      this.items = [
        { labelKey: 'nav.provider_dashboard',    icon: 'dashboard',   route: '/provider-dashboard' },
        {
          labelKey: 'nav.provider_services',
          icon: 'work',
          children: [
            { labelKey: 'nav.services_hub',  icon: 'account_tree', route: '/provider-services-hub' },
            { labelKey: 'nav.all_services',  icon: 'list',         route: '/provider-services-list' },
          ]
        },
        { labelKey: 'nav.technician_management', icon: 'group',      route: '/provider-technicians' },
      ]
      return
    }

    this.items = [
      { labelKey: 'nav.dashboard',  icon: 'home',          route: '/dashboard' },
      { labelKey: 'nav.sites',      icon: 'business',      route: '/sites' },
      { labelKey: 'nav.equipments', icon: 'dns',           route: '/equipments' },
      { labelKey: 'nav.services',   icon: 'work',          route: '/services' },
      { labelKey: 'nav.alerts',     icon: 'notifications', route: '/alerts' },
      { labelKey: 'nav.reports',    icon: 'bar_chart',     route: '/reporting' },
    ]
  }

  protected navigate(route: string): void {
    this.router.navigate([route])
  }

  protected hasChildren(item: NavItem): boolean {
    return !!item.children?.length
  }
}
