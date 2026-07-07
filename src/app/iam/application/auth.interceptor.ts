
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStoreService } from './iam.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthStoreService);
  const token = auth.currentToken;

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
