import { Component, Inject } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrl: './customer-modal.component.css',
})
export class CustomerModalComponent {
  public customerForm: FormGroup = new FormGroup({});
  public customers: any[] = [];
  public customer: any = null;

  constructor(
    public dialogRef: MatDialogRef<CustomerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    public fb: FormBuilder,
    private service: DashboardService
  ) {}

  ngOnInit(): void {
    if (this.data?.id === 0) {
      this.customer = null;
    } else {
      this.customer = this.service.customer;
      console.log({ customer: this.customer });
    }

    console.log({ customer: this.customer, data: this.data.id });

    this.createForm();
    this.getCustomers();
  }

  getCustomers() {
    this.service.getCustomers().subscribe({
      next: (data: any) => {
        this.customers = data;
      },
      error: (error: any) => {
        console.log({ error });
      },
    });
  }

  createForm() {
    this.customerForm = this.fb.group({
      id: [this.customer?.id || '', Validators.required],
      name: [this.customer?.name || '', Validators.required],
      lastName: [this.customer?.lastName || '', Validators.required],
      email: [this.customer?.email || '', Validators.required],
      phone: [this.customer?.phone || '', Validators.required],
    });
  }

  addCustomer() {
    const lastCustomer = this.customers[this.customers.length - 1];
    const newCustomer = {
      Id: lastCustomer.id + 1,
      //description: this.jobsForm.value.description,
      Name: this.customerForm.value.name,
      LastName: this.customerForm.value.lastName,
      Email: this.customerForm.value.email,
      Phone: this.customerForm.value.phone.toString(),
      //status: this.jobsForm.value.status,
    };
    console.log({ newCustomer });
    this.service.createCustomer(newCustomer).subscribe({
      next: () => {
        this.dialogRef.close();
        Swal.fire('Cliente creado', '', 'success');
        this.getCustomers();
      },
      error: (error) => {
        console.log({ error });
        Swal.fire('Error', 'No se pudo crear el trabajo', 'error');
      },
    });
  }

  editCustomer(Id: number) {
    const newCustomer = {
      Id,
      Name: this.customerForm.value.name,
      LastName: this.customerForm.value.lastName,
      Email: this.customerForm.value.email,
      Phone: this.customerForm.value.phone.toString(),
    };
    this.service.updateCustomer(newCustomer).subscribe({
      next: () => {
        this.dialogRef.close();
        Swal.fire('Cliente editado', '', 'success');
        this.getCustomers();
      },
      error: (error) => {
        console.log({ error });
        Swal.fire('Error', 'No se pudo crear el trabajo', 'error');
      },
    });
  }
}
