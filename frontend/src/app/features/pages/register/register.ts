import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'app/features/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DatePicker } from 'primeng/datepicker';
import { passwordMatchValidator } from 'app/core/validators/password-match.validators';
import { pipe } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    DatePicker,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);
  private readonly _messageService = inject(MessageService);

  maxDate = new Date('2020/01/01');

  registerForm = this._fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', [Validators.required]],
      pwd: ['', [Validators.required, Validators.minLength(5)]],
      confirmPwd: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  onSubmit = () => {
    if (this.registerForm.invalid) return;

    const formValue = this.registerForm.getRawValue();

    this._authService
      .register({
        ...formValue,
        birthdate: new Date(formValue.birthdate),
      })
      .subscribe({
        next: (res) => {
          if (res.userid) {
            console.log('USERID', res.userid);
            this._messageService.add({
              severity: 'success',
              summary: 'Ton compte a bien été créé !',
            });
          }

          this._router.navigateByUrl('login');
        },
        error: (err) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Un problème est survenu dans la création de ton compte',
          });
        },
      });
  };
}
