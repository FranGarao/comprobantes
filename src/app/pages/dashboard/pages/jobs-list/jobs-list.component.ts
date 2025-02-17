import { Component } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { Job } from '../../interfaces/Job';
import Swal from 'sweetalert2';
import { AlertsService } from '../../alerts.service';
@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrl: './jobs-list.component.css',
  standalone: false
})
export class JobsListComponent {
  public jobs: Job[] = [];
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
    this.getJobs();
  }

  getJobs() {
    this.isLoading = true;
    this.service.getGoogleSheets().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.jobs = res.data;
      },
      error: (err) => {
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

  editJob(job: Job) {
    this.service.setJob(job);
    this.service.openJob(1);
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
        this.deleteJob(id);
      }
    });
  }

  deleteJob(id: any) {
    this.alertService.loading('Eliminando trabajo', 'Por favor espere...');

    this.service.deleteJob(id).subscribe({
      next: (res: any) => {
        this.getJobs();
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
