import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { LegosetService } from '../../features/services/legoset.service';
import { tap } from 'rxjs';
import { ILegoset } from '../../features/models/legoset.model';

export const legosetResolver: ResolveFn<ILegoset> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const _legosetService = inject(LegosetService);
  const id = route.params['id'];

  return _legosetService
    .getLegoset(id)
    .pipe(tap(() => console.log('legoset id', id)));
};
