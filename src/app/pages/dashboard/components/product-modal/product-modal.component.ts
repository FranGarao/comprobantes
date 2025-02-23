import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import Swal from 'sweetalert2';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertsService } from '../../alerts.service';
import { Product } from '../../interfaces/Product';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css',
  standalone: false
})
export class ProductModalComponent {
  public productsForm: FormGroup = new FormGroup({});
  public product: Product | null = null;
  private products: Product[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private fb: FormBuilder,
    private service: DashboardService,
    private alertService: AlertsService
  ) { }

  ngOnInit(): void {
    if (this.data?.id === 0) {
      this.product = null;
    } else this.product = this.service.product;
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class
    this.getProducts();
    this.createForm();
  }

  getProducts() {
    this.service.getProducts().subscribe({
      next: (resp) => {
        this.products = resp;
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo obtener el trabajo', 'error');
        console.log({ error });
      },
    });
  }

  /**
   * crea el formulario de trabajos
   * @return {void}
   */
  createForm() {
    this.productsForm = this.fb.group({
      id: [this.product?.id || '', Validators.required],
      name: [this.product?.name || '', Validators.required],
      //description: [''],
      price: [this.product?.price || '', Validators.required],
      //status: ['']
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
  createProduct() {
    this.product = {
      //TODO: el id lo agrega solo la DB
      //description: this.jobsForm.value.description,
      name: this.productsForm.value.name,
      price: this.productsForm.value.price,
      //status: this.jobsForm.value.status,
    };

    this.alertService.loading('Creando producto', 'Por favor espere...');
    this.service.createProduct(this.product).subscribe({
      next: () => {
        Swal.fire('Trabajo creado', '', 'success');
        this.getProducts();
        this.dialogRef.close();
      },
      error: (error) => {
        console.log({ error });
        Swal.fire('Error', 'No se pudo crear el trabajo', 'error');
      },
    });
  }

  updateProduct(id: any) {
    this.alertService.loading('Editando trabajo', 'Por favor espere...');
    // const id = this.product?.id;
    const updatedProduct = {
      id,
      name: this.productsForm.value.name,
      price: this.productsForm.value.price,
    };
    this.service.updateProduct(id, updatedProduct).subscribe({
      next: () => {
        this.dialogRef.close();
        Swal.fire('Trabajo actualizado', '', 'success');
        this.getProducts();
      },
      error: (error) => {
        console.log({ error });
        Swal.fire('Error', 'No se pudo actualizar el trabajo', 'error');
      },
    });
  }
}
