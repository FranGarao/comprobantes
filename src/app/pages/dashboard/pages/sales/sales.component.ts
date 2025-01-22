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
  private sortOrder: { [key: string]: 'asc' | 'desc' } = {};

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
    console.log(`Ordenando por: ${column}`);

    // Alternar el orden
    this.sortOrder[column] = this.sortOrder[column] === 'asc' ? 'desc' : 'asc';

    // Ordenar según la columna seleccionada
    switch (column) {
      case 'date':
        console.log("Ordenando por fecha");
        this.records = this.records.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return this.sortOrder[column] === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;

      case 'invoice':
        console.log("Ordenando por comprobante");
        this.records = this.records.sort((a, b) => {
          return this.sortOrder[column] === 'asc' ? a.invoice - b.invoice : b.invoice - a.invoice;
        });
        break;

      case 'price':
        console.log("Ordenando por precio");
        this.records = this.records.sort((a, b) => {
          return this.sortOrder[column] === 'asc' ? a.total - b.total : b.total - a.total;
        });
        break;

      default:
        console.log(`Columna no soportada: ${column}`);
        break;
    }

    console.log({ records: this.records });
  }

}
