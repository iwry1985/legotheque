import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { IWanted } from '../models/wanted.model';
import { ILegotheque } from '../models/legotheque.model';

@Injectable({
  providedIn: 'root',
})
export class WantedService {
  private readonly _http = inject(HttpClient);
  private readonly _url = environment.apiUrl + 'wanted';

  getWantedSet = (setid: number): Observable<IWanted> => {
    return this._http.get<IWanted>(`${this._url}/${setid}`);
  };

  addSetToList = (setid: number): Observable<IWanted> => {
    return this._http.post<IWanted>(`${this._url}`, {
      setid,
    });
  };

  removeSet = (wantedid: number): Observable<boolean> => {
    return this._http.delete<boolean>(`${this._url}/${wantedid}`);
  };
}
