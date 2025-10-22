import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ITheme } from 'app/features/models/theme.model';
import { LegothequeService } from 'app/features/services/legotheque.service';
import { ThemeService } from 'app/features/services/theme.service';

export const ThemeResolver: ResolveFn<ITheme[]> = (route, state) => {
  const _themeService = inject(ThemeService);

  return _themeService.getThemes();
};
