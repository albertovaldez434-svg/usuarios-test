import { Routes } from '@angular/router';
import { usersGuard } from './app/users-guard';

export const routes: Routes = [
    {
        path: 'dashboard',
        canActivate: [usersGuard],
        loadComponent: () => import('./app/pages/dashboard/dashboard.page').then(m => m.DashboardPage)
    },

    {
        path: 'users',
        canActivate: [usersGuard],
        data: { idRol: 1 },
        loadComponent: () => import('./app/pages/usuarios/usuarios.page').then(m => m.UsuariosPage)
    },

    {
        path: 'profile',
        canActivate: [usersGuard],
        loadComponent: () => import('./app/pages/profile/profile.page').then(m => m.ProfilePage)
    },

    {
        path: 'login',
        loadComponent: () => import('./app/auth/login/login.page').then(m => m.LoginPage)
    },

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];