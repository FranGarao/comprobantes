import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DashboardService } from '../../dashboard.service';
import { Job } from '../../interfaces/Job';
import { Invoice } from '../../interfaces/Invoice';
import { Customer } from '../../interfaces/Customer';
import { AlertsService } from '../../alerts.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-invoices-modal',
  templateUrl: './invoices-modal.component.html',
  styleUrl: './invoices-modal.component.css',
})
export class InvoicesModalComponent implements OnInit {
  @Output() comprobanteCreated = new EventEmitter<any>();

  public firstName: string = '';
  public invoicesForm: FormGroup = new FormGroup({});
  public form: Invoice = {} as Invoice;
  public jobs: Job[] = [];
  public customers: any[] = [];
  public selectedJobs: any[] = [];
  public addJobs: any[] = [0];
  public lastInvoice: number = 0;
  public selectedJob: any;
  public invoice: Invoice | null = null;
  public balance: number = 0;
  public newJobExist: boolean = false;
  private newJob: any;
  private jobId: number = 0;
  private printContent: string = '';
  @ViewChild('newJobName', { static: false })
  newJobName!: ElementRef;
  @ViewChild('newJobPrice', { static: false })
  newJobPrice!: ElementRef;
  /**
   *
   */

  title = 'pdf-generation';

  generatePDF() {
    const doc = new jsPDF();
    doc.text('Hello world!', 10, 10);
    doc.save('example.pdf');
  }
  constructor(
    public dialogRef: MatDialogRef<InvoicesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { x: number },
    private fb: FormBuilder,
    private alertService: AlertsService,
    private service: DashboardService
  ) {}

  ngOnInit(): void {
    if (this.data?.x === 0) {
      this.invoice = null;
      this.buildForm();
    } else {
      this.invoice = this.service.invoice;
      console.log({ invoice: this.invoice });

      this.invoicesForm = this.fb.group({
        id: [this.invoice.id],
        total: [this.invoice.total],
        deposit: [this.invoice.deposit],
        balance: [this.invoice.balance],
        name: [this.invoice.name, Validators.required],
        phone: [this.invoice.phone, Validators.required],
        job: [this.invoice.job, Validators.required],
        deliveryDate: [this.invoice.deliveryDate, Validators.required],
      });
    }

    this.getJobs();
    this.getLastInvoice();
    this.getCustomers();
  }
  buildForm() {
    //TODO agregar required
    this.invoicesForm = this.fb.group({
      id: [''],
      total: [''],
      deposit: [''],
      balance: [''],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      job: ['', Validators.required],
      deliveryDate: ['', Validators.required],
    });
  }

  setCustomer(name: any, lastName: any, phone: any) {
    this.invoicesForm.get('name')?.setValue(name + ' ' + lastName);
    this.invoicesForm.get('phone')?.setValue(phone);
  }

