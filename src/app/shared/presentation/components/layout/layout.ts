import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { Header } from '../header/header'
import { Sidebar } from '../sidebar/sidebar'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    Header,
    Sidebar,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {}
