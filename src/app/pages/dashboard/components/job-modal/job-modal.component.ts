import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-job-modal',
  templateUrl: './job-modal.component.html',
  styleUrl: './job-modal.component.css'
})
export class JobModalComponent {
  public jobsForm: FormGroup = new FormGroup({});
  constructor(public dialogRef: MatDialogRef<JobModalComponent>, 
  private fb: FormBuilder) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createForm();
  }

  createForm(){
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
}
