// import { Component } from '@angular/core';
// import { Sale } from '../../interfaces/Sale';
// import { Payment } from '../../interfaces/Payment';
// import { DashboardService } from '../../dashboard.service';
// import { AlertsService } from '../../alerts.service';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-sales',
//   templateUrl: './sales.component.html',
//   styleUrl: './sales.component.css',
//   standalone: false
// })
// export class SalesComponent {
//   private sales: Sale[] = [];
//   private payments: Payment[] = [];
//   public records: any[] = [];
//   private invoice: any = null;
//   private invoicesIds: number[] = [];
//   public isLoading: boolean = false;
//   private sortOrder: { [key: string]: 'asc' | 'desc' } = {};

//   constructor(private alertService: AlertsService,
//     private service: DashboardService
//   ) { }

//   ngOnInit() {
//     this.getSales();
//     this.getPayments();
//   }

//   getSales() {
//     this.isLoading = true;
//     this.service.getSales().subscribe({
//       next: (sales: any) => {
//         this.isLoading = false;

//         sales.forEach((sale: any) => {
//           this.service.getPaymentsMethodById(sale.payment_id).subscribe({
//             next: (paymentMethod: any) => {
//               this.records.push({
//                 id: sale.id,
//                 date: sale.sale_date,
//                 product: sale.product_name,
//                 total: sale.product_price,
//                 paymentMethod: paymentMethod.name,
//               });
//             },
//             error: (err: any) => {
//               this.alertService.error('Error', 'No se pudieron obtener los metodos de pago')
//             }
//           })
//         });

//       },
//       error: (err: any) => {
//         console.log(err);
//       }
//     })
//   }


//   getPayments() {
//     this.isLoading = true;
//     this.service.getPaymentsWithDetails().subscribe({
//       next: (res: any) => {
//         this.isLoading = false;

//         res.forEach((payment: any) => {
//           this.records.push({
//             id: payment.id,
//             date: payment.date,
//             invoice: payment.invoice_id,
//             job: payment.jobs,
//             customer: payment.customer,
//             total: payment.total,
//             paymentMethod: payment.payment_method,
//           })
//         });
//       },
//       error: (err: any) => {
//         this.alertService.error('Error', 'No se pudieron obtener los pagos')
//         console.log(err);
//       }
//     })
//   }

//   orderBy(column: string) {
//     console.log(`Ordenando por: ${column}`);

//     // Alternar el orden
//     this.sortOrder[column] = this.sortOrder[column] === 'asc' ? 'desc' : 'asc';

//     // Ordenar según la columna seleccionada
//     switch (column) {
//       case 'date':
//         console.log("Ordenando por fecha");
//         this.records = this.records.sort((a, b) => {
//           const dateA = new Date(a.date).getTime();
//           const dateB = new Date(b.date).getTime();
//           return this.sortOrder[column] === 'asc' ? dateA - dateB : dateB - dateA;
//         });
//         break;

//       case 'invoice':
//         console.log("Ordenando por comprobante");
//         this.records = this.records.sort((a, b) => {
//           return this.sortOrder[column] === 'asc' ? a.invoice - b.invoice : b.invoice - a.invoice;
//         });
//         break;

//       case 'price':
//         console.log("Ordenando por precio");
//         this.records = this.records.sort((a, b) => {
//           return this.sortOrder[column] === 'asc' ? a.total - b.total : b.total - a.total;
//         });
//         break;

//       default:
//         console.log(`Columna no soportada: ${column}`);
//         break;
//     }

//     console.log({ records: this.records });
//   }

