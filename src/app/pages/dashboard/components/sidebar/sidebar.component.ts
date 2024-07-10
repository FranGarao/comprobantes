import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvoicesModalComponent } from '../invoices-modal/invoices-modal.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  /**
   *
   */
  constructor(private dialogRef : MatDialog) {}

  openInvoice(){
    this.dialogRef.open(InvoicesModalComponent, {
      data: {
        formulario: "Esto es un formulario de prueba"
      },
      width: '500px',
      height: '600px',
    })
  }
}
