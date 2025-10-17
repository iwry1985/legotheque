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

@Component({
  selector: 'app-lego-detail',
  imports: [ButtonModule, RefPipe, PiecesPipe],
  templateUrl: './lego-detail.html',
  styleUrl: './lego-detail.scss',
})
export class LegoDetail implements OnInit {
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _legothequeService: LegothequeService =
    inject(LegothequeService);
  protected authService: AuthService = inject(AuthService);

  legoset!: ILegoset;
  myLego: WritableSignal<ILegotheque | null> = signal<ILegotheque | null>(null);
  themeLogo?: { logo?: string; banner?: string; name: string };

  ngOnInit(): void {
    console.log('INIT', this._activatedRoute.snapshot.data);
    //get set
    this.legoset = this._activatedRoute.snapshot.data['data']['legoset'];

    //get set from user collection
    this.myLego.set(this._activatedRoute.snapshot.data['data']['myLego']);

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

  addAsWanted = () => {
    this._legothequeService.addSet(this.legoset.setid, true).subscribe({
      next: (res) => this.myLego.set(res),
    });
  };

  removeSet = () => {
    const _myLego = this.myLego();
    if (_myLego) {
      this._legothequeService.removeSet(_myLego.legothequeid).subscribe({
        next: (res) => res && this.myLego.set(null),
      });
    }
  };
}
