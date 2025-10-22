import { Component, inject } from '@angular/core';
import { AuthService } from 'app/features/services/auth.service';
import { Home } from '../../home/home';
import { Profile } from '../../profile/profile';

@Component({
  selector: 'app-home-switch',
  imports: [Home, Profile],
  templateUrl: './home-switch.html',
  styleUrl: './home-switch.scss',
})
export class HomeSwitch {
  protected readonly authService: AuthService = inject(AuthService);
}
