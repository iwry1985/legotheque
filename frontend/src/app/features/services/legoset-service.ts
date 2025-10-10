import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ILegoset } from '../models/legoset.model';

@Injectable({
  providedIn: 'root',
})
export class LegosetService {
  private readonly _http = inject(HttpClient);
  private readonly _url = environment.apiUrl + 'legoset';

  getLegoset = (id: number): Observable<ILegoset> => {
    return this._http.get<ILegoset>(`${this._url}/${id}`);
  };
}
