import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
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
  constructor(public dialogRef: MatDialogRef<InvoicesModalComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, 
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
      job:['', Validators.required], 
      deliveryDate:['', Validators.required] 
    });
  }

  sendForm(){
  if (this.invoicesForm.invalid){
        Swal.fire({
          title: "Error",
          text: "Por favor complete los campos requeridos",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
        return;
      }
      Swal.fire({
        title: 'Formulario enviado',
        text: 'El formulario ha sido enviado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
      //TODO: manejar el envio del formulario al servicio
      console.log(this.invoicesForm.value);
  }


  submit(){
    Swal.fire({
      title: "Enviar formulario",
      text: "Estas segura de enviar el formulario?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar"
    })
    .then((result) =>{
      result.isConfirmed ? this.sendForm() : null;
    });
  }
  closeModal(): void {
    this.dialogRef.close();
  }
}
/*
 !cliente 
  id total sena saldo fechaEntrega + datosLocal
  !local
  id nombre telefono trabajo fechaEntrega total sena saldo 
*/