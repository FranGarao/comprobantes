import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DashboardService } from '../../dashboard.service';
import Swal from 'sweetalert2';
import { Job } from '../../interfaces/Job';

@Component({
  selector: 'app-job-modal',
  templateUrl: './job-modal.component.html',
  styleUrl: './job-modal.component.css',
})
export class JobModalComponent {
  public jobsForm: FormGroup = new FormGroup({});
  private jobs: Job[] = [];
  constructor(
    public dialogRef: MatDialogRef<JobModalComponent>,
    private fb: FormBuilder,
    private service: DashboardService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getJobs();
    this.createForm();
  }

  getJobs() {
    this.service.getJobs().subscribe({
      next: (data) => {
        console.log({ data });
        this.jobs = data;
      },
      error: (error) => {
        console.log({ error });
      },
    });
  }

  createForm() {
    this.jobsForm = this.fb.group({
      id: [''],
      name: [''],
      //description: [''],
      price: [''],
      //status: ['']
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
  createJob() {
    const lastJob = this.jobs[this.jobs.length - 1];
    const job = {
      Id: lastJob.id + 1,
      //description: this.jobsForm.value.description,
      Name: this.jobsForm.value.name,
      Price: this.jobsForm.value.price,
      //status: this.jobsForm.value.status,
    };
    console.log({ job });

    this.service.createJob(job).subscribe({
      next: () => {
        this.dialogRef.close();
        Swal.fire('Trabajo creado', '', 'success');
        this.getJobs();
      },
      error: (error) => {
        console.log({ error });
        Swal.fire('Error', 'No se pudo crear el trabajo', 'error');
      },
    });
  }
}