  sendForm() {
    if (this.invoicesForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor complete los campos requeridos',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    this.alertService.loading('Creando comprobante', 'Por favor espere...');

    const jobs: any[] = [];

    this.selectedJobs.forEach((j: any) => {
      if (j.name) jobs.push(j.name);
      else jobs.push(j);
    });

    const jobStrings = jobs.map((j: any) => j).join(', ');
    if (this.selectedJobs.length === 1) {
      this.jobId = Number(this.invoicesForm.get('job')?.value);
    }

    this.form = {
      id: this.lastInvoice,
      total: this.invoicesForm.get('total')?.value,
      deposit: this.invoicesForm.get('deposit')?.value,
      balance: this.balance,
      deliveryDate: this.invoicesForm.get('deliveryDate')?.value,
      name: this.invoicesForm.get('name')?.value,
      phone: this.invoicesForm.get('phone')?.value.toString(),
      job: jobStrings,
      jobId: this.jobId || 0,
      status: false,
    };
    this.service.sendForm(this.form).subscribe({
      next: () => {
        this.service.addInvoice(this.form);
        this.closeModal();
        Swal.fire({
          title: 'Formulario enviado',
          text: 'El formulario ha sido enviado con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          const message =
            `*GENERACION DE ZAPATEROS*\n` +
            `*Comprobante N°* ${this.form?.id}\n` +
            `*Fecha de entrega:* ${this.form?.deliveryDate}\n` +
            `*Seña:* $${this.form.deposit}\n` +
            `*Saldo:* $${this.form.balance}\n\n` +
            `*HORARIOS*\n` +
            `Lunes a Viernes 09 a 13 hs - 16 a 19 hs\n` +
            `Sábado 09 a 13 hs\n\n` +
            `*Si la reparación no se retira dentro de los 15 días, puede sufrir ajuste de precios sin previo aviso. Los trabajos no retirados después de 30 días pierden todo derecho a reclamo.*\n`;

          const encodedMessage = encodeURIComponent(message);
          const phoneNumber = this.form?.phone; // Asegúrate de que el número de teléfono esté correctamente formateado
          const whatsappUrl = `https://wa.me/549${phoneNumber}?text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text:
            error?.error?.message ||
            'Ha ocurrido un error al enviar el formulario',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
  edit() {
    if (this.invoicesForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor complete los campos requeridos',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    this.form = {
      id: this.invoice?.id || this.invoicesForm.get('id')?.value,
      total: this.invoicesForm.get('total')?.value,
      deposit: this.invoicesForm.get('deposit')?.value,
      balance: this.balance,
      deliveryDate: this.invoicesForm.get('deliveryDate')?.value,
      name: this.invoicesForm.get('name')?.value,
      phone: this.invoicesForm.get('phone')?.value.toString(),
      job: this.invoice?.job || '',
      jobId: this.invoice?.jobId || 0,
      status: this.invoice?.status || false,
    };

    this.submitUpdated(this.form);
  }

  submitUpdated(form: any) {
    Swal.fire({
      title: 'Editar formulario',
      text: 'Desea Editar el formulario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alertService.loading(
          'Editando comprobante',
          'Por favor espere...'
        );

        this.service.updateInvoice(this.form.id, form).subscribe({
          next: () => {
            this.closeModal();
            Swal.fire({
              title: 'Formulario editado',
              text: 'El formulario ha sido editado con éxito',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text:
                error?.error?.message ||
                'Ha ocurrido un error al enviar el formulario',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
      }
    });
  }
  submit() {
    Swal.fire({
      title: 'Enviar formulario',
      text: 'Desea enviar el formulario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      result.isConfirmed ? this.sendForm() : null;
    });
  }
  closeModal(): void {
    this.dialogRef.close();
  }

  getJobs() {
    this.service.getJobs().subscribe({
      next: (jobs: any) => {
        this.jobs = jobs;
      },
      error: (error) => console.error(error),
    });
  }
  getCustomers() {
    this.service.getCustomers().subscribe({
      next: (customers: Customer[]) => {
        this.customers = customers;
      },
      error: (error) => console.error(error),
    });
  }

  saveJob() {
    const newJobName = this.newJobName.nativeElement.value;
    const newJobPrice = this.newJobPrice.nativeElement.value;
    this.newJob = { name: newJobName, price: newJobPrice };
    this.invoicesForm
      .get('total')
      ?.setValue(
        Number(this.invoicesForm.get('total')?.value) + Number(newJobPrice)
      );
    this.selectedJobs.push(this.newJob);
    this.setBalance();
  }

  getLastInvoice() {
    this.service.getInvoices().subscribe({
      next: (invoices: Invoice[]) => {
        const invoicesIds: number[] = [];
        invoices.forEach((invoice: Invoice) => invoicesIds.push(invoice.id));
        if (invoicesIds.length > 0) {
          this.lastInvoice = Math.max(...invoicesIds) + 1;
        } else this.lastInvoice = 1;
      },
      error: (error) => console.error(error),
    });
  }

  showSelectedJobs() {
    const jobsStrings = this.selectedJobs
      .map((j: Job) => (j.name ? j.name : j))
      .join(', ');

    Swal.fire({
      title: 'Trabajos seleccionados',
      text: jobsStrings,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    });
  }

  selectJob(job: Job) {
    if (job?.id === 0) {
      this.newJobExist = true;
      return;
    }

    this.selectedJobs.push(job);
    this.invoicesForm
      .get('total')
      ?.setValue(
        Number(job?.price) + Number(this.invoicesForm.get('total')?.value)
      );

    this.setBalance();
  }

  setBalance() {
    this.balance =
      this.invoicesForm.get('total')?.value -
      this.invoicesForm.get('deposit')?.value;
  }

  printInvoice(type: number) {
    // Opcional: Especificar solo el contenido dentro de #printArea para imprimir
    const jobs: any[] = [];
    this.selectedJobs.forEach((j: Job) => {
      if (j.name) jobs.push(j.name);
      else jobs.push(j);
    });
    const jobStrings = jobs.map((j: any) => j).join(', ');
    switch (type) {
      case 0:
        this.printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; width: 300px; border: 1px solid #000;">
          <h2 style="text-align: center;">Generación de Zapateros</h2>
          <p style="text-align: center;">Compostura de Calzado</p>
          <p style="text-align: center;">Av. Perón 1855 - San Miguel</p>
          <p style="text-align: center;">11 5667 0042</p>
          <hr>
          <p>Nº ${this.lastInvoice}</p>
          <p>Trabajo:${jobStrings}</p>
          <p>Fecha de entrega: ${
            this.invoicesForm.get('deliveryDate')?.value
          }</p>
          <p>Total $${this.invoicesForm.get('total')?.value}</p>
          <p>Seña $${this.invoicesForm.get('deposit')?.value}</p>
          <p>Saldo $${this.balance}</p>
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
        break;

      case 1:
        this.printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; width: 300px; border: 1px solid #000;">
          <p>Nº ${this.lastInvoice}</p>
          <p>Fecha de entrega: ${
            this.invoicesForm.get('deliveryDate')?.value
          }</p>
          <p>Total $${this.invoicesForm.get('total')?.value}</p>
          <p>Seña $${this.invoicesForm.get('deposit')?.value}</p>
          <p>Saldo $${this.balance}</p>
          <hr>
          <p>NOMBRE: ${this.invoicesForm.get('name')?.value}</p>
          <p>TELÉFONO: ${this.invoicesForm.get('phone')?.value}</p>
          <p>TRABAJO: ${jobStrings}</p>
        </div>
      `;

        break;
      case 2:
        this.printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; width: 300px; border: 1px solid #000;">
          <p>Nº ${this.lastInvoice}</p>
          <p>Trabajo:</p>
        </div>
      `;
        break;

      default:
        break;
    }
    this.print(this.printContent);
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
  rmJob() {
    const lastJob = this.selectedJobs.pop();
    this.invoicesForm
      .get('total')
      ?.setValue(Number(this.invoicesForm.get('total')?.value) - lastJob.price);
    this.setBalance();
  }
}
/*
 !cliente 
  id total sena saldo fechaEntrega + datosLocal
  !local
  id nombre telefono trabajo fechaEntrega total sena saldo 
*/
