import { inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { LegothequeService } from 'app/features/services/legotheque.service';

export const DashboardResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
) => {
  const _legothequeService = inject(LegothequeService);
  const range =
    (route.queryParamMap.get('range') as 'all' | 'year' | 'month') ?? 'all';

  const resource = _legothequeService.getUserDashboard(signal({ range }));

  resource.reload();

  return resource;
};
