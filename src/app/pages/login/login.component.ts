import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public loginForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private service: AppService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const user = {
        UserName: this.loginForm.value.userName,
        Password: this.loginForm.value.password,
      };

      this.service.login(user).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (error) => {
          console.log({ error });
        },
      });
    }
  }
}
