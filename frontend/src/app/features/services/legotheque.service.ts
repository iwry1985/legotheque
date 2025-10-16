import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ILegotheque } from '../models/legotheque.model';

@Injectable({
  providedIn: 'root',
})
export class LegothequeService {
  private readonly _http = inject(HttpClient);
  private readonly _url = environment.apiUrl + 'legotheque';

  getSetFromLegotheque = (reference: string): Observable<ILegotheque> => {
    return this._http.get<ILegotheque>(`${this._url}/${reference}`);
  };
}
