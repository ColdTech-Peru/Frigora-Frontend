import { BaseResource } from '../../shared/infrastructure/base-response';

export interface ReviewsResource extends BaseResource  {
  id: any;
  serviceRequestId: string;
  ownerId: string;
  technicianId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: ReviewsResource[];
}
