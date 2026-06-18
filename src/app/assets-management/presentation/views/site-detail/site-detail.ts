import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AssetsManagementStore } from '../../../application/assets-management.store';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-site-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatIcon
  ],
  templateUrl: './site-detail.html',
  styleUrls: ['./site-detail.css']
})
export class SiteDetail {

  private store = inject(AssetsManagementStore);
  private route = inject(ActivatedRoute);

  public siteId =
    this.route.snapshot.paramMap.get('id') ?? '';

  public site =
    this.store.getSitesById(this.siteId);

}
