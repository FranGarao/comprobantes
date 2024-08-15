import { Component } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  /**
   *
   */
  constructor(private service: DashboardService, private router: Router) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  openInvoice(x: number) {
    this.service.openInvoice(x);
  }

  openJob(x: number) {
    this.service.openJob(x);
  }

  openCustomer(x: number) {
    this.service.openCustomer(x);
  }

  goToLogin() {
    this.service.logout();
    this.router.navigate(['/']);
  }

  logout() {
    // this.service.logout();
  }
}
