import { Routes } from '@angular/router';
import { LegoDetailResolver } from './core/resolvers/legodetail.resolver';
import { notConnectedGuard } from './core/guards/not-connected.guard';
import { HomeSwitch } from './features/pages/home-switch/home-switch/home-switch';
import { UserResolver } from './core/resolvers/user.resolver';
import { isUserGuard } from './core/guards/is-user.guard';
import { ThemeResolver } from './core/resolvers/theme.resolver';

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
    path: 'lego/list',
    loadComponent: () =>
      import('./features/pages/lego-list/lego-list').then((c) => c.LegoList),
  },
  {
    path: 'lego/themes',
    loadComponent: () =>
      import('./features/pages/theme-list/theme-list').then((c) => c.ThemeList),
    resolve: { themes: ThemeResolver },
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
  },
  {
    path: 'profil',
    loadComponent: () =>
      import('./features/pages/profile/profile').then((c) => c.Profile),
    canActivate: [isUserGuard],
    resolve: { legoStats: UserResolver },
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/pages/home/home').then((c) => c.Home),
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
