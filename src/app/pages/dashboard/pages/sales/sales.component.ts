import { Component } from '@angular/core';
import { Sale } from '../../interfaces/Sale';
import { Payment } from '../../interfaces/Payment';
import { DashboardService } from '../../dashboard.service';

@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrl: './sales.component.css',
    standalone: false
})
export class SalesComponent {
  public sales: Sale[] = [];
  public payments: Payment[] = [];

  constructor(
    private service: DashboardService
  ) { }

  ngOnInit() {
    this.getSales();
    this.getPayments();
  }

  getSales() {
    this.service.getSales().subscribe({
      next: (res: any) => {
        this.sales = res.sales;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  getPayments() {
    this.service.getPayments().subscribe({
      next: (res: any) => {
        this.payments = res.payments;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
}