// }

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
  public filteredPaymentMethods: any[] = []
  private sortOrder: { [key: string]: 'asc' | 'desc' } = {};
  // Arreglo original con todos los registros (ventas y pagos)
  public filteredRecords: any[] = [];
  // Arreglo para agrupar ganancias por método de pago
  public earningsByPaymentMethod: any[] = [];

  // Filtros
  public startDate: string = ''; // Formato: YYYY-MM-DD
  public endDate: string = '';
  public productFilter: string = '';

  constructor(
    private alertService: AlertsService,
    private service: DashboardService
  ) { }

  ngOnInit() {
    // Carga de registros: puedes combinar getSales y getPayments o asegurarte de que al finalizar ambos se actualicen los filtros.
    this.getSales();
    this.getPayments();
  }

  // Ejemplo de método para obtener ventas
  getSales() {
    this.isLoading = true;
    this.service.getSales().subscribe({
      next: (sales: any[]) => {
        sales.forEach((sale: any) => {
          // Suponiendo que cada venta tenga 'sale_date', 'product_name', 'id', etc.
          this.records.push({
            id: sale.id,
            date: sale.sale_date,
            product: sale.product_name,
            total: sale.product_price,
            invoice: sale.invoice, // O el número de comprobante
            // Otros campos según corresponda…
          });
          // Opcional: si necesitas obtener el método de pago u otros datos, encadénalos o espera la respuesta de otro servicio.
        });
        this.isLoading = false;
        this.updateFilteredRecords();
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  // Ejemplo de método para obtener pagos (si los registros de pagos se fusionan con ventas)
  getPayments() {
    this.isLoading = true;
    this.service.getPaymentsWithDetails().subscribe({
      next: (payments: any) => {
        payments.forEach((payment: any) => {
          this.records.push({
            id: payment.id,
            date: payment.date,
            invoice: payment.invoice_id,
            job: payment.jobs,
            customer: payment.customer,
            total: payment.total,
            paymentMethod: payment.payment_method,
            // Otros campos según sea necesario…
          });
        });
        this.isLoading = false;
        this.updateFilteredRecords();
      },
      error: (err: any) => {
        this.alertService.error('Error', 'No se pudieron obtener los pagos');
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  // Aplica los filtros sobre "records" y actualiza "filteredRecords" y las ganancias por método de pago
  updateFilteredRecords() {
    let filtered = [...this.records];

    // Filtrar por rango de fechas si se han ingresado valores
    if (this.startDate) {
      const start = new Date(this.startDate);
      filtered = filtered.filter(record => new Date(record.date) >= start);
    }
    if (this.endDate) {
      const end = new Date(this.endDate);
      filtered = filtered.filter(record => new Date(record.date) <= end);
    }
    // Filtrar por producto si se ingresa algún valor
    if (this.productFilter && this.productFilter.trim() !== '') {
      filtered = filtered.filter(record =>
        record.product && record.product.toLowerCase().includes(this.productFilter.toLowerCase()) || record.job && record.job.toLowerCase().includes(this.productFilter.toLowerCase())
      );
    }

    this.filteredRecords = filtered;
    this.updateEarnings();

    this.paymentsByMethod();
  }

  paymentsByMethod() {
    console.log({ records: this.filteredRecords });

    this.filteredPaymentMethods = this.filteredRecords.filter((r) => {
      switch (r.paymentMethod) {
        case "Efectivo":
          // this.filteredPaymentMethods.cash.
          break;

        case "Mercado Pago":

          break;

        case "Cuenta DNI":

          break;

        case "Transferencia":

          break;

        case "Credito":

          break;

        default:
          break;
      }
      return r.paymentMethod === "Efectivo"
    })
    console.log({ fMethods: this.filteredPaymentMethods });

  }


  updateFilteredMethods() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      console.log(this.earningsByPaymentMethod);

      this.earningsByPaymentMethod = this.earningsByPaymentMethod
        .filter(earning => {
          const earningDate = new Date(earning.date);
          return earningDate >= start && earningDate <= end;
        })
        .map(earning => ({
          paymentMethod: earning.paymentMethod,
          totalEarned: earning.totalEarned
        }));
    } else {
      this.earningsByPaymentMethod = this.earningsByPaymentMethod.map(earning => ({
        paymentMethod: earning.paymentMethod,
        totalEarned: earning.totalEarned
      }));
    }

    console.log(this.earningsByPaymentMethod);

  }

  // Agrupa los registros filtrados por "paymentMethod" y suma el campo "total"
  updateEarnings() {
    const aggregation: { [key: string]: number } = {};

    this.filteredRecords.forEach(record => {
      if (record.paymentMethod && record.total) {
        const totalValue = parseFloat(record.total);
        if (!isNaN(totalValue)) {
          aggregation[record.paymentMethod] = (aggregation[record.paymentMethod] || 0) + totalValue;
        }
      }
    });

    this.earningsByPaymentMethod = Object.keys(aggregation).map(key => ({
      paymentMethod: key,
      totalEarned: aggregation[key],
    }));
  }

  // Método para ordenar (puedes ajustar para que ordene "filteredRecords" en lugar de "records")
  orderBy(column: string) {
    this.sortOrder[column] = this.sortOrder[column] === 'asc' ? 'desc' : 'asc';
    const order = this.sortOrder[column];

    this.filteredRecords = this.filteredRecords.sort((a, b) => {
      if (column === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (column === 'invoice') {
        return order === 'asc' ? a.invoice - b.invoice : b.invoice - a.invoice;
      } else if (column === 'price') {
        return order === 'asc' ? a.total - b.total : b.total - a.total;
      }
      // Para otras columnas (string) se puede usar localeCompare
      else {
        return order === 'asc'
          ? (a[column] || '').toString().localeCompare((b[column] || '').toString())
          : (b[column] || '').toString().localeCompare((a[column] || '').toString());
      }
    });
  }

  clearFilters() {
    this.startDate = '';
    this.endDate = '';
    this.productFilter = '';
    this.updateFilteredRecords();
  }
}
