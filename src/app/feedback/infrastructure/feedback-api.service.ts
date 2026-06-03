import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackApiService {

  private readonly baseUrl =
    `${environment.apiBaseUrl}${environment.reviewsEndpointPath}`;

  constructor(private http: HttpClient) {}

  createReview(reviewData: any) {
    return this.http.post(this.baseUrl, reviewData);
  }

  getReviewById(reviewId: string | number) {
    return this.http.get(`${this.baseUrl}/${reviewId}`);
  }

  getReviewsByServiceRequest(serviceRequestId: string | number) {
    return this.http.get(this.baseUrl, {
      params: { serviceRequestId: String(serviceRequestId) }
    });
  }

  getAllReviews() {
    return this.http.get(this.baseUrl);
  }
}
