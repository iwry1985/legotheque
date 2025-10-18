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
import { CurrencyPipe, DatePipe } from '@angular/common';

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

  legoset!: ILegoset;
  myLego: WritableSignal<ILegotheque | null> = signal<ILegotheque | null>(null);
  wanted: WritableSignal<IWanted | null> = signal<IWanted | null>(null);
  themeLogo?: { logo?: string; banner?: string; name: string };

  ngOnInit(): void {
    //get set
    this.legoset = this._activatedRoute.snapshot.data['data']['legoset'];

    //get set from user collection
    this.myLego.set(this._activatedRoute.snapshot.data['data']['myLego']);

    //get set from user wanted list
    this.wanted.set(this._activatedRoute.snapshot.data['data']['wanted']);

    this.getThemeAsset();
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

    console.log('theme', this.themeLogo);
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
}
