import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Invoice } from '../../interfaces/Invoice';
import { Customer } from '../../interfaces/Customer';
import { Job } from '../../interfaces/Job';
import { DashboardService } from '../../dashboard.service';
@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrl: './new-invoice.component.css',
  standalone: false
})
export class NewInvoiceComponent {
  public invoiceForm: FormGroup = new FormGroup({});
  public customers: Customer[] = [];
  public jobs: Job[] = [];
  private selectedJobs: number[] = [];
  constructor(private fb: FormBuilder, private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getJobs();
    this.getCustomers();
    this.invoiceForm = this.fb.group({
      total: [null, [Validators.required, Validators.min(0)]],
      deposit: [null, [Validators.required, Validators.min(0)]],
      balance: [null, [Validators.required]],
      customer: [null, Validators.required],
      customCustomerName: [null],
      job: [null, Validators.required],
      customJobName: [null],
      customJobPrice: [null, Validators.min(0)],
      phone: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      deliveryDate: [null, Validators.required],
    });
  }
  onSubmit() {
  }

  getJobs() {
    this.dashboardService.getGoogleSheets().subscribe({
      next: (jobs: any) => {
        this.jobs = jobs.data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getCustomers() {
    this.dashboardService.getCustomers().subscribe({
      next: (customers: any) => {
        this.customers = customers;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  addJob(id: number) {
    this.selectedJobs.push(id);
  }

  addCustomJob() {
  }
}
