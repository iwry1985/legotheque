import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'environments/environment';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { tokenIntercept } from 'app/core/interceptors/token-interceptor';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _httpClient = inject(HttpClient);

  private _connectedUser = signal<any>(null);

  constructor() {
    const token = localStorage.getItem('token');

    if (token) this.setConnectedUser(token);
  }

  get connectedUser() {
    return this._connectedUser.asReadonly();
  }

  setConnectedUser(token: string) {
    //store to local storage
    localStorage.setItem('token', token);

    const decoded = jwtDecode<{
      role: string;
      id: number;
      username: string;
    }>(token);

    this._connectedUser.set({ token, ...decoded });
  }

  login = (email: string, pwd: string) => {
    return this._httpClient
      .post<{ token: string }>(environment.apiUrl + 'auth/login', {
        email,
        pwd,
      })
      .pipe(
        tap(({ token }) => {
          this.setConnectedUser(token);
        })
      );
  };

  refresh = () => {
    return this._httpClient
      .get<{ token: string }>(environment.apiUrl + 'auth/refresh', {
        params: { token: this._connectedUser().token },
        context: new HttpContext().set(tokenIntercept, false),
      })
      .pipe(
        tap(({ token }) => {
          this.setConnectedUser(token);
        })
      );
  };

  logout = () => {
    //clean localstorage
    localStorage.removeItem('token');

    //remove _connectedUser value
    this._connectedUser.set(null);
  };
}
