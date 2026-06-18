import {
  Component,
  inject,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AssetsManagementStore } from '../../../application/assets-management.store';

import {
  MapLocationPickerComponent
} from '../../../../shared/presentation/views/map-location-picker.component/map-location-picker.component';

@Component({
  selector: 'app-site-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MapLocationPickerComponent
  ],
  templateUrl: './site-list.html',
  styleUrls: ['./site-list.css']
})
export class SiteList {

  public store = inject(AssetsManagementStore);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'name',
    'address',
    'contactName',
    'phone',
    'actions'
  ];

  dialogRef?: MatDialogRef<any>;

  @ViewChild('newSiteDialog')
  newSiteDialogTemplate!: TemplateRef<any>;

  showMap = false;

  newSite = {
    name: '',
    address: '',
    contactName: '',
    phone: '',
    latitude: null as number | null,
    longitude: null as number | null
  };

  openNewSiteDialog(): void {

    this.showMap = false;

    this.newSite = {
      name: '',
      address: '',
      contactName: '',
      phone: '',
      latitude: null,
      longitude: null
    };

    this.dialogRef = this.dialog.open(
      this.newSiteDialogTemplate,
      {
        width: '60vw',
        disableClose: true
      }
    );
  }

  handleLocationSelected(location: any): void {

    this.newSite.latitude = location.lat;
    this.newSite.longitude = location.lng;

    this.newSite.address = location.address;

    console.log('Location selected:', location);
  }

  saveNewSite(): void {

    if (
      !this.newSite.name ||
      !this.newSite.address ||
      !this.newSite.contactName ||
      !this.newSite.phone
    ) {
      alert(
        this.translate.instant(
          'sites.new.alert-required-fields'
        )
      );
      return;
    }

    try {

      this.store.addSite(this.newSite as any);

      alert(
        this.translate.instant(
          'sites.new.alert-site-created'
        )
      );

      this.closeDialog();

    } catch (error) {

      alert(
        this.translate.instant(
          'sites.new.alert-create-error'
        )
      );

      console.error(error);
    }
  }
  deleteSite(id: string): void {
    this.store.deleteSite(id);
  }
  closeDialog(): void {
    this.dialogRef?.close();
  }
}
