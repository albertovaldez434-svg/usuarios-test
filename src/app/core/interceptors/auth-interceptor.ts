import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
import { AuthService } from 'src/app/features/auth/services/auth-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private jwtHelper = new JwtHelperService;
  private authService = inject(AuthService);

  checkTokenExpired(tokenString: string): boolean {
    return this.jwtHelper.isTokenExpired(tokenString);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const user = this.authService.loggedData$();

    if (!user?.accessToken) {
      return next.handle(req);
    }

    const tokenExp = this.checkTokenExpired(user.accessToken);

    if (tokenExp) {
      // // console.log('token expirado');
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
