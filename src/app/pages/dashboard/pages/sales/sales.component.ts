import { Component } from '@angular/core';
import { Sale } from '../../interfaces/Sale';
import { Payment } from '../../interfaces/Payment';
import { DashboardService } from '../../dashboard.service';
import { AlertsService } from '../../alerts.service';

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
  constructor(private alertService: AlertsService,
    private service: DashboardService
  ) { }

  ngOnInit() {
    this.getSales();
    this.getPayments();
  }

  getSales() {
    this.service.getSales().subscribe({
      next: (sales: any) => {
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
    this.service.getPayments().subscribe({
      next: (res: any) => {
        this.payments = res;
        console.log(this.payments);
        res.forEach((payment: any) => {
          this.getInvoice(payment.invoice_id);
          setTimeout(() => {
            this.service.getPaymentsMethodById(payment.payment_method_id).subscribe({
              next: (paymentMethod: any) => {
                console.log({ aasas: this.invoice });

                this.records.push({
                  id: payment.id,
                  date: payment.payment_date,
                  invoice: payment.invoice_id,
                  job: this.invoice.job,
                  customer: this.invoice.customer.name,
                  total: payment.mount,
                  paymentMethod: paymentMethod.name,
                });
              },
              error: (err: any) => {
                this.alertService.error('Error', 'No se pudieron obtener los metodos de pago')
              }
            })
          }, 1000);
        })
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  getInvoice(id: number) {
    this.service.getInvoice(id).subscribe({
      next: (invoice: any) => {
        this.invoice = invoice.invoice;
        console.log(invoice);

        this.service.getCustomerById(this.invoice.customerId).subscribe({
          next: (customer: any) => {
            this.invoice.customer = customer.customer;
          },
          error: (err: any) => {
            console.log(err);
          }
        })
        // this.records.push({
        //   id: invoice.id,
        //   date: invoice.delivery_date,
        //   job: invoice.job,
        //   total: invoice.total,
        //   paymentMethod: 'Efectivo',
        // });
      },
      error: (err: any) => {
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
