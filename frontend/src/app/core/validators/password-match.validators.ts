import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const pwd = control.get('pwd')?.value;
  const confirm = control.get('confirmPwd')?.value;

  return pwd && confirm && pwd !== confirm ? { passwordMismatch: true } : null;
};
