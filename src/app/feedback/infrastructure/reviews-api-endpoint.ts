import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Review } from '../domain/model/review.entity';
import { ReviewsResource, ReviewsResponse } from './reviews-response';
import { ReviewsAssembler } from './reviews-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class ReviewsApiEndpoint extends BaseApiEndpoint<Review, ReviewsResource, ReviewsResponse, ReviewsAssembler> {
  constructor(http: HttpClient) {
    super(http, environment.apiBaseUrl + environment.reviewsEndpointPath, new ReviewsAssembler());
  }
}
