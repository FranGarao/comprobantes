import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { AlertsService } from '../dashboard/alerts.service';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false
})
export class LoginComponent {
  public loginForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private service: AppService,
    private dashboardService: DashboardService,
    private router: Router,
    private alertService: AlertsService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (!this.loginForm.valid) return;
    const user = {
      username: this.loginForm?.value?.username,
      password: this.loginForm?.value?.password,
    };

    this.service.login(user).subscribe({
      next: (r: any) => {
        this.dashboardService.role = r.token.role;
        localStorage.setItem('AuthToken', r.token.token);
        localStorage.setItem('role', r.token.role);
        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        this.alertService.error('Error', 'Usuario o contraseña incorrectos');
      },
    });
  }

  createAccount() {
    if (!this.loginForm.valid) return;
    const user = {
      username: this.loginForm?.value?.username,
      password: this.loginForm?.value?.password,
      role: 'user'
    };

    this.service.createAccount(user).subscribe({
      next: (r: any) => {
        this.alertService.success('Exito', 'Cuenta creada con exito');
      },

      error: (error: any) => {
        this.alertService.error('Error', error.error.message);
      },
    })
  }
}
