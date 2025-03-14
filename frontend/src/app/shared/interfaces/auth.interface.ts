import { FormControl } from '@angular/forms';

export interface loginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

export interface registerForm {
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  password_confirmation: FormControl<string | null>;
}
