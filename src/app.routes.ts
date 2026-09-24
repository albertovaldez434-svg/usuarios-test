import { Routes } from '@angular/router';
import { usersGuard } from '@core/guards/users-guard';

export const routes: Routes = [
    {
        path: 'dashboard',
        canActivate: [usersGuard],
        loadComponent: () => import('@features/dashboard/pages/dashboard.page').then(m => m.DashboardPage)
    },

    {
        path: 'users',
        canActivate: [usersGuard],
        data: { idRol: 1 },
        loadComponent: () => import('@features/users/pages/usuarios.page').then(m => m.UsuariosPage)
    },

    {
        path: 'profile',
        canActivate: [usersGuard],
        loadComponent: () => import('@features/profile/pages/profile.page').then(m => m.ProfilePage)
    },

    {
        path: 'login',
        loadComponent: () => import('@features/auth/pages/login.page').then(m => m.LoginPage)
    },

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];