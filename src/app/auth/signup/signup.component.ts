import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent {
  public isLoading = false;

  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    this.isLoading = true;
    if (form.valid) {
      this.authService.createUser(form.value.email, form.value.password);
    }
  }
}
