
export class Technician {
  id?: number;
  name: string;
  specialty: string;
  phone?: string;
  providerId: number;
  averageRating: number;

  constructor(props: {
    id?: number;
    name: string;
    specialty: string;
    phone?: string;
    providerId: number;
    averageRating?: number;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.specialty = props.specialty;
    this.phone = props.phone;
    this.providerId = props.providerId;
    this.averageRating = props.averageRating || 0;
  }
}
