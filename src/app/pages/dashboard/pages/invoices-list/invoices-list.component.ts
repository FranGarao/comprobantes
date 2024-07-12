import { Component } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { Invoice } from '../../interfaces/Invoice';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.css'
})
export class InvoicesListComponent {
  public invoices: Invoice[] = [];

  constructor(private service: DashboardService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getInvoices();
  }

  getInvoices() {
    this.service.getInvoices().subscribe({
      next: (res: Invoice[]) => {
      this.invoices = res;
      console.log({ invoices: this.invoices});
      
    },
    error: (err) => {
      console.error(err);
    }});
  }
}
