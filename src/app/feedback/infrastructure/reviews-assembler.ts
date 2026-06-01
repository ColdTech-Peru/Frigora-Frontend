import { Review } from '../domain/model/review.entity';
import { ReviewsResource, ReviewsResponse } from './reviews-response';

export class ReviewsAssembler {
  toEntityFromResource(resource: ReviewsResource): Review {
    return new Review({
      id: resource.id,
      serviceRequestId: resource.serviceRequestId,
      ownerId: resource.ownerId,
      technicianId: resource.technicianId,
      rating: resource.rating,
      comment: resource.comment,
      createdAt: resource.createdAt
    });
  }

  toResourceFromEntity(entity: Review): ReviewsResource {
    return {
      id: entity.id,
      serviceRequestId: entity.serviceRequestId,
      ownerId: entity.ownerId,
      technicianId: entity.technicianId,
      rating: entity.rating,
      comment: entity.comment,
      createdAt: entity.createdAt
    } as ReviewsResource;
  }

  toEntitiesFromResponse(response: ReviewsResponse): Review[] {
    return response.reviews.map(resource => this.toEntityFromResource(resource as ReviewsResource));
  }
}
