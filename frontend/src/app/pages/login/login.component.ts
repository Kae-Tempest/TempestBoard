import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { loginForm } from '@shared/interfaces/auth.interface';
import { ConfigService } from '@core/service/configService';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private service: ConfigService = inject(ConfigService);
  loginForm: FormGroup<loginForm> = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  imagePath: string = 'image/logo_black.svg';

  onSubmit() {
    const { password, email } = this.loginForm.controls;
    this.service.http
      .post(`http://localhost/api/api/auth/login`, {
        password: password.value,
        email: email.value,
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
}
