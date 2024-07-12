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
    this.invoicesForm = this.fb.group({
      id: ['', Validators.required],
      total: ['', Validators.required],
      deposit: ['', Validators.required],
      balance: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      job: ['', Validators.required],
      deliveryDate: ['', Validators.required],
    });
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
    this.form = {
      Id: this.lastInvoice + 1,
      Total: this.invoicesForm.get('total')?.value,
      Deposit: this.invoicesForm.get('deposit')?.value,
      Balance: this.invoicesForm.get('balance')?.value,
      DeliveryDate: this.invoicesForm.get('deliveryDate')?.value,
      Name: this.invoicesForm.get('name')?.value,
      Phone: this.invoicesForm.get('phone')?.value.toString(),
      Job:
        this.jobs?.find((j) => j?.id === this.invoicesForm?.get('job')?.value)
          ?.name || 'null',
      JobId: Number(this.invoicesForm.get('job')?.value),
    };

    this.service.sendForm(this.form).subscribe({
      next: (response) => {
        console.log({ response });
        Swal.fire({
          title: 'Formulario enviado',
          text: 'El formulario ha sido enviado con éxito',
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

  submit() {
    Swal.fire({
      title: 'Enviar formulario',
      text: 'Estas segura de enviar el formulario?',
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
        console.log({ jobs });
        this.jobs = jobs;
      },
      error: (error) => console.error(error),
    });
  }

  getLastInvoice() {
    this.service.getInvoices().subscribe({
      next: (invoices: any) => {
        this.lastInvoice = invoices.length;
        console.log({ lastInvoice: this.lastInvoice });
      },
      error: (error) => console.error(error),
    });
  }

  selectJob() {
    const jobId = Number(this.invoicesForm?.get('job')?.value);

    this.selectedJob = this.jobs?.find((job) => job.id === jobId);
    console.log({ SJ: this.selectedJob });
    return this.selectedJob;
  }
}
/*
 !cliente 
  id total sena saldo fechaEntrega + datosLocal
  !local
  id nombre telefono trabajo fechaEntrega total sena saldo 
*/
