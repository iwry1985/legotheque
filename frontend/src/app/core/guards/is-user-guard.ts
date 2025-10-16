import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from 'app/features/services/auth.service';

export const isUserGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (authService.connectedUser()) return true;
  return false;
};
