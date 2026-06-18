import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import { CommonModule } from '@angular/common'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { AuthStoreService } from '../../../../iam/application/iam.store'

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

  items: NavItem[] = []
  router = inject(Router)
  private auth = inject(AuthStoreService)

  constructor() {
    this.buildMenu()
  }

  private buildMenu(): void {
    const role = this.auth.currentUserRole

    if (role === 'Provider') {
      this.items = [
        { labelKey: 'provider.dashboard.title', icon: 'dashboard', route: '/provider/dashboard' },
        { labelKey: 'nav.technician_management', icon: 'group', route: '/provider/technicians' },
        { labelKey: 'nav.services_hub', icon: 'hub', route: '/provider/services-hub' },
        {
          labelKey: 'nav.services', icon: 'build',
          children: [
            { labelKey: 'nav.service-list', icon: 'list', route: '/provider/services' },
            { labelKey: 'nav.completed-services', icon: 'check_circle', route: '/provider/services/completed' },
            { labelKey: 'nav.rejected-canceled', icon: 'cancel', route: '/provider/services/rejected-canceled' },
            { labelKey: 'nav.in-progress', icon: 'autorenew', route: '/provider/services/in-progress' }
          ]
        },
      ]
    } else {
      // Owner
      this.items = [
        { labelKey: 'nav.dashboard', icon: 'dashboard', route: '/dashboard' },
        { labelKey: 'nav.sites', icon: 'location_on', route: '/sites' },
        {
          labelKey: 'nav.monitoring', icon: 'monitor_heart',
          children: [
            { labelKey: 'nav.equipments', icon: 'settings', route: '/equipments' },
            { labelKey: 'nav.alerts', icon: 'notifications', route: '/alerts' },
          ]
        },
        { labelKey: 'nav.services', icon: 'build', route: '/services' },
        { labelKey: 'nav.reporting', icon: 'bar_chart', route: '/reporting' },
      ]
    }
  }

  navigate(route: string): void {
    this.router.navigate([route])
  }

  hasChildren(item: NavItem): boolean {
    return !!item.children?.length
  }
}
