import { Component } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrl: './customer-modal.component.css',
})
export class CustomerModalComponent {
  public customerForm: FormGroup = new FormGroup({});
  public customers: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CustomerModalComponent>,
    public fb: FormBuilder,
    private service: DashboardService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getCustomers();
    this.createForm();
  }

  getCustomers() {
    this.service.getCustomers().subscribe({
      next: (data: any) => {
        console.log({ data });
        this.customers = data;
      },
      error: (error: any) => {
        console.log({ error });
      },
    });
  }

  createForm() {
    this.customerForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
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
      Phone: this.customerForm.value.phone,
      //status: this.jobsForm.value.status,
    };
    console.log({ newCustomer });

    this.service.createJob(newCustomer).subscribe({
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
}
