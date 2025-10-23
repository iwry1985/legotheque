import {
  Component,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILegoset } from '../../models/legoset.model';
import { ButtonModule } from 'primeng/button';
import { RefPipe } from 'app/core/pipes/ref-pipe';
import { PiecesPipe } from 'app/core/pipes/pieces-pipe';
import { AuthService } from 'app/features/services/auth.service';
import { LegothequeService } from 'app/features/services/legotheque.service';
import { ILegotheque } from 'app/features/models/legotheque.model';
import { WantedService } from 'app/features/services/wanted.service';
import { IWanted } from 'app/features/models/wanted.model';
import { TagModule } from 'primeng/tag';
import { LegoCollection } from 'app/features/components/lego-collection/lego-collection';
import { LegoSummary } from 'app/features/components/lego-summary/lego-summary';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ISecondaryMarket } from 'app/features/models/secondary-market.model';
import { LegosetService } from 'app/features/services/legoset.service';
import { SecondaryMarket } from 'app/features/component/secondary-market/secondary-market';

@Component({
  selector: 'app-lego-detail',
  imports: [
    ButtonModule,
    RefPipe,
    PiecesPipe,
    TagModule,
    LegoCollection,
    LegoSummary,
    DatePipe,
    CurrencyPipe,
    SecondaryMarket,
    CommonModule,
  ],
  templateUrl: './lego-detail.html',
  styleUrl: './lego-detail.scss',
})
export class LegoDetail implements OnInit {
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _legothequeService: LegothequeService =
    inject(LegothequeService);
  private readonly _wantedService: WantedService = inject(WantedService);
  protected authService: AuthService = inject(AuthService);
  private readonly _legosetService: LegosetService = inject(LegosetService);

  legoset!: ILegoset;
  myLego: WritableSignal<ILegotheque | null> = signal<ILegotheque | null>(null);
  wanted: WritableSignal<IWanted | null> = signal<IWanted | null>(null);
  themeLogo?: { logo?: string; banner?: string; name: string };
  marketPrices: ISecondaryMarket | undefined;

  ngOnInit(): void {
    //get set
    this.legoset = this._activatedRoute.snapshot.data['data']['legoset'];

    //get set from user collection
    this.myLego.set(this._activatedRoute.snapshot.data['data']['myLego']);

    //get set from user wanted list
    this.wanted.set(this._activatedRoute.snapshot.data['data']['wanted']);

    this.getThemeAsset();

    //get set secondary market prices
    if (this.legoset.bricksetid) {
      this._legosetService
        .getSetSecondaryMarket(this.legoset.bricksetid)
        .subscribe({
          next: (res) => {
            if (res) this.marketPrices = res;
          },
        });
    }
  }

  //get theme logo
  getThemeAsset = () => {
    if (!this.legoset) return;

    const theme = this.legoset.theme;
    const num = theme?.img_num;

    this.themeLogo = { name: theme.name };

    if (num) {
      const logo = `/themes_assets/logo_${num.toString().padStart(2, '0')}.png`;
      if (logo) this.themeLogo.logo = logo;
    }
  };

  // add set to user wanted list
  addAsWanted = () => {
    this._wantedService.addSetToList(this.legoset.setid).subscribe({
      next: (res) => this.wanted.set(res),
    });
  };

  //remove set from user wanted list
  removeFromWanted = () => {
    const wanted = this.wanted();
    if (wanted) {
      this._wantedService.removeSet(wanted.wantedid).subscribe({
        next: (res) => res && this.wanted.set(null),
      });
    }
  };

  //add set to legotheque as owned
  ownSet = () => {
    this._legothequeService.addSet(this.legoset.setid).subscribe({
      next: (res) => this.myLego.set(res),
    });
  };

  updateLegotheque = (legotheque: ILegotheque) => {
    this.myLego.set(legotheque);
  };

  //for minifig img
  isSpecialTheme(themeName: string): boolean {
    const themes = [
      'Indiana Jones',
      'Disney',
      'Star Wars',
      'Jurassic World',
      'Ninjago',
      'City',
      'DC Comics Super Heroes',
      'Marvel Super Heroes',
      'Art',
      'Sonic the Hedgehog',
      'The Lord of the Rings',
      'Harry Potter',
      'The Simpsons',
      'Minecraft',
    ];
    return themes.some((t) => themeName.includes(t));
  }

  themeStyles: Record<string, string> = {
    Disney: 'disney',
    'Indiana Jones': 'indiana',
    'Star Wars': 'starwars',
    'Jurassic World': 'jurassic',
    Ninjago: 'ninjago',
    City: 'city',
    'DC Comics Super Heroes': 'dc',
    Art: 'art',
    'Sonic the Hedgehog': 'sonic',
    'The Lord of the Rings': 'lotr',
    'Harry Potter': 'hp',
    'The Simpsons': 'simpsons',
    Minecraft: 'minecraft',
  };

  getThemeClass(themeName: string): string {
    const key = Object.keys(this.themeStyles).find((k) =>
      themeName.includes(k)
    );
    return key ? this.themeStyles[key] : 'theme-default';
  }
}
