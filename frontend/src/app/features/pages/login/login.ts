import { Component, inject, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { LoginForm } from '../../components/login-form/login-form';
import { AuthService } from 'app/features/services/auth-service.service';

@Component({
  selector: 'app-login',
  imports: [ButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly _dialogService: DialogService = inject(DialogService);
  protected readonly _authService: AuthService = inject(AuthService);

  openDialog = () => {
    this._dialogService.open(LoginForm, {
      closable: true,
      resizable: true,
      maximizable: true,
      width: '30vw',
      modal: true,
      dismissableMask: true,
    });
  };
}
