import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ILegotheque, ILegothequeUpdate } from '../models/legotheque.model';

@Injectable({
  providedIn: 'root',
})
export class LegothequeService {
  private readonly _http = inject(HttpClient);
  private readonly _url = environment.apiUrl + 'legotheque';

  getSet = (setid: number): Observable<ILegotheque> => {
    return this._http.get<ILegotheque>(`${this._url}/${setid}`);
  };

  addSet = (setid: number) => {
    return this._http.post<ILegotheque>(`${this._url}`, {
      setid,
    });
  };

  removeSet = (legothequeid: number): Observable<boolean> => {
    return this._http.delete<boolean>(`${this._url}/${legothequeid}`);
  };

  updateCollection = (
    legothequeid: number,
    body: ILegothequeUpdate
  ): Observable<ILegotheque> => {
    return this._http.patch<ILegotheque>(`${this._url}/${legothequeid}`, {
      body,
    });
  };
}
