import { Component } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { Invoice } from '../../interfaces/Invoice';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertsService } from '../../alerts.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.css',
})
export class InvoicesListComponent {
  public invoices: Invoice[] = [];
  public filteredInvoices: Invoice[] = [];
  public isLoading: boolean = false;
  public dateFilter: FormGroup = new FormGroup({});
  private printContent: string = '';
  constructor(
    private service: DashboardService,
    private fb: FormBuilder,
    private alertService: AlertsService
  ) {}

  ngOnInit(): void {
    this.getInvoices();
    this.createDateForm();
    this.service.comprobantes$.subscribe((comprobantes) => {
      this.invoices = comprobantes;
    });
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

  printyInvoice(invoice: any, option: number) {
    let printContent = '';
    const date = new Date(invoice?.deliveryDate);
    const formattedDate = format(date, 'dd-MM-yyyy');

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
            <p>Saldo: $${invoice?.balance}</p>
            <p>Fecha de entrega: ${formattedDate}</p>
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
            <p>Saldo: $${invoice?.balance}</p>
            <p>Fecha de entrega: ${formattedDate}</p>
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

  edit(i: Invoice, x: number) {
    this.service.setInvoice(i);
    this.service.openInvoice(x);
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
        this.alertService.loading(
          'Eliminando comprobante',
          'Por favor espere...'
        );

        this.service.deleteInvoice(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Comprobante eliminado',
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
  search(therm: any, type: number) {
    this.filteredInvoices = this.invoices;
    switch (type) {
      case 0:
        this.filteredInvoices = this.invoices.filter((invoice) =>
          invoice.name.toLowerCase().includes(therm)
        );
        break;
      case 1:
        console.log({ therm, invoices: this.filteredInvoices });

        this.filteredInvoices = this.invoices.filter((invoice) =>
          invoice.phone.toLowerCase().includes(therm)
        );
        console.log(this.filteredInvoices);

        break;
      case 2:
        this.filteredInvoices = this.invoices.filter((invoice) =>
          invoice.id.toString().toLowerCase().includes(therm)
        );
        break;
      case 3:
        this.filteredInvoices = this.invoices.filter((invoice: Invoice) =>
          invoice?.job?.toLowerCase().includes(therm)
        );
        break;

      default:
        break;
    }
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
      title: '¿Finalizar factura?',
      text: 'Su estado cambiara a finalizado.',
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
  //TODO Revisar
  finishInvoiceRequest(invoice: Invoice) {
    this.alertService.loading('Enviando comprobante', 'Por favor espere...');

    this.service.updateInvoice(invoice?.id, invoice).subscribe({
      next: () => {
        const message = `Hola ${invoice?.name}, tu trabajo ha sido finalizado, gracias por confiar en nosotros.`;
        const whatsappUrl = `https://wa.me/549${invoice?.phone}?text=${message}}`;
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

  printInvoice(invoice: Invoice, type: number) {
    // Opcional: Especificar solo el contenido dentro de #printArea para imprimir
    let messagge = '';
    const date = new Date(invoice?.deliveryDate);
    const formattedDate = format(date, 'dd-MM-yyyy');
    switch (type) {
      case 0:
        this.printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; width: 300px; border: 1px solid #000;">
          <h2 style="text-align: center;">Generación de Zapateros</h2>
          <p style="text-align: center;">Compostura de Calzado</p>
          <p style="text-align: center;">Av. Perón 1855 - San Miguel</p>
          <p style="text-align: center;">11 5667 0042</p>
          <hr>
          <p>Nº ${invoice?.id}</p>
          <p>Trabajo: ${invoice?.job}</p>
          <p>Fecha de entrega: ${formattedDate}</p>
          <p>Total $${invoice?.total}</p>
          <p>Seña $${invoice?.deposit}</p>
          <p>Saldo $${invoice?.balance}</p>
          <hr>
          <p style="text-align: center; font-weight: bold;">HORARIOS</p>
          <p style="text-align: center;">Lunes a Viernes : 09 a 13 hs - 16 a 19 hs</p>
          <p style="text-align: center;">Sábado 09 a 13 hs</p>
          <hr>
          <p style="font-size: 12px; text-align: center;">
            Si la reparación no se retira dentro de los 15 días, puede sufrir ajuste de precios sin previo aviso.
            Los trabajos no retirados después de 30 días, pierden todo derecho a reclamo.
          </p>
        </div>
      `;
        this.print(this.printContent);

        break;

      case 1:
        this.printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; width: 300px; border: 1px solid #000;">
          <p>Nº ${invoice.id}</p>
          <p>Fecha de entrega: ${formattedDate}</p>
          <p>Total $${invoice?.total}</p>
          <p>Seña $${invoice?.deposit}</p>
          <p>Saldo $${invoice?.balance}</p>
          <hr>
          <p>NOMBRE: ${invoice?.name}</p>
          <p>TELÉFONO: ${invoice?.phone}</p>
          <p>TRABAJO: ${invoice?.job}</p>
        </div>
      `;
        this.print(this.printContent);

        break;
      case 2:
        this.printContent = `
          <div style="font-family: Arial, sans-serif; padding: 20px; width: 300px; border: 1px solid #000;">
            <p>Nº ${invoice.id}</p>
            <p>Trabajo: </p>
          </div>
        `;
        this.print(this.printContent);

        break;
      case 3:
        messagge = `*Nº* ${invoice?.id}\n*Trabajo:* ${invoice?.job}\n*Fecha de entrega:* ${formattedDate}\n*Total:* $${invoice?.total}\n*Seña:* $${invoice?.deposit}\n*Saldo:* $${invoice?.balance}\n\n*HORARIOS*\nLunes a Viernes : 09 a 13 hs - 16 a 19 hsSábado 09 a 13 hs\n*Si la reparación no se retira dentro de los 15 días, puede sufrir ajuste de precios sin previo aviso.Los trabajos no retirados después de 30 días, pierden todo derecho a reclamo.*
        `;
        this.sendWhatsApp(invoice.phone, messagge);
        break;
      case 4:
        messagge = `*Hola ${invoice?.name}!*\n*Su trabajo ya esta listo para retirar*`;
        this.sendWhatsApp(invoice.phone, messagge);
        break;
      default:
        break;
    }
  }

  print(printContent: string) {
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir Comprobante</title>
              <style>
                /* Puedes agregar tus estilos CSS aquí */
                body {
                  font-family: Arial, sans-serif;
                }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      window.print(); // Imprime toda la página si printContent está vacío
    }
  }

  sendWhatsApp(phone: any, message: string) {
    const encodedMessage = encodeURIComponent(message);
    console.log({ encodedMessage });
    const whatsappUrl = `https://wa.me/549${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  createDateForm() {
    this.dateFilter = this.fb.group({
      startDate: [''],
      endDate: [''],
    });
  }

  submitFilterDate() {
    const { startDate, endDate } = this.dateFilter.value;
    this.filteredInvoices = this.invoices.filter((invoice) => {
      const deliveryDate = new Date(invoice.deliveryDate).getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return deliveryDate >= start && deliveryDate <= end;
    });
  }
}
