import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from './interfaces/Invoice';
import { environment } from '../../../environments/env.example';
import { InvoicesModalComponent } from './components/invoices-modal/invoices-modal.component';
import { JobModalComponent } from './components/job-modal/job-modal.component';
import { MatDialog } from '@angular/material/dialog';
const urlBack = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private dialogRef: MatDialog) {}

  //Postea el formulario al backend
  sendForm(form: Invoice) {
    console.log({ XXXXXXXX: form });

    const url = `${environment.API_URL}/invoices`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(url, form, { headers });
  }

  openInvoice() {
    this.dialogRef.open(InvoicesModalComponent, {
      data: {
        formulario: 'Esto es un formulario de prueba',
      },
      width: '500px',
      height: '85vh',
    });
  }
  openJob() {
    this.dialogRef.open(JobModalComponent, {
      width: '500px',
      height: '300px',
    });
  }

  //Obtiene las comprobantes del backend
  getInvoices() {
    const url = `${environment.API_URL}/invoices`;
    return this.http.get<Invoice[]>(url);
  }

  //Obtiene comprobante por id
  getInvoice(id: number) {
    const url = `${environment.API_URL}/invoices/${id}`;
    return this.http.get(url);
  }

  //Actualiza la comprobante
  updateInvoice(id: number, invoice: Invoice) {
    const url = `${environment.API_URL}/invoices/${id}`;
    return this.http.put(url, invoice);
  }

  //Elimina la comprobante
  deleteInvoice(id: number) {
    const url = `${environment.API_URL}/invoices/${id}`;
    return this.http.delete(url);
  }

  //Crea un comprobante nuevo
  createInvoice(invoice: Invoice) {
    const url = `${environment.API_URL}/invoices`;
    return this.http.post(url, invoice);
  }

  //Obtiene los trabajos del backend
  getJobs() {
    const url = `${environment.API_URL}/jobs`;
    return this.http.get(url);
  }

  // Borra un trabajo
  deleteJob(id: number) {
    const url = `${environment.API_URL}/jobs/${id}`;
    return this.http.delete(url);
  }
}
