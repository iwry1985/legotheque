import { Routes } from '@angular/router';
import { LegoDetailResolver } from './core/resolvers/legodetail.resolver';
import { Home } from './features/pages/home/home';
import { notConnectedGuard } from './core/guards/not-connected.guard';
import { HomeSwitch } from './features/pages/home-switch/home-switch/home-switch';
import { UserResolver } from './core/resolvers/user.resolver';
import { isUserGuard } from './core/guards/is-user.guard';
import { DashboardResolver } from './core/resolvers/dashboard.resolver';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/pages/login/login').then((c) => c.Login),
    canActivate: [notConnectedGuard],
  },
  {
    path: 'inscription',
    loadComponent: () =>
      import('./features/pages/register/register').then((c) => c.Register),
  },
  {
    path: 'themes',
    loadComponent: () =>
      import('./features/pages/theme-list/theme-list').then((c) => c.ThemeList),
  },
  {
    path: 'lego',
    loadComponent: () =>
      import('./features/pages/lego-list/lego-list').then((c) => c.LegoList),
  },
  {
    path: 'lego/:id',
    loadComponent: () =>
      import('./features/pages/lego-detail/lego-detail').then(
        (c) => c.LegoDetail
      ),
    resolve: { data: LegoDetailResolver },
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/pages/dashboard/dashboard').then((c) => c.Dashboard),
    canActivate: [isUserGuard],
    resolve: { data: DashboardResolver },
  },
  {
    path: '',
    component: HomeSwitch,
    resolve: { legoStats: UserResolver },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
