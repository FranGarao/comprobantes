import { Component } from '@angular/core';
import { Sale } from '../../interfaces/Sale';
import { Payment } from '../../interfaces/Payment';
import { DashboardService } from '../../dashboard.service';
import { AlertsService } from '../../alerts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
  standalone: false
})
export class SalesComponent {
  private sales: Sale[] = [];
  private payments: Payment[] = [];
  public records: any[] = [];
  private invoice: any = null;
  private invoicesIds: number[] = [];
  public isLoading: boolean = false;
  constructor(private alertService: AlertsService,
    private service: DashboardService
  ) { }

  ngOnInit() {
    this.getSales();
    this.getPayments();
  }

  getSales() {
    this.isLoading = true;
    this.service.getSales().subscribe({
      next: (sales: any) => {
        this.isLoading = false;

        sales.forEach((sale: any) => {
          this.service.getPaymentsMethodById(sale.payment_id).subscribe({
            next: (paymentMethod: any) => {
              this.records.push({
                id: sale.id,
                date: sale.sale_date,
                product: sale.product_name,
                total: sale.product_price,
                paymentMethod: paymentMethod.name,
              });
            },
            error: (err: any) => {
              this.alertService.error('Error', 'No se pudieron obtener los metodos de pago')
            }
          })
        });

      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }


  getPayments() {
    this.isLoading = true;

    this.service.getPaymentsWithDetails().subscribe({
      next: (res: any) => {
        this.isLoading = false;

        res.forEach((payment: any) => {
          this.records.push({
            id: payment.id,
            date: payment.date,
            invoice: payment.invoice_id,
            job: payment.jobs,
            customer: payment.customer,
            total: payment.total,
            paymentMethod: payment.payment_method,
          })
        });
      },
      error: (err: any) => {
        this.alertService.error('Error', 'No se pudieron obtener los pagos')
        console.log(err);
      }
    })
  }

  orderBy(column: string) {
    this.records.sort((a: any, b: any) => {
      if (a[column] > b[column]) {
        return 1;
      }
      if (a[column] < b[column]) {
        return -1;
      }
      return 0;
    });
  }
}
