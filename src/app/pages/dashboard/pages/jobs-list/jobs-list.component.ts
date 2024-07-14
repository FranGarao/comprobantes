import { Component } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { Job } from '../../interfaces/Job';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrl: './jobs-list.component.css',
})
export class JobsListComponent {
  public jobs: Job[] = [];
  /**
   *
   */
  constructor(private service: DashboardService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getJobs();
  }

  getJobs() {
    this.service.getJobs().subscribe({
      next: (res: any) => {
        console.log({ jobs: res });
        this.jobs = res;
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

  deleteJob(id: number) {
    this.service.deleteJob(id).subscribe({
      next: (res: any) => {
        console.log({ res });
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
