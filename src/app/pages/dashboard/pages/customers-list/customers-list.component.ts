import { Component } from '@angular/core';
import { Customer } from '../../interfaces/Customer';
import { DashboardService } from '../../dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css',
})
export class CustomersListComponent {
  public customers: Customer[] = [];
  public isLoading: boolean = false;

  constructor(private service: DashboardService) {}

  ngOnInit(): void {
    this.getCustomers();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  getCustomers() {
    this.isLoading = true;
    this.service.getCustomers().subscribe({
      next: (res: Customer[]) => {
        this.isLoading = false;
        this.customers = res;
      },
      error: (err) => {
        Swal.fire({
          title: 'Error de conexion',
          text:
            err?.error?.message ||
            'Ocurrio un error al intentar obtener los clientes',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  editCustomer(customer: Customer) {
    // this.service.setJob(customer);
    // this.service.openJob(1);
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
        this.deleteCustomer(id);
      }
    });
  }

  deleteCustomer(id: any) {
    this.service.deleteJob(id).subscribe({
      next: (res: any) => {
        this.getCustomers();
        Swal.fire({
          title: 'Trabajo eliminado',
          text: 'El trabajo fue eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
      },
      error: (err) => {
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
