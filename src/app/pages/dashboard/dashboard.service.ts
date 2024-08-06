import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from './interfaces/Invoice';
import { environment } from '../../../environments/env.example';
import { InvoicesModalComponent } from './components/invoices-modal/invoices-modal.component';
import { JobModalComponent } from './components/job-modal/job-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Job } from './interfaces/Job';
import { CustomerModalComponent } from './components/customer-modal/customer-modal.component';
import { Customer } from './interfaces/Customer';
const urlBack = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public job: Job = {} as Job;
  public customer: any;
  public invoice: Invoice = {} as Invoice;
  private token: string = localStorage.getItem('AuthToken') || '';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token}`,
  });
  constructor(private http: HttpClient, private dialogRef: MatDialog) {}

  //Postea el formulario al backend
  sendForm(form: Invoice) {
    const url = `${environment.API_URL}/invoices`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(url, form, { headers: this.headers });
  }

  openInvoice(x: number) {
    this.dialogRef.open(InvoicesModalComponent, {
      data: {
        x,
      },
      width: '500px',
      height: '85vh',
    });
  }
  openJob(x: number) {
    this.dialogRef.open(JobModalComponent, {
      width: '500px',
      height: '300px',
      data: {
        id: x,
      },
    });
  }
  openCustomer(x: number) {
    this.dialogRef.open(CustomerModalComponent, {
      width: '500px',
      height: '55vh',
      data: {
        id: x,
      },
    });
  }
  setJob(job: Job) {
    this.job = job;
  }
  setCustomer(c: any) {
    this.customer = c;
  }
  setInvoice(i: Invoice) {
    this.invoice = i;
  }
  //Obtiene las comprobantes del backend
  getInvoices() {
    const url = `${environment.API_URL}/invoices`;
    console.log({ tok: this.token });

    return this.http.get<Invoice[]>(url, { headers: this.headers });
  }

  //Obtiene comprobante por id
  getInvoice(id: number) {
    const url = `${environment.API_URL}/invoices/${id}`;
    return this.http.get(url);
  }

  //Actualiza la comprobante
  updateInvoice(id: number, invoice: Invoice) {
    const url = `${environment.API_URL}/invoices/${id}`;
    return this.http.put(url, invoice, { headers: this.headers });
  }

  //Elimina la comprobante
  deleteInvoice(id: number) {
    const url = `${environment.API_URL}/invoices/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  //Crea un comprobante nuevo
  createInvoice(invoice: Invoice) {
    const url = `${environment.API_URL}/invoices`;
    return this.http.post(url, invoice, { headers: this.headers });
  }

  //Obtiene los trabajos del backend
  getJobs() {
    const url = `${environment.API_URL}/jobs`;
    return this.http.get<Job[]>(url, { headers: this.headers });
  }

  // Borra un trabajo
  deleteJob(id: number) {
    const url = `${environment.API_URL}/jobs/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  createJob(job: any) {
    const url = `${environment.API_URL}/jobs`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(url, job, { headers: this.headers });
  }

  //Actualiza un trabajo
  updateJob(job: any) {
    const url = `${environment.API_URL}/jobs/${job.Id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(url, job, { headers: this.headers });
  }

  createCustomer(customer: Customer) {
    const url = `${environment.API_URL}/customer`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<Customer>(url, customer, { headers: this.headers });
  }

  updateCustomer(customer: any) {
    const url = `${environment.API_URL}/customer/${customer.Id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(url, customer, { headers: this.headers });
  }

  deleteCustomer(id: number) {
    const url = `${environment.API_URL}/customer/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  getCustomers() {
    const url = `${environment.API_URL}/customer`;
    return this.http.get<Customer[]>(url, { headers: this.headers });
  }
}
