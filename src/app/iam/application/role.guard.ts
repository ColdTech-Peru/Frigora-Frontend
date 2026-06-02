
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthStoreService } from './iam.store';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthStoreService);
  const router = inject(Router);

  if (!auth.isLoggedIn) {
    router.navigate(['/auth/login']);
    return false;
  }

  const requiredRole = route.data['roleRequired'];
  if (requiredRole && auth.currentUserRole !== requiredRole) {
    if (auth.currentUserRole === 'Provider') router.navigate(['/provider/dashboard']);
    else router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
