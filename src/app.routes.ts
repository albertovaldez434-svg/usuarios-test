import { Routes } from '@angular/router';
import { usersGuard } from './app/core/guards/users-guard';

export const routes: Routes = [
    {
        path: 'dashboard',
        canActivate: [usersGuard],
        loadComponent: () => import('./app/features/dashboard/pages/dashboard.page').then(m => m.DashboardPage)
    },

    {
        path: 'users',
        canActivate: [usersGuard],
        data: { idRol: 1 },
        loadComponent: () => import('./app/features/users/pages/usuarios.page').then(m => m.UsuariosPage)
    },

    {
        path: 'profile',
        canActivate: [usersGuard],
        loadComponent: () => import('./app/features/profile/pages/profile.page').then(m => m.ProfilePage)
    },

    {
        path: 'login',
        loadComponent: () => import('./app/features/auth/pages/login.page').then(m => m.LoginPage)
    },

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];