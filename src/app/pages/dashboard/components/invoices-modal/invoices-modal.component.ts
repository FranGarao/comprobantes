import { Component, Inject, OnInit } from '@angular/core';
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
    console.log(this.invoicesForm.value);

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
      id: this.lastInvoice + 1,
      total: this.selectedJob?.price,
      deposit: this.invoicesForm.get('deposit')?.value,
      balance: this.balance,
      deliveryDate: this.invoicesForm.get('deliveryDate')?.value,
      name: this.invoicesForm.get('name')?.value,
      phone: this.invoicesForm.get('phone')?.value.toString(),
      job:
        this.jobs?.find((j) => j?.id === this.invoicesForm?.get('job')?.value)
          ?.name || 'null',
      jobId: Number(this.invoicesForm.get('job')?.value),
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
            `Av. Peron 1855 - San Miguel\n` +
            `11 5667 0042\n` +
            `Comprobante N° ${this.form?.id}\n` +
            `Fecha de entrega: ${this.form?.deliveryDate}\n` +
            `Total $${this.form.total}:\n` +
            `Sena $${this.form.deposit}:\n` +
            `Balance $${this.form.balance}:\n` +
            `*HORARIOS*\n` +
            `Lunes a Viernes 09 a 13 hs - 16 a 19 hs\n` +
            `Sabado 09 a 13 hs.\n` +
            `*Si la reparacion no se retira dentro de los 15 dias, puede sufrir ajuste de precios sin previo aviso. Los trabajos no retirados despues de 30 dias, pierden todo derecho a reclamo.*\n`;
          const whatsappUrl = `https://wa.me/${this.form?.phone}?text=${message}}`;
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
    this.selectedJob = this.jobs?.find((job) => job.id === jobId);
    this.setBalance();
    return this.selectedJob;
  }

  setBalance() {
    this.balance =
      this.selectedJob?.price - this.invoicesForm.get('deposit')?.value;
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
}
/*
 !cliente 
  id total sena saldo fechaEntrega + datosLocal
  !local
  id nombre telefono trabajo fechaEntrega total sena saldo 
*/
