import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItemList } from 'app/features/components/item-list/item-list';
import { ITheme } from 'app/features/models/theme.model';
import {
  ThemeService,
  ThemeWithImg,
} from 'app/features/services/theme.service';

@Component({
  selector: 'app-theme-list',
  imports: [RouterLink, ItemList],
  templateUrl: './theme-list.html',
  styleUrl: './theme-list.scss',
})
export class ThemeList implements OnInit {
  private readonly _themeService: ThemeService = inject(ThemeService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  themes: ThemeWithImg[] = [];

  ngOnInit(): void {
    this.themes = this._themeService.getLogoAndBanner(
      this._activatedRoute.snapshot.data['themes']
    );
  }
}
