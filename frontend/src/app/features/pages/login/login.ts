import { Component, inject, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { LoginForm } from '../../components/login-form/login-form';
import { AuthService } from 'app/features/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  //private readonly _dialogService: DialogService = inject(DialogService);
  protected readonly _authService: AuthService = inject(AuthService);
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _messageService = inject(MessageService);
  private readonly _router: Router = inject(Router);

  loginForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    pwd: ['', [Validators.required]],
  });

  submit = () => {
    if (this.loginForm.invalid) return;

    this._authService
      .login(this.loginForm.value.email!, this.loginForm.value.pwd!)
      .subscribe({
        error: (err) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Mauvais identifiant ou mot de passe',
          });
        },
        next: () => {
          this._messageService.add({
            severity: 'success',
            summary: 'Bienvenue !',
          });

          this._router.navigateByUrl('lego');
          //this._dialogRef.close();
        },
      });
  };

  // openDialog = () => {
  //   this._dialogService.open(LoginForm, {
  //     closable: true,
  //     resizable: true,
  //     maximizable: true,
  //     width: '30vw',
  //     modal: true,
  //     dismissableMask: true,
  //   });
  //};
}
