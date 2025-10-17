import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';
import { ILegotheque } from '../models/legotheque.model';

@Injectable({
  providedIn: 'root',
})
export class LegothequeService {
  private readonly _http = inject(HttpClient);
  private readonly _url = environment.apiUrl + 'legotheque';

  myLego: WritableSignal<ILegotheque | null> = signal<ILegotheque | null>(null);

  getSet = (setid: number): Observable<ILegotheque> => {
    return this._http.get<ILegotheque>(`${this._url}/${setid}`);
  };

  addSet = (setid: number, wanted?: boolean) => {
    return this._http.post<ILegotheque>(`${this._url}`, {
      setid,
      wanted,
    });
  };

  removeSet = (legothequeid: number) => {
    return this._http.delete<boolean>(`${this._url}/${legothequeid}`);
  };
}
