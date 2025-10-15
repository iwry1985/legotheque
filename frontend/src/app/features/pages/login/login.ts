import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly _fb = inject(FormBuilder);

  loginForm: FormGroup;
  errorMessage = signal('');

  constructor() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.email, Validators.required]],
      pwd: ['', [Validators.required]],
    });
  }

  updateErrorMessage() {
    console.log('loginForm', this.loginForm.get('email')?.hasError);

    if (this.loginForm.get('email')?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.loginForm.get('email')?.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  onSubmit = () => {
    if (this.loginForm.dirty && this.loginForm.valid) {
      const values = this.loginForm.value;
    }
  };
}
