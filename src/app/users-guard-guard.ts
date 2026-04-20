import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuariosService } from './services/usuarios';
import { map, take } from 'rxjs';

export const usersGuardGuard: CanActivateFn = (route, state) => {

  const authService = inject(UsuariosService);
  const router = inject(Router);

  return authService.LoginData$.pipe(
    take(1), 
    map(loginData => {
      console.log('Login data in guard:', loginData); // Agrega este log para verificar el valor de loginData
      if (loginData?.idUser) {
        return true; // Permitir acceso si el usuario está autenticado
      } else {
        return router.createUrlTree(
          ['/login'], // Redirigir al usuario a la página de inicio de sesión 
          { queryParams: { returnUrl: state.url } } // Opcional: pasar la URL de retorno para redirigir después del inicio de sesión
        );
      }
    })
  );

};
