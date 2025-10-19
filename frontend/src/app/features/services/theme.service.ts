import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ITheme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _http = inject(HttpClient);
  private readonly _url = environment.apiUrl + 'theme';

  getThemes = (ids?: number[]): Observable<ITheme[]> => {
    const params = ids && new HttpParams().set('themeids', ids.join(','));

    return this._http.get<ITheme[]>(`${this._url}`, { params });
  };
}
