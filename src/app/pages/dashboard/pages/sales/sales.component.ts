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
  public currentPage: number = 1; // Página actual
  public pageSize: number = 15;   // Tamaño de la página (registros por página)
  // Filtros
  public startDate: string = ''; // Formato: YYYY-MM-DD
  public endDate: string = '';
  public productFilter: string = '';
  private paymentMethods: any[] = [];
  public paymentArray: any[] = [];

  constructor(
    private alertService: AlertsService,
    private service: DashboardService
  ) { }

  ngOnInit() {
    // Carga de registros: puedes combinar getSales y getPayments o asegurarte de que al finalizar ambos se actualicen los filtros.
    this.getPaymentMethods();
    this.getSales();
    this.getPayments();
    setTimeout(() => {
      this.setPaymentMethods();
    }, 2000);
  }

  setPaymentMethods() {
    const paymentTotals = this.filteredRecords.reduce((acc, record) => {
      // Asegurarse de que el total sea un número
      const total = parseFloat(record.total) || 0;
      const method = record.paymentMethod;

      if (!acc[method]) {
        acc[method] = total;
      } else {
        acc[method] += total;
      }

      return acc;
    }, {});

    // Convertir el objeto a un array
    this.paymentArray = Object.entries(paymentTotals).map(([paymentMethod, total]) => ({
      paymentMethod,
      total
    }));

    console.log({ paymentArray: this.paymentArray });
  }
  // Ejemplo de método para obtener ventas
  getSales() {
    this.isLoading = true;
    this.service.getSales().subscribe({
      next: (sales: any[]) => {
        sales.forEach((sale: any) => {
          const paymentMethod = this.paymentMethods.find(p => p.id === sale.payment_id);
          // Suponiendo que cada venta tenga 'sale_date', 'product_name', 'id', etc.
          this.records.push({
            id: sale.id,
            date: sale.sale_date,
            product: sale.product_name,
            total: sale.product_price,
            paymentMethod: paymentMethod.name // O el número de comprobante
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
  refresh() {
    this.filteredRecords = [];
    this.records = [];
    this.getSales();
    this.getPayments();
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
  getTotalPages(): number {
    return Math.ceil(this.filteredRecords.length / this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  getPaginatedRecords(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredRecords.slice(startIndex, endIndex);
  }

  // Aplica los filtros sobre "records" y actualiza "filteredRecords" y las ganancias por método de pago
  updateFilteredRecords() {
    let filtered = [...this.records];

    // Filtros existentes (fechas y producto)
    if (this.startDate) {
      const start = new Date(this.startDate);
      filtered = filtered.filter(record => new Date(record.date) >= start);
    }
    if (this.endDate) {
      const end = new Date(this.endDate);
      filtered = filtered.filter(record => new Date(record.date) <= end);
    }
    if (this.productFilter && this.productFilter.trim() !== '') {
      filtered = filtered.filter(record =>
        record.product && record.product.toLowerCase().includes(this.productFilter.toLowerCase()) || record.job && record.job.toLowerCase().includes(this.productFilter.toLowerCase())
      );
    }

    // Actualiza los registros filtrados
    this.filteredRecords = filtered;

    // Actualiza las ganancias y pagos por método
    this.updateEarnings();
    this.paymentsByMethod();
    // let filtered = [...this.records];

    // // Filtrar por rango de fechas si se han ingresado valores
    // if (this.startDate) {
    //   const start = new Date(this.startDate);
    //   filtered = filtered.filter(record => new Date(record.date) >= start);
    // }
    // if (this.endDate) {
    //   const end = new Date(this.endDate);
    //   filtered = filtered.filter(record => new Date(record.date) <= end);
    // }
    // // Filtrar por producto si se ingresa algún valor
    // if (this.productFilter && this.productFilter.trim() !== '') {
    //   filtered = filtered.filter(record =>
    //     record.product && record.product.toLowerCase().includes(this.productFilter.toLowerCase()) || record.job && record.job.toLowerCase().includes(this.productFilter.toLowerCase())
    //   );
    // }

    // this.filteredRecords = filtered;
    // this.updateEarnings();

    // this.paymentsByMethod();
    this.setPaymentMethods();

  }

  paymentsByMethod() {
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
  }


  updateFilteredMethods() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

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

  getPaymentMethods() {
    this.service.getPaymentsMethods().subscribe({
      next: (res: any) => {
        this.paymentMethods = res;
      },
      error: (err: any) => {
        console.log(err);
        this.alertService.error("Error", err)
      }
    })
  }
}
