import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ILegoset } from 'app/features/models/legoset.model';
import { ILegotheque } from 'app/features/models/legotheque.model';
import { IWanted } from 'app/features/models/wanted.model';
import { LegosetService } from 'app/features/services/legoset.service';
import { LegothequeService } from 'app/features/services/legotheque.service';
import { WantedService } from 'app/features/services/wanted.service';
import { catchError, forkJoin, of } from 'rxjs';

export const LegoDetailResolver: ResolveFn<{
  legoset: ILegoset | null;
  myLego: ILegotheque | null;
  wanted: IWanted | null;
}> = (route: ActivatedRouteSnapshot) => {
  const _legosetService = inject(LegosetService);
  const _legothequeService = inject(LegothequeService);
  const _wantedService = inject(WantedService);

  const id = route.params['id'];

  return forkJoin({
    legoset: _legosetService.getLegoset(id),
    myLego: _legothequeService.getSet(id),
    wanted: _wantedService.getWantedSet(id),
  }).pipe(
    catchError((err) => {
      console.error('Erreur de chargement des données', err);
      return of({ legoset: null, myLego: null, wanted: null });
    })
  );
};
