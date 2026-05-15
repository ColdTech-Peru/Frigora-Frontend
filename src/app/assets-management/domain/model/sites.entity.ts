/**
 * Represents a Site entity.
 * @class
 */
export class Sites {
  id: number | string | null;
  name: string;
  address: string;
  contactName: string;
  phone: string;
  created: string;
  updated: string;

  /**
   * Creates a new Site instance.
   */
  constructor({
                id = null,
                name = '',
                address = '',
                contactName = '',
                phone = '',
                created = '',
                updated = ''
              }: {
    id?: number | string | null;
    name?: string;
    address?: string;
    contactName?: string;
    phone?: string;
    created?: string;
    updated?: string;
  } = {}) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.contactName = contactName;
    this.phone = phone;
    this.created = created;
    this.updated = updated;
  }
}
