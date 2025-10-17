import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ILegoset } from 'app/features/models/legoset.model';
import { ILegotheque } from 'app/features/models/legotheque.model';
import { LegosetService } from 'app/features/services/legoset.service';
import { LegothequeService } from 'app/features/services/legotheque.service';
import { catchError, forkJoin, of } from 'rxjs';

export const LegoDetailResolver: ResolveFn<{
  legoset: ILegoset | null;
  myLego: ILegotheque | null;
}> = (route: ActivatedRouteSnapshot) => {
  const _legosetService = inject(LegosetService);
  const _legothequeService = inject(LegothequeService);

  const id = route.params['id'];

  return forkJoin({
    legoset: _legosetService.getLegoset(id),
    myLego: _legothequeService.getSet(id),
  }).pipe(
    catchError((err) => {
      console.error('Erreur de chargement des données', err);
      return of({ legoset: null, myLego: null });
    })
  );
};
