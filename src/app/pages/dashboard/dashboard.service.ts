import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice, InvoicesResponse } from './interfaces/Invoice';
import { environment } from '../../../environments/env';
import { InvoicesModalComponent } from './components/invoices-modal/invoices-modal.component';
import { JobModalComponent } from './components/job-modal/job-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Job, JobsResponse } from './interfaces/Job';
import { CustomerModalComponent } from './components/customer-modal/customer-modal.component';
import { Customer, CustomersResponse } from './interfaces/Customer';
import { BehaviorSubject, map } from 'rxjs';
const urlBack = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public job: Job = {} as Job;
  public customer: any;
  public invoice: Invoice = {} as Invoice;
  private token: string = localStorage.getItem('AuthToken') || '';
  private invoicesSource = new BehaviorSubject<any[]>([]);
  comprobantes$ = this.invoicesSource.asObservable();
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token}`,
  });
  constructor(private http: HttpClient, private dialogRef: MatDialog) { }

  addInvoice(newComprobante: any) {
    const currentInvoices = this.invoicesSource.value;
    this.invoicesSource.next([...currentInvoices, newComprobante]);
  }

  //Postea el formulario al backend
  sendForm(form: Invoice) {
    const url = `${environment.API_URL}/invoice`;
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
    const url = `${environment.API_URL}/invoice`;
    return this.http.get<InvoicesResponse>(url, { headers: this.headers })
      .pipe(
        map(res => {
          return res.invoices;
        })
      );
  }

  //Obtiene comprobante por id
  getInvoice(id: number) {
    const url = `${environment.API_URL}/invoice/${id}`;
    return this.http.get(url);
  }

  //Actualiza la comprobante
  updateInvoice(id: number, invoice: Invoice) {
    const url = `${environment.API_URL}/invoice/${id}`;
    return this.http.put(url, invoice, { headers: this.headers });
  }

  //Elimina la comprobante
  deleteInvoice(id: number) {
    const url = `${environment.API_URL}/invoice/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  //Crea un comprobante nuevo
  createInvoice(invoice: Invoice) {
    const url = `${environment.API_URL}/invoice`;
    return this.http.post(url, invoice, { headers: this.headers });
  }

  //Obtiene los trabajos del backend
  getJobs() {
    const url = `${environment.API_URL}/job`;
    return this.http.get<JobsResponse>(url, { headers: this.headers })
      .pipe(
        map(res => {
          return res.jobs;
        })
      );
  }

  // Borra un trabajo
  deleteJob(id: number) {
    const url = `${environment.API_URL}/job/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  createJob(job: any) {
    const url = `${environment.API_URL}/job`;

    return this.http.post(url, job, { headers: this.headers });
  }

  //Actualiza un trabajo
  updateJob(id: number, job: any) {
    const url = `${environment.API_URL}/job/${id}`;

    return this.http.put(url, job, { headers: this.headers });
  }

  createCustomer(customer: Customer) {
    const url = `${environment.API_URL}/customer`;

    return this.http.post<Customer>(url, customer, { headers: this.headers });
  }

  updateCustomer(id: number, customer: any) {
    const url = `${environment.API_URL}/customer/${id}`;

    return this.http.put(url, customer, { headers: this.headers });
  }

  deleteCustomer(id: number) {
    const url = `${environment.API_URL}/customer/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  getCustomers() {
    const url = `${environment.API_URL}/customer`;
    return this.http.get<CustomersResponse>(url, { headers: this.headers })
      .pipe(
        map(res => {
          return res.customers;
        })
      );
  }

  logout() {
    localStorage.removeItem('AuthToken');
    const url = `${environment.API_URL}/user/logout`;
    return this.http.get(url);
  }
}
