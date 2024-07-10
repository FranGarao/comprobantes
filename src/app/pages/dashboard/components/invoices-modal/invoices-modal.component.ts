import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoices-modal',
  templateUrl: './invoices-modal.component.html',
  styleUrl: './invoices-modal.component.css'
})
export class InvoicesModalComponent implements OnInit {
  public firstName: string = '';
  public invoicesForm: FormGroup = new FormGroup({});
  /**
   *
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private fb: FormBuilder) {
    this.firstName = data.formulario;  
  }

  ngOnInit(): void {
    this.invoicesForm = this.fb.group({
      id: ['', Validators.required],
      total: ['', Validators.required], 
      deposit: ['', Validators.required],
      balance:['', Validators.required], 
      name:['', Validators.required], 
      phone:['', Validators.required], 
      job:[''], 
      deliveryDate:['', Validators.required] 
    });
  }

  submit(){
    console.log(this.invoicesForm.value);
  }
}

/*
 !cliente 
  id total sena saldo fechaEntrega + datosLocal
  !local
  id nombre telefono trabajo fechaEntrega total sena saldo 
*/