import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { Header } from '../header/header'
import { Sidebar } from '../sidebar/sidebar'
import { FooterContent } from '../footer-content/footer-content';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    Header,
    Sidebar,
    FooterContent
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {}
