import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-map-location-picker',
  standalone: true,
  templateUrl: './map-location-picker.component.html',
  styleUrls: ['./map-location-picker.component.css']
})
export class MapLocationPickerComponent
  implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer')
  mapContainer!: ElementRef<HTMLDivElement>;

  @Output()
  locationSelected = new EventEmitter<any>();

  private map!: L.Map;
  private marker!: L.Marker;

  selectedLocation = {
    lat: -12.046374,
    lng: -77.042793,
    name: '',
    address: ''
  };

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {

    this.map = L.map(this.mapContainer.nativeElement)
      .setView(
        [this.selectedLocation.lat, this.selectedLocation.lng],
        13
      );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    this.marker = L.marker(
      [this.selectedLocation.lat, this.selectedLocation.lng],
      {
        draggable: true
      }
    ).addTo(this.map);

    this.marker.on('dragend', () => {

      const pos = this.marker.getLatLng();

      this.selectedLocation.lat = pos.lat;
      this.selectedLocation.lng = pos.lng;

      this.reverseGeocode(pos.lat, pos.lng);

    });

    this.reverseGeocode(
      this.selectedLocation.lat,
      this.selectedLocation.lng
    );
  }

  async reverseGeocode(
    lat: number,
    lng: number
  ): Promise<void> {

    try {

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );

      const data = await response.json();

      this.selectedLocation.name =
        data.display_name ?? `${lat}, ${lng}`;

      this.selectedLocation.address =
        data.display_name ?? `${lat}, ${lng}`;

      this.locationSelected.emit(
        this.selectedLocation
      );

    } catch (error) {

      console.error(error);

    }
  }
}
