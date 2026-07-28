import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
import { SecureStorageService } from '../services/securestorage-service';
import { loginResponseDTO } from '../models/loginDTO';
import { UsuariosService } from '../services/usuarios';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private jwtHelper = new JwtHelperService;
  private UsuarioService = inject(UsuariosService);

  checkTokenExpired(tokenString: string): boolean {
    return this.jwtHelper.isTokenExpired(tokenString);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const user = this.UsuarioService.loggedData$();

    if (!user?.accessToken) {
      return next.handle(req);
    }

    const tokenExp = this.checkTokenExpired(user.accessToken);

    if (tokenExp) {
      // console.log('token expirado');
      localStorage.removeItem('authUser');
      return next.handle(req);
    }

    const token = user.accessToken;

    if (req.body instanceof FormData) {
      const formDataReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });

      return next.handle(formDataReq);
    }

    const request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return next.handle(request);
  }


}
