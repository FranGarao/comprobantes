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
import { Product, ProductsResponse } from './interfaces/Product';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { PaymentsResponse } from './interfaces/Payment';
import { Sale, SalesResponse } from './interfaces/Sale';
import { SaleModalComponent } from './components/sale-modal/sale-modal.component';
const urlBack = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public job: Job = {} as Job;
  public customer: any;
  public invoice: Invoice = {} as Invoice;
  public product: Product = {} as Product;
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
  sendForm(form: Invoice, paymentMethod: any) {
    const url = `${environment.API_URL}/invoice`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(url, { form, paymentMethod }, { headers: this.headers });
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
  openProduct(x: number) {
    this.dialogRef.open(ProductModalComponent, {
      width: '450px',
      height: '50vh',
      data: {
        id: x,
      },
    });
  }

  openSale(x: number) {
    this.dialogRef.open(SaleModalComponent, {
      width: '450px',
      height: '50vh',
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
  setProduct(i: Product) {
    this.product = i;
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
  updateInvoice(id: number, invoice: Invoice, paymentMethod?: any) {
    const url = `${environment.API_URL}/invoice/${id}`;
    return this.http.put(url, { invoice, paymentMethod }, { headers: this.headers });
  }

  //Elimina la comprobante
  deleteInvoice(id: number) {
    const url = `${environment.API_URL}/invoice/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  changeStatus(id: number, status: string) {
    const url = `${environment.API_URL}/invoice/status/${id}/${status}`;
    return this.http.put(url, { headers: this.headers });
  }

  //Crea un comprobante nuevo
  createInvoice(invoice: Invoice, paymentMethod: any) {
    const url = `${environment.API_URL}/invoice`;
    return this.http.post(url, { invoice, paymentMethod }, { headers: this.headers });
  }

  //Obtiene los trabajos del backend
  // getJobs() {
  //   const url = `${environment.API_URL}/job`;
  //   return this.http.get<JobsResponse>(url, { headers: this.headers })
  //     .pipe(
  //       map(res => {
  //         return res.jobs;
  //       })
  //     );
  // }

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

  getCustomerById(id: number) {
    const url = `${environment.API_URL}/customer/${id}`;
    return this.http.get(url);
  }

  getProducts() {
    const url = `${environment.API_URL}/product`;
    return this.http.get<ProductsResponse>(url, { headers: this.headers })
      .pipe(
        map(res => {
          return res.products;
        })
      );
  }

  updateProduct(id: number, product: Product) {
    const url = `${environment.API_URL}/product/${id}`;
    return this.http.put(url, product, { headers: this.headers });
  }

  createProduct(product: Product) {
    const url = `${environment.API_URL}/product`;
    return this.http.post(url, product, { headers: this.headers });
  }

  deleteProduct(id: number) {
    const url = `${environment.API_URL}/product/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  //Payments

  createPayment(payment: any) {
    const url = `${environment.API_URL}/payment`;
    return this.http.post(url, payment, { headers: this.headers });
  }

  getPayments() {
    const url = `${environment.API_URL}/payment`;
    return this.http.get<PaymentsResponse>(url, { headers: this.headers })
  }

  getPaymentsWithDetails() {
    const url = `${environment.API_URL}/payment/details`;
    return this.http.get<PaymentsResponse>(url, { headers: this.headers })
  }
  getPaymentsMethods() {
    const url = `${environment.API_URL}/payment/methods`;
    return this.http.get(url, { headers: this.headers })
  }
  //Sales
  getPaymentsMethodById(id: number) {
    const url = `${environment.API_URL}/payment/methods/${id}`;
    return this.http.get(url, { headers: this.headers })
  }

  getSales() {
    const url = `${environment.API_URL}/sale`;
    return this.http.get<SalesResponse>(url, { headers: this.headers })
      .pipe(
        map(res => {
          return res.sales;
        })
      );
  }

  //QR
  getQRCode(invoice: Invoice) {
    const url = `${environment.API_URL}/invoice/qr/${invoice.id}`;
    return this.http.get(url);
  }

  createSale(sale: any) {
    const url = `${environment.API_URL}/sale`;
    return this.http.post(url, sale, { headers: this.headers });
  }
  logout() {
    localStorage.removeItem('AuthToken');
    const url = `${environment.API_URL}/user/logout`;
    return this.http.get(url);
  }


  //Google Sheets
  getGoogleSheets() {
    const url = `${environment.API_URL}/sheets/read-sheet`;
    return this.http.get(url);
  }
}
