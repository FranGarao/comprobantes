import { Component } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  /**
   *
   */
  constructor(private service: DashboardService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  openInvoice() {
    this.service.openInvoice();
  }

  openJob() {
    this.service.openJob();
  }

  openCustomer(){
    this.service.openCustomer();
  }
}
