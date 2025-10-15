import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'app/features/services/auth-service.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-login-form',
  imports: [
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _messageService: MessageService = inject(MessageService);
  private readonly _dialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    pwd: ['', [Validators.required]],
  });

  submit = () => {
    if (this.form.invalid) return;

    this._authService
      .login(this.form.value.email!, this.form.value.pwd!)
      .subscribe({
        error: (err) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Connection Failed',
          });
        },
        next: () => {
          console.log('ICI');
          this._messageService.add({
            severity: 'success',
            summary: 'Welcome Foolish Mortal',
          });
          this._dialogRef.close();
        },
      });
  };
}
