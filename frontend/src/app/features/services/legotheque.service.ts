import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {
  ILegotheque,
  ILegothequeUpdate,
  UPDATE_LEGOTHEQUE_OMIT_KEYS,
} from '../models/legotheque.model';
import { omit } from 'app/core/utilitaires/obj-utils.utils';
import { IUserLegotheque } from '../models/user-legotheque.model';

@Injectable({
  providedIn: 'root',
})
export class LegothequeService {
  private readonly _http = inject(HttpClient);
  private readonly _url = environment.apiUrl + 'legotheque';

  private _range = signal<'all' | 'year' | 'month'>('all');

  _dashboardResource = httpResource(() => ({
    url: `${this._url}/dashboard`,
    params: { range: this._range() },
  }));
  // ============================
  // Méthodes standard
  // ============================
  getSet = (setid: number): Observable<ILegotheque> =>
    this._http.get<ILegotheque>(`${this._url}/${setid}`);

  addSet = (setid: number) =>
    this._http.post<ILegotheque>(`${this._url}`, { setid });

  removeSet = (legothequeid: number): Observable<boolean> =>
    this._http.delete<boolean>(`${this._url}/${legothequeid}`);

  updateCollection = (
    legothequeid: number,
    body: ILegothequeUpdate
  ): Observable<ILegotheque> =>
    this._http.patch<ILegotheque>(`${this._url}/${legothequeid}`, { body });

  updateLego = (myLego: ILegotheque): Observable<ILegotheque> => {
    const body = omit(myLego, UPDATE_LEGOTHEQUE_OMIT_KEYS);
    return this.updateCollection(myLego.legothequeid, body);
  };

  getUserStats = (): Observable<IUserLegotheque> =>
    this._http.get<IUserLegotheque>(`${this._url}/stats`);

  getUserCollection = (): Observable<ILegotheque[]> => {
    return this._http.get<ILegotheque[]>(`${this._url}`);
  };

  // ============================
  // Dashboard
  // ============================
  getUserDashboard() {
    return this._dashboardResource;
  }

  setDashboardRange(range: 'all' | 'year' | 'month') {
    this._range.set(range);
    this._dashboardResource?.reload();
  }
}
