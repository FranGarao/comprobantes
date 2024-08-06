import { Component } from '@angular/core';
import { Customer } from '../../interfaces/Customer';
import { DashboardService } from '../../dashboard.service';
import Swal from 'sweetalert2';
import { AlertsService } from '../../alerts.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css',
})
export class CustomersListComponent {
  public customers: any[] = [];
  public isLoading: boolean = false;

  constructor(
    private service: DashboardService,
    private alertService: AlertsService
  ) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {
    this.isLoading = true;
    this.service.getCustomers().subscribe({
      next: (res: any[]) => {
        this.isLoading = false;
        this.customers = res;
        console.log({ res });
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

  editCustomer(customer: any) {
    this.service.setCustomer(customer);
    this.service.openCustomer(1);
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
    this.alertService.loading('Eliminando cliente', 'Por favor espere...');

    this.service.deleteCustomer(id).subscribe({
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
