import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { LegothequeService } from 'app/features/services/legotheque.service';

export const DashboardResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
) => {
  const _legothequeService = inject(LegothequeService);

  return _legothequeService.getUserDashboard();
};
