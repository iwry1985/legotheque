import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from 'app/features/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule, RouterLink, InputTextModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected readonly authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);

  scrolled: boolean = false;
  search: string = '';

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 30;
  }

  submit = () => {
    if (!this.search?.trim()) return; // ignore vide

    this._router.navigate(['/lego/list'], {
      queryParams: { search: this.search },
    });

    this.search = '';
  };
}
