import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuariosService } from './services/usuarios';
import { Localstorage } from './services/localstorage';
import { filter, map, take } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

export const usersGuard: CanActivateFn = (route, state) => {

  const authService = inject(UsuariosService);
  const secureSService = inject(Localstorage)
  const router = inject(Router);
  const jwtHelper = new JwtHelperService;

  const requiredRole = route.data['idRol'];
  const token = authService.loggedData$()?.accessToken;
  const user = authService.loggedData$();

  if (user?.idRol === 999) {
    return true;
  }

  if (!token || jwtHelper.isTokenExpired(token)) {
    console.log('token expired or missing');
    secureSService.clear();

    return router.createUrlTree(
      ['/login'],
      { queryParams: { returnUrl: state.url } }
    );
  }

  if (!requiredRole) {
    return true;
  }

  const hasAccess = authService.loggedData$()?.idRol === requiredRole;

  if (hasAccess) {
    return true;
  }

  return router.createUrlTree(['/profile']);

};
