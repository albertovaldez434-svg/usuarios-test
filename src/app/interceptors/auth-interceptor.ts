import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
import { AuthUser } from '../models/users';
import { Localstorage } from '../services/localstorage';
import { loginResponseDTO } from '../models/loginDTO';

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

    return from(this.secureStorage.getItem<loginResponseDTO>('authUser')).pipe(
      switchMap((dataLogin) => {

        if (dataLogin?.accessToken) {
          const tokenExp = this.checkTokenExpired(dataLogin.accessToken);

          if (tokenExp) {
            console.log('token expirado');
            localStorage.removeItem('authUser');
            return next.handle(req);
          }

          // SI ES FORMDATA -> NO TOCAR CONTENT-TYPE
          if (req.body instanceof FormData) {

            const formDataReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${dataLogin.accessToken}`,
              }
            });

            return next.handle(formDataReq);
          }

          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${dataLogin.accessToken}`,
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
