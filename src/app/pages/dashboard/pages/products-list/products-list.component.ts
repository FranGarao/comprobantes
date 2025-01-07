import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { DashboardService } from '../../dashboard.service';
import { AlertsService } from '../../alerts.service';
import { Product } from '../../interfaces/Product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {
  //todo: crear interfaz product
  public products: Product[] = []

  public isLoading: boolean = false;
  /**
   *
   */
  constructor(
    private service: DashboardService,
    private alertService: AlertsService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getProducts();
  }

  getProducts() {
    this.isLoading = true;
    this.service.getProducts().subscribe({
      next: (res: any) => {
        console.log(res);

        this.isLoading = false;
        this.products = res;
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Error de conexion',
          text:
            err?.error?.message ||
            'Ocurrio un error al intentar obtener los trabajos',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  editProduct(product: Product) {
    this.service.setProduct(product);
    this.service.openProduct(1);
  }

  questionDelete(id: any) {
    Swal.fire({
      title: 'Eliminar trabajo',
      text: '¿Estas seguro que deseas eliminar el trabajo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((res) => {
      if (res.isConfirmed) {
        this.deleteProduct(id);
      }
    });
  }

  deleteProduct(id: any) {
    this.alertService.loading('Eliminando trabajo', 'Por favor espere...');

    this.service.deleteProduct(id).subscribe({
      next: (res: any) => {
        this.getProducts();
        Swal.fire({
          title: 'Trabajo eliminado',
          text: 'El trabajo fue eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Error de conexion',
          text:
            err?.error?.message ||
            'Ocurrio un error al intentar eliminar el trabajo',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }
}
