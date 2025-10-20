import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserLegotheque } from 'app/features/models/user-legotheque.model';
import { AuthService } from 'app/features/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CurrencyPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected readonly authService: AuthService = inject(AuthService);

  legoStats!: IUserLegotheque;

  ngOnInit(): void {
    this.legoStats = this._activatedRoute.snapshot.data['legoStats'];
    console.log('stats', this.legoStats);
  }
}
