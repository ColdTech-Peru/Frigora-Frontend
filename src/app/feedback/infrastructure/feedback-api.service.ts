import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ReviewsApiEndpoint } from './reviews-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Review } from '../domain/model/review.entity';
import { environment } from '../../../environments/environment';
import { ReviewsResource } from './reviews-response';
import { ReviewsAssembler } from './reviews-assembler'; // <-- Importamos el Assembler

@Injectable({ providedIn: 'root' })
export class FeedbackApiService extends BaseApi {
  private readonly reviewsEndpoint: ReviewsApiEndpoint;
  private readonly assembler: ReviewsAssembler; // <-- Creamos una variable para el Assembler

  constructor(private http: HttpClient) {
    super();
    this.reviewsEndpoint = new ReviewsApiEndpoint(http);
    this.assembler = new ReviewsAssembler(); // <-- Lo inicializamos aquí
  }

  getAllReviews(): Observable<Review[]> {
    return this.reviewsEndpoint.getAll();
  }

  getReviewById(id: string): Observable<Review> {
    return this.reviewsEndpoint.getById(id);
  }

  createReview(review: Review): Observable<Review> {
    return this.reviewsEndpoint.create(review);
  }

  getReviewsByServiceRequest(serviceRequestId: string): Observable<Review[]> {
    const url = `${environment.apiBaseUrl}${environment.reviewsEndpointPath}?serviceRequestId=${serviceRequestId}`;
    return this.http.get<ReviewsResource[]>(url).pipe(
      map(resources => resources.map(resource => this.assembler.toEntityFromResource(resource)))
    );
  }
}
