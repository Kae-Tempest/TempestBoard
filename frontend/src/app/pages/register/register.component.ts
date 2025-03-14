import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { registerForm } from '@shared/interfaces/auth.interface';
import { ConfigService } from '@core/service/configService';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private service: ConfigService = inject(ConfigService);
  registerForm: FormGroup<registerForm> = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.min(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    password_confirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  imagePath: string = 'image/logo_black.svg';

  onSubmit() {
    const { username, password_confirmation, password, email } =
      this.registerForm.controls;
    if (password_confirmation.value !== password.value) {
      console.log(password.value, password_confirmation.value);
      return;
    }
    this.service.http
      .post(`http://localhost/api/api/auth/register`, {
        username: username.value,
        password: password.value,
        email: email.value,
        created_at: new Date().toISOString(),
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
}
