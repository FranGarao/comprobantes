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
  styleUrls: ['./invoices-list.component.css', '../../../../app.component.css'],
  standalone: false
})
export class InvoicesListComponent {
  public invoices: Invoice[] = [];
  public filteredInvoices: Invoice[] = [];
  public isLoading: boolean = false;
  public dateFilter: FormGroup = new FormGroup({});
  private printContent: string = '';
  public balance: number = 0;
  private paymentMethods: any[] = [];
  private qr: string = '';
  customers: any;
  constructor(
    private service: DashboardService,
    private fb: FormBuilder,
    private alertService: AlertsService
  ) { }

  ngOnInit(): void {
    this.getCustomers()
    this.service.getPaymentsMethods().subscribe({
      next: (res: any) => {
        this.paymentMethods = res;
      },
      error: (err) => {
        console.log(err);
      },
    })
    this.getInvoices();
    this.createDateForm();
    this.service.comprobantes$.subscribe((comprobantes) => {
      this.invoices = comprobantes;
    });
  }

  getCustomers() {
    this.service.getCustomers().subscribe({
      next: (data: any) => {
        this.customers = data;
      },
      error: (error: any) => {
        Swal.fire('Error', 'No se pudo obtener el cliente', 'error');
        console.log({ error });
      },
    });
  }

