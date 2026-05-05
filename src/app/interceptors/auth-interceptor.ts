import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
import { AuthUser } from '../models/users';
import { Localstorage } from '../services/localstorage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private jwtHelper = new JwtHelperService;

  constructor(
    private secureStorage: Localstorage
  ) { }

  checkTokenExpired(tokenString: string): boolean {
    return this.jwtHelper.isTokenExpired(tokenString);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(this.secureStorage.getItem<AuthUser>('authUser')).pipe(
      switchMap((dataLogin) => {

        if (dataLogin?.access_token) {
          const tokenExp = this.checkTokenExpired(dataLogin.access_token);

          if (tokenExp) {
            console.log('token expirado');
            localStorage.removeItem('authUser');
            return next.handle(req);
          }

          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${dataLogin.access_token}`,
              'Content-Type': 'application/json'
            }
          });

          return next.handle(clonedReq);
        }

        return next.handle(req);
      })
    );
  }


}
