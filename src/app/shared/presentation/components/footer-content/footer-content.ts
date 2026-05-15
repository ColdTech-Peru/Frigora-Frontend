import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-footer-content',
  imports: [
    TranslatePipe
  ],
  templateUrl: './footer-content.html',
  standalone: true,
  styleUrl: './footer-content.css'
})
export class FooterContent {

}