  getInvoices() {
    this.isLoading = true;
    this.service.getInvoices().subscribe({
      next: (res: Invoice[]) => {

        this.isLoading = false;
        this.invoices = res;
        this.filteredInvoices = res;
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

  deliverInvoice(invoice: Invoice) {
    Swal.fire({
      title: '¿Marcar como terminado?',
      text: 'Esta accion eliminara el comprobante de la lista.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed && invoice.deposit !== invoice.total) {
        const selectOptions = this.paymentMethods.map(option => {
          return `<option value="${option.id}">${option.name}</option>`;
        }).join('');
        const result = await Swal.fire({
          title: 'Selecciona una opción',
          html: `
            <select id="dynamic-select" class="swal2-input">
              <option value="" disabled selected>Seleccione una opción</option>
              ${selectOptions}
            </select>
          `,
          focusConfirm: false,
          preConfirm: () => {
            const select = document.getElementById('dynamic-select') as HTMLSelectElement | null;
            return select && select.value ? select.value : null;
          }
        });
        // Manejar la respuesta
        if (result.value) {
          Swal.fire(`Seleccionaste: ${result.value}`);
          const message = `Hola ${invoice?.customer}, gracias por confiar en Pisadas Renovadas.Te invitamos a agendar nuestro número para cualquier consulta o futura reparación.`;
          const whatsappUrl = `https://api.whatsapp.com/send?phone=549${invoice?.phone}&text=${message}`;
          window.open(whatsappUrl, '_blank');
          this.createLastPayment(invoice, result.value);
        } else {
          Swal.fire('No seleccionaste ninguna opción');
        }
      } else {
        this.changeStatus(invoice);
      }
    });
  }

  createLastPayment(invoice: any, paymentMethodId: any) {
    invoice.status = 'Entregado';
    const payment = {
      ...invoice,
      paymentMethodId
    }
    //TODO: llamar a otro endpoint para crearr el nuevo pago
    this.service.createPayment(payment).subscribe({
      next: (resp) => {
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Error de conexion',
          text:
            err?.error?.message ||
            'Ocurrio un error al intentar editar el comprobante',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    })
    this.changeStatus(invoice);
  }

  changeStatus(invoice: Invoice) {
    this.service.changeStatus(invoice.id, "Entregado").subscribe({
      next: () => {
        Swal.fire({
          title: 'Comprobante editado.',
          text: 'El comprobante se ha editado correctamente',
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
            'Ocurrio un error al intentar editar el comprobante',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
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
        this.filteredInvoices = this.invoices.filter((invoice) =>
          invoice.phone.toLowerCase().includes(therm)
        );
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
    switch (therm?.value) {
      case 'pendiente':
        this.filteredInvoices = this.invoices?.filter((invoice) => {
          return invoice.status === 'PENDIENTE';
        });
        break;
      case 'finalizado':
        this.filteredInvoices = this.invoices?.filter((invoice) => {
          return invoice.status === 'FINALIZADO';
        });

        break;
      case 'entregado':
        this.filteredInvoices = this.invoices?.filter((invoice) => {
          return invoice.status === 'ENTREGADO';
        });
        break;
      default:
        this.filteredInvoices = this.invoices?.filter((invoice) => {
          return invoice.status != null;
        });
        break;
    }
    return;
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
          status: 'Finalizado',
        };
        this.finishInvoiceRequest(finishInvoice);
      }
    });
  }

  finishInvoiceRequest(invoice: Invoice) {
    this.alertService.loading('Enviando comprobante', 'Por favor espere...');

    this.service.changeStatus(invoice?.id, "FINALIZADO").subscribe({
      next: () => {
        const message = `Hola ${invoice?.customer}, tu trabajo ha sido finalizado, gracias por confiar en nosotros.`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=549${invoice?.phone}&text=${message}`;
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
    this.qr = '';
    // Opcional: Especificar solo el contenido dentro de #printArea para imprimir
    let messagge = '';
    const date = new Date(invoice?.deliveryDate);
    const formattedDate = format(date, 'dd-MM-yyyy');
    switch (type) {
      case 0:
        this.printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; width: 300px; border: 1px solid #000;">
          <h2 style="text-align: center;">Pisadas Renovadas</h2>
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
        // this.getQr(invoice).then((qrCode) => {
          this.printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; width: 300px; border: 1px solid #000;">
              <p>Nº ${invoice.id}</p>
              <p>Fecha de entrega: ${formattedDate}</p>
              <p>Total $${invoice?.total}</p>
              <p>Seña $${invoice?.deposit}</p>
              <p>Saldo $${invoice?.balance}</p>
              <hr>
              <p>NOMBRE: ${invoice?.customer}</p>
              <p>TELÉFONO: ${invoice?.phone}</p>
              <p>TRABAJO: ${invoice?.job}</p>
            </div>
          `;
          this.print(this.printContent);
        // }).catch((err: any) => {
          // this.alertService.error('Error', err?.error?.message);
        // });
              // <img src="${qrCode}" alt="QR Code">

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
        messagge = `*Nº* ${invoice?.id}\n*Fecha de entrega:* ${formattedDate}\n*Total:* $${invoice?.total}\n*Seña:* $${invoice?.deposit}\n*Saldo:* $${invoice?.balance}\n\n*Si la reparación no se retira dentro de los 15 días, puede sufrir ajuste de precios sin previo aviso.Los trabajos no retirados después de 30 días, pierden todo derecho a reclamo.*
        `;
        this.sendWhatsApp(invoice.phone, messagge);
        break;
      case 4:
        messagge = `*Hola ${invoice?.customer}. Tu trabajo está listo para ser retirado*\nHorarios: Lunes a Viernes. 9 a 13/15.40 a 18.50 hs\nSábados 9 a 13 hs`;
        this.sendWhatsApp(invoice.phone, messagge);
        break;
      case 5:
        messagge = `*Tu trabajo ya fue entregado*`;
        this.sendWhatsApp(invoice.phone, messagge);
        break;
      default:
        break;
    }
  }

  getQr(invoice: Invoice): Promise<string> {
    return new Promise((resolve, reject) => {
      this.service.getQRCode(invoice).subscribe({
        next: (response: any) => {
          resolve(response.qrCode); // Devuelve el código QR
        },
        error: (err: any) => {
          reject(err); // Maneja el error
        },
      });
    });
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
    const whatsappUrl = `https://api.whatsapp.com/send?phone=549${phone}&text=${encodedMessage}`;
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
