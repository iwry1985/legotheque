import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly _url = environment.apiUrl + 'users';
  private readonly _authService = inject(AuthService);

  getUser = (): Observable<IUser> | undefined => {
    return this._http.get<IUser>(`${this._url}`);
  };
}
