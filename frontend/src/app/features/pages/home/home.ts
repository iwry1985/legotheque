import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemList } from 'app/features/components/item-list/item-list';
import { ITheme } from 'app/features/models/theme.model';
import { ThemeService } from 'app/features/services/theme.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, RouterLink, ItemList, CardModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly _themeService = inject(ThemeService);

  themes!: ITheme[];

  ngOnInit(): void {
    this._themeService.getThemes([1, 20, 17, 15]).subscribe({
      next: (res) => {
        this.themes = this._themeService.getLogoAndBanner(res);
      },
    });
  }
}
