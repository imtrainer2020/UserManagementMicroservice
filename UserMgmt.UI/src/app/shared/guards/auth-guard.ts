import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is not logged in, redirect to login page with the returnUrl query param
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if the user has the required role
  const allowedRoles: string[] = route.data?.['roles'] || [];

  if (allowedRoles.length === 0)
    return true; // No specific roles required, allow access

  const userRole = authService.userRole() ?? '';
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
  const hasRole = normalizedAllowedRoles.includes(userRole.toLowerCase());

  if (!hasRole) {
    // authService.logout(); // Log them out just in case
    router.navigate(['/unauthorized']); // Send them back to safety
    return false;
  }

  return true;
}
