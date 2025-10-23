import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ILegotheque } from 'app/features/models/legotheque.model';
import { IUserLegotheque } from 'app/features/models/user-legotheque.model';
import { AuthService } from 'app/features/services/auth.service';
import { LegothequeService } from 'app/features/services/legotheque.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile',
  imports: [CurrencyPipe, DatePipe, CommonModule, ButtonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected readonly authService: AuthService = inject(AuthService);
  private readonly _legothequeService: LegothequeService =
    inject(LegothequeService);
  private readonly _router: Router = inject(Router);

  legoStats!: IUserLegotheque;
  userSets = signal<ILegotheque[]>([]);
  visibleCount = signal<number>(6);

  ngOnInit(): void {
    this.legoStats = this._activatedRoute.snapshot.data['legoStats'];

    this._legothequeService.getUserCollection().subscribe({
      next: (res) => this.userSets.set(res),
    });
  }

  goToDetails = (setid?: number) => {
    if (setid) this._router.navigate(['lego/' + setid]);
  };

  get visibleSets() {
    return this.userSets().slice(0, this.visibleCount());
  }

  showMore = () => {
    const count = this.visibleCount() + 6;
    this.visibleCount.set(count);
  };
}
