import { Component } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { Invoice } from '../../interfaces/Invoice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.css',
})
export class InvoicesListComponent {
  public invoices: Invoice[] = [];
  public filteredInvoices: Invoice[] = [];
  public isLoading: boolean = false;

  constructor(private service: DashboardService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getInvoices();
  }

  getInvoices() {
    this.isLoading = true;
    this.service.getInvoices().subscribe({
      next: (res: Invoice[]) => {
        this.isLoading = false;
        this.invoices = res;
        this.filteredInvoices = res;
        console.log({ invoices: this.invoices });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error de conexion',
          text:
            err?.error?.message ||
            'Ocurrio un error al intentar obtener las facturas',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  printInvoice(invoice: any, option: number) {
    let printContent = '';

    switch (option) {
      case 0:
        printContent = `
          <div>
            <h3>Comprobante N°${invoice?.id}</h3>
            <p>Cliente: <strong>${invoice?.name}</strong></p>
            <p>Teléfono: <strong>${invoice?.phone}</strong></p>
            <p>Trabajo: ${invoice?.job}</p>
            <p>Total: $${invoice?.total}</p>
            <p>Seña: $${invoice?.deposit}</p>
            <p>Balance: $${invoice?.balance}</p>
            <p>Fecha de entrega: ${invoice?.deliveryDate}</p>
            <p>Estado: ${invoice?.status ? 'Terminado' : 'Pendiente'}</p>
          </div>
        `;
        break;
      case 1:
        printContent = `
          <div>
            <h3>Comprobante N°${invoice?.id}</h3>
            <p>Cliente: <strong>${invoice?.name}</strong></p>
            <p>Teléfono: <strong>${invoice?.phone}</strong></p>
            <p>Trabajo: ${invoice?.job}</p>
            <p>Total: $${invoice?.total}</p>
            <p>Seña: $${invoice?.deposit}</p>
            <p>Balance: $${invoice?.balance}</p>
            <p>Fecha de entrega: ${invoice?.deliveryDate}</p>
            <p>Estado: ${invoice?.status ? 'Terminado' : 'Pendiente'}</p>
          </div>
        `;
        break;
      case 2:
        printContent = `
          <div>
            <h3>Comprobante N°${invoice?.id}</h3>
          </div>
        `;
        break;
      default:
        printContent = '';
        break;
    }

    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      location.reload(); // Para recargar la página y restaurar el contenido original
    } else {
      window.print(); // Imprime toda la página si printContent está vacío
    }
  }

  deleteInvoice(id: any) {

    Swal.fire({
      title: 'Eliminar factura',
      text: '¿Estas seguro de eliminar la factura?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteInvoice(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Factura eliminada',
              text: 'La factura se ha eliminado correctamente',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.getInvoices();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error de conexion',
              text:
                err?.error?.message ||
                'Ocurrio un error al intentar eliminar la factura',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          },
        });
      }
    });
  }
  search(therm: any) {
    this.filteredInvoices = this.invoices.filter((invoice) =>
      invoice.name.toLowerCase().includes(therm)
    );
  }

  filter(therm: any) {
    let status = false;
    if (therm.value === 'finalizado' || therm.value === 'pendiente') {
      therm.value === 'finalizado' ? (status = true) : (status = false);
      this.filteredInvoices = this.invoices?.filter(
        (invoice) => invoice?.status === status
      );
      return;
    } else if (
      therm.value === 'fa' ||
      therm.value === 'fd' ||
      therm.value === 'cd' ||
      therm.value === 'ca'
    ) {
      console.log(therm.value);

      switch (therm.value) {
        case 'pendiente':
          this.filteredInvoices = this.invoices.filter(
            (invoice) => !invoice.status
          );
          break;
        case 'finalizado':
          this.filteredInvoices = this.invoices.filter(
            (invoice) => invoice.status
          );
          break;
        case 'fa':
          this.filteredInvoices = [...this.invoices].sort(
            (a, b) =>
              new Date(a.deliveryDate).getTime() -
              new Date(b.deliveryDate).getTime()
          );
          break;
        case 'fd':
          this.filteredInvoices = [...this.invoices].sort(
            (a, b) =>
              new Date(b.deliveryDate).getTime() -
              new Date(a.deliveryDate).getTime()
          );
          break;
        case 'ca':
          this.filteredInvoices = [...this.invoices].sort(
            (a, b) => a.id - b.id
          );
          break;
        case 'cd':
          this.filteredInvoices = [...this.invoices].sort(
            (a, b) => b.id - a.id
          );
          break;
        default:
          this.filteredInvoices = [...this.invoices];
          break;
      }
    }
    this.filteredInvoices = this.invoices;
  }

  finishInvoice(invoice: Invoice) {
    Swal.fire({
      title: 'Finalizar factura',
      text: '¿Estas seguro de finalizar la factura?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const finishInvoice = {
          ...invoice,
          status: true,
        };
        this.finishInvoiceRequest(finishInvoice);
      }
    });
  }
  finishInvoiceRequest(invoice: Invoice) {
    this.service.updateInvoice(invoice?.id, invoice).subscribe({
      next: () => {
        const message = `Hola ${invoice?.name}, tu trabajo ha sido finalizado, gracias por confiar en nosotros.`;
        const whatsappUrl = `https://wa.me/5498${invoice?.phone}?text=${message}}`;
        window.open(whatsappUrl, '_blank');

        Swal.fire({
          title: 'Trabajo finalizado',
          text: 'El Trabajo se ha finalizado correctamente',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        this.getInvoices();
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Error de conexion',
          text:
            err?.error?.message ||
            'Ocurrio un error al intentar finalizar el trabajo',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }
}
