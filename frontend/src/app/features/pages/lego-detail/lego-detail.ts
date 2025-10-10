import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILegoset } from '../../models/legoset.model';

@Component({
  selector: 'app-lego-detail',
  imports: [],
  templateUrl: './lego-detail.html',
  styleUrl: './lego-detail.scss',
})
export class LegoDetail implements OnInit {
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  legoset!: ILegoset;
  themeLogo?: { logo?: string; banner?: string; name: string };

  ngOnInit(): void {
    this.legoset = this._activatedRoute.snapshot.data['legoset'];

    this.getThemeAsset();
  }

  getThemeAsset = () => {
    const theme = this.legoset.theme;
    const num = theme?.img_num;

    this.themeLogo = { name: theme.name };

    if (num) {
      const logo = `/themes_assets/logo_${num}.png`;
      if (logo) this.themeLogo.logo = logo;
    }
  };
}
