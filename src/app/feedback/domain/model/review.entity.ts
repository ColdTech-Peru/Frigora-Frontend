export interface ReviewData {
  id?: string;
  serviceRequestId: string;
  ownerId: string;
  technicianId: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export class Review {
  id: string;
  serviceRequestId: string;
  ownerId: string;
  technicianId: string;
  rating: number;
  comment: string;
  createdAt: string;

  constructor(data: ReviewData) {
    this.id = data.id || '';
    this.serviceRequestId = data.serviceRequestId;
    this.ownerId = data.ownerId;
    this.technicianId = data.technicianId;
    this.rating = data.rating;
    this.comment = data.comment;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
