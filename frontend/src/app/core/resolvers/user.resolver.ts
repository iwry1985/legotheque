import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from 'app/features/services/auth.service';
import { LegothequeService } from 'app/features/services/legotheque.service';

export const UserResolver: ResolveFn<any> = (route, state) => {
  const _authService = inject(AuthService);
  const _legothequeService = inject(LegothequeService);

  const user = _authService.connectedUser();

  if (user?.userid) return _legothequeService.getUserStats();
  else return;
};
