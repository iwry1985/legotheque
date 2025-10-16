import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/features/services/auth.service';
import { switchMap } from 'rxjs';

export const tokenIntercept = new HttpContextToken<boolean>(() => true);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  //check if token
  const token = authService.connectedUser()?.token;

  if (req.context.get(tokenIntercept) && token) {
    const exp = new Date(authService.connectedUser()?.exp * 1000); //en millisecondes

    if (exp < new Date()) {
      //rafraîchir token
      return authService.refresh().pipe(
        switchMap(({ token }) =>
          next(
            req.clone({
              setHeaders: { authorization: 'Bearer +' + token },
            })
          )
        )
      );
    }
  }

  return next(req);
};
