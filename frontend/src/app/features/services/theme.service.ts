import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ITheme } from '../models/theme.model';

export type ThemeWithImg = ITheme & {
  logo_url: string | undefined;
  img_url: string | undefined;
};

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

  getLogoAndBanner = (themes: ITheme[] = []): ThemeWithImg[] => {
    const res = themes.map((theme) => ({
      ...theme,
      logo_url:
        theme.img_num &&
        `/themes_assets/logo_${theme.img_num.toString().padStart(2, '0')}.png`,
      img_url:
        theme.img_num &&
        `/themes_assets/banner_${theme.img_num
          .toString()
          .padStart(2, '0')}.png`,
    }));

    return res.sort((a, b) => {
      if (a.img_url && !b.img_url) return -1;
      if (!a.img_url && b.img_url) return 1;

      return a.name.localeCompare(b.name);
    });
  };
}
