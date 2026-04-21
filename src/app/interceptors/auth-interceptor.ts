import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
import { AuthUser } from '../models/users';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private jwtHelper = new JwtHelperService;

  checkTokenExpired(tokenString: string): boolean {
    return this.jwtHelper.isTokenExpired(tokenString);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor: intercepting request');

    const dataLogin = localStorage.getItem('loginData');
    let storedLogin: AuthUser | null = null;

    if (dataLogin) {
      storedLogin = JSON.parse(dataLogin);
    }

    if (storedLogin?.access_token) {
      const tokenExp = this.checkTokenExpired(storedLogin.access_token);

      if (tokenExp) {
        console.log('token expirado');
        localStorage.removeItem('loginData');
        return next.handle(req);
      }
      
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${storedLogin.access_token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(req);
  }


}
