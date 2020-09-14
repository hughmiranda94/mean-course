import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  public isLoading = false;

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    this.isLoading = true;
    if (form.valid) {
      this.authService.loginUser(form.value.email, form.value.password);
    }
  }
}
