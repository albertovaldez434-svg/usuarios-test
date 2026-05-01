import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuariosService } from './services/usuarios';
import { filter, map, take } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

export const usersGuard: CanActivateFn = (route, state) => {

  const authService = inject(UsuariosService);
  const router = inject(Router);
  const jwtHelper = new JwtHelperService;

  return authService.LoginData$.pipe(
    filter(loginData => loginData !== null),
    take(1),
    map(loginData => {
      // console.log('Guard hit for:', state.url);
      // console.log('Login data in guard:', loginData); // Agrega este log para verificar el valor de loginData
      const requiredRole = route.data['idRol'];

      const token = loginData?.access_token;

      if (!token || jwtHelper.isTokenExpired(token)) {
        console.log('token expired or missing');
        localStorage.removeItem('authUser');

        return router.createUrlTree(
          ['/login'],
          { queryParams: { returnUrl: state.url } }
        );
      }

      if (!requiredRole) {
        return true;
      }

      const hasAccess = loginData?.idRol === requiredRole;

      if (hasAccess) {
        return true;
      }

      return router.createUrlTree(['/profile']);
    }));

};
