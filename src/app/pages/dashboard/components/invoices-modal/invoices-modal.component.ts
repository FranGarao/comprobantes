import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DashboardService } from '../../dashboard.service';
import { Job } from '../../interfaces/Job';
import { Invoice } from '../../interfaces/Invoice';
@Component({
  selector: 'app-invoices-modal',
  templateUrl: './invoices-modal.component.html',
  styleUrl: './invoices-modal.component.css',
})
export class InvoicesModalComponent implements OnInit {
  public firstName: string = '';
  public invoicesForm: FormGroup = new FormGroup({});
  public form: Invoice = {} as Invoice;
  public jobs: Job[] = [];
  public lastInvoice: number = 0;
  public selectedJob: any;
  public balance: number = 0;
  public newJobExist: boolean = false;
  private printContent: string = '';
  @ViewChild('newJob', { static: false })
  newJob!: ElementRef;
  /**
   *
   */
  constructor(
    public dialogRef: MatDialogRef<InvoicesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: DashboardService
  ) {
    this.firstName = data.formulario;
  }

  ngOnInit(): void {
    this.getJobs();
    this.buildForm();
    this.getLastInvoice();
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
  sendForm() {
    console.log({ FORM: this.invoicesForm.value });

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
      id: this.lastInvoice,
      total: this.invoicesForm.get('total')?.value,
      deposit: this.invoicesForm.get('deposit')?.value,
      balance: this.balance,
      deliveryDate: this.invoicesForm.get('deliveryDate')?.value,
      name: this.invoicesForm.get('name')?.value,
      phone: this.invoicesForm.get('phone')?.value.toString(),
      job:
        this.jobs?.find((j) => j?.id === this.invoicesForm?.get('job')?.value)
          ?.name || 'null',
      jobId: Number(this.invoicesForm.get('job')?.value) || 0,
      status: false,
    };

    this.service.sendForm(this.form).subscribe({
      next: () => {
        Swal.fire({
          title: 'Formulario enviado',
          text: 'El formulario ha sido enviado con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          // Redirigir a WhatsApp después de que el usuario cierre la alerta
          const message =
            `*GENERACION DE ZAPATEROS*
                      
                      \n` +
            `Compostura de Calzado\n` +
            '         ' +
            `Av. Peron 1855 - San Miguel\n` +
            '         ' +
            `11 5667 0042\n` +
            `Comprobante N° ${this.form?.id}\n` +
            '         ' +
            `Fecha de entrega: ${this.form?.deliveryDate}\n` +
            '         ' +
            `Total $${this.form.total}:\n` +
            '         ' +
            `Sena $${this.form.deposit}:\n` +
            '         ' +
            `Balance $${this.form.balance}:\n` +
            '         ' +
            `*HORARIOS*\n` +
            '         ' +
            `Lunes a Viernes 09 a 13 hs - 16 a 19 hs\n` +
            '         ' +
            `Sabado 09 a 13 hs.\n` +
            '         ' +
            `*Si la reparacion no se retira dentro de los 15 dias, puede sufrir ajuste de precios sin previo aviso. Los trabajos no retirados despues de 30 dias, pierden todo derecho a reclamo.*\n`;
          const whatsappUrl = `https://wa.me/549${this.form?.phone}?text=${message}}`;
          console.log({ whatsappUrl });

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

  saveJob() {
    if (this.newJob) {
      const newJobValue = this.newJob.nativeElement.value;
      this.invoicesForm.get('job')!.setValue(newJobValue);
      console.log({ Trabajo: this.invoicesForm.get('job')?.value });

      // Aquí puedes guardar el valor del nuevo trabajo en donde necesites
    }
  }

  getLastInvoice() {
    this.service.getInvoices().subscribe({
      next: (invoices: Invoice[]) => {
        const invoicesIds: number[] = [];
        invoices.forEach((invoice: Invoice) => invoicesIds.push(invoice.id));
        this.lastInvoice = Math.max(...invoicesIds) + 1;
        console.log({ lastInvoice: this.lastInvoice });
      },
      error: (error) => console.error(error),
    });
  }

  selectJob() {
    const jobId = Number(this.invoicesForm?.get('job')?.value);
    if (jobId !== 0) {
      this.newJobExist = false;
      this.selectedJob = this.jobs?.find((job) => job.id === jobId);
      this.invoicesForm.get('total')?.setValue(this.selectedJob?.price);
      this.setBalance();
      return this.selectedJob;
    } else {
      this.newJobExist = true;
    }
  }

  setBalance() {
    this.balance =
      this.invoicesForm.get('total')?.value -
      this.invoicesForm.get('deposit')?.value;

    console.log({
      total: this.invoicesForm.get('total')?.value,
      deposito: this.invoicesForm.get('deposit')?.value,
      balance: this.balance,
    });
  }

  printInvoice(type: number) {
    // Opcional: Especificar solo el contenido dentro de #printArea para imprimir
    const job =
      this.jobs?.find((j) => j?.id == this.invoicesForm?.get('job')?.value) ||
      this.invoicesForm.get('job')?.value;
    console.log({ job });

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
          <p>Trabajo: ${job?.name || job}</p>
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
          <p>TRABAJO: ${job?.name || job}</p>
        </div>
      `;

        break;
      case 2:
        this.printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; width: 300px; border: 1px solid #000;">
          <p>Nº ${this.lastInvoice}</p>
          <p>Trabajo: ${job?.name || job}</p>
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
}
/*
 !cliente 
  id total sena saldo fechaEntrega + datosLocal
  !local
  id nombre telefono trabajo fechaEntrega total sena saldo 
*/
