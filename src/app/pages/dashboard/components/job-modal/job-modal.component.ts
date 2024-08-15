import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import Swal from 'sweetalert2';
import { Job } from '../../interfaces/Job';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertsService } from '../../alerts.service';
@Component({
  selector: 'app-job-modal',
  templateUrl: './job-modal.component.html',
  styleUrl: './job-modal.component.css',
})
export class JobModalComponent {
  public jobsForm: FormGroup = new FormGroup({});
  public job: Job | null = null;
  private jobs: Job[] = [];
  constructor(
    public dialogRef: MatDialogRef<JobModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private fb: FormBuilder,
    private service: DashboardService,
    private alertService: AlertsService
  ) {}

  ngOnInit(): void {
    if (this.data?.id === 0) {
      this.job = null;
    } else this.job = this.service.job;
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class
    this.getJobs();
    this.createForm();
  }

  getJobs() {
    this.service.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
      },
      error: (error) => {
        console.log({ error });
      },
    });
  }

  /**
   * crea el formulario de trabajos
   * @return {void}
   */
  createForm() {
    this.jobsForm = this.fb.group({
      id: [this.job?.id || '', Validators.required],
      name: [this.job?.name || '', Validators.required],
      //description: [''],
      price: [this.job?.price || '', Validators.required],
      //status: ['']
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
  createJob() {
    const lastJob = this.jobs[this.jobs.length - 1];
    this.job = {
      id: lastJob.id + 1,
      //description: this.jobsForm.value.description,
      name: this.jobsForm.value.name,
      price: this.jobsForm.value.price,
      //status: this.jobsForm.value.status,
    };
    this.alertService.loading('Creando trabajo', 'Por favor espere...');
    this.service.createJob(this.job).subscribe({
      next: () => {
        Swal.fire('Trabajo creado', '', 'success');
        this.getJobs();
        this.dialogRef.close();
      },
      error: (error) => {
        console.log({ error });
        Swal.fire('Error', 'No se pudo crear el trabajo', 'error');
      },
    });
  }

  updateJob() {
    this.alertService.loading('Editando trabajo', 'Por favor espere...');

    const updatedJob = {
      Id: this.job?.id,
      Name: this.jobsForm.value.name,
      Price: this.jobsForm.value.price,
    };
    this.service.updateJob(updatedJob).subscribe({
      next: () => {
        this.dialogRef.close();
        Swal.fire('Trabajo actualizado', '', 'success');
        this.getJobs();
      },
      error: (error) => {
        console.log({ error });
        Swal.fire('Error', 'No se pudo actualizar el trabajo', 'error');
      },
    });
  }
}
