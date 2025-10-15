import { Routes } from '@angular/router';
import { legosetResolver } from './core/resolvers/legoset-resolver';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/pages/login/login').then((c) => c.Login),
  },
  {
    path: 'themes',
    loadComponent: () =>
      import('./features/pages/theme-list/theme-list').then((c) => c.ThemeList),
  },
  {
    path: 'lego/:id',
    loadComponent: () =>
      import('./features/pages/lego-detail/lego-detail').then(
        (c) => c.LegoDetail
      ),
    resolve: { legoset: legosetResolver },
  },
];
