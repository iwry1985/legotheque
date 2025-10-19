import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from 'app/features/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected readonly authService: AuthService = inject(AuthService);
  scrolled: boolean = false;

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 30;
  }
}
