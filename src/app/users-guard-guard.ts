import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuariosService } from './services/usuarios';
import { map, take } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

export const usersGuardGuard: CanActivateFn = (route, state) => {

  const authService = inject(UsuariosService);
  const router = inject(Router);
  const jwtHelper = new JwtHelperService;

  return authService.LoginData$.pipe(
    take(1),
    map(loginData => {
      console.log('Login data in guard:', loginData); // Agrega este log para verificar el valor de loginData

      const token = loginData?.access_token;

      if (token && !jwtHelper.isTokenExpired(token)) {
        return true;
      }

      console.log('token in login data expired'); // Agrega este log para verificar el valor de loginData
      localStorage.removeItem('loginData');

      return router.createUrlTree(
        ['/login'], // Redirigir al usuario a la página de inicio de sesión 
        { queryParams: { returnUrl: state.url } } // Opcional: pasar la URL de retorno para redirigir después del inicio de sesión
      );

    })
  );

};
