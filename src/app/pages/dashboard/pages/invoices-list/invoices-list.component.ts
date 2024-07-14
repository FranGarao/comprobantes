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

  printInvoice() {
    // Opcional: Especificar solo el contenido dentro de #printArea para imprimir
    const printContent = document.getElementById('printArea')?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      location.reload(); // Para recargar la página y restaurar el contenido original
    } else {
      window.print(); // Imprime toda la página
    }
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
      next: (res: any) => {
        const message = `Hola ${invoice?.name}, tu trabajo ha sido finalizado con exito, gracias por confiar en nosotros.`;
        const whatsappUrl = `https://wa.me/${invoice?.phone}?text=${message}}`;
        window.open(whatsappUrl, '_blank');

        Swal.fire({
          title: 'Trabajo finalizada',
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
