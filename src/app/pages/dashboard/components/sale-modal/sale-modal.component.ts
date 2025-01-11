import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../../interfaces/Product';
import { DashboardService } from '../../dashboard.service';
import { AlertsService } from '../../alerts.service';
import { Sale } from '../../interfaces/Sale';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale-modal',
  standalone: false,

  templateUrl: './sale-modal.component.html',
  styleUrl: './sale-modal.component.css'
})
export class SaleModalComponent {
  public salesForm: FormGroup = new FormGroup({})
  public products: Product[] = []
  public product: Product | null = null
  public selectedProduct: Product | null = null
  public paymentMethods: any
  public paymentMethod: any

  /**
   *
   */
  constructor(private alertService: AlertsService, private service: DashboardService, private fb: FormBuilder) {
    this.salesForm = this.fb.group({
      product: null,
      date: null,
      paymentMethod: null,
    });
  }
  ngOnInit() {
    this.service.getPaymentsMethods().subscribe({
      next: (resp) => {
        this.paymentMethods = resp;
      },
      error: (error) => {
        this.alertService.error('Error', 'No se pudieron obtener los metodos de pago')
      }
    })
    this.service.getProducts().subscribe({
      next: (resp) => {
        this.products = resp;
      },
      error: (error) => {
        this.alertService.error('Error', 'No se pudieron obtener los productos')
      }
    })
  }

  previousSubmit() {
    Swal.fire({
      title: 'Crear Venta?',
      text: "No podes revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, crear!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.submit()
      }
    })
  }

  submit() {
    const { product, date, paymentMethod } = this.salesForm.value;
    const sale = {
      product_id: product,
      payment_id: paymentMethod,
      date
    }
    if (!product || !date || !paymentMethod) {
      this.alertService.error('Error', 'Todos los campos son obligatorios')
      return
    }
    this.service.createSale(sale).subscribe({
      next: (resp) => {
        this.alertService.success('Venta creada', 'Venta creada correctamente')
      },
      error: (error) => {
        this.alertService.error('Error', 'No se pudo crear la venta')
      }
    })
  }
}
