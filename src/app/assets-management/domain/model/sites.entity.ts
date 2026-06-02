export class Sites {
  id: number | string | null;
  name: string;
  address: string;
  contactName: string;
  phone: string;

  latitude: number | null;
  longitude: number | null;

  created: string;
  updated: string;

  constructor({
                id = null,
                name = '',
                address = '',
                contactName = '',
                phone = '',
                latitude = null,
                longitude = null,
                created = '',
                updated = ''
              } = {}) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.contactName = contactName;
    this.phone = phone;
    this.latitude = latitude;
    this.longitude = longitude;
    this.created = created;
    this.updated = updated;
  }
}
