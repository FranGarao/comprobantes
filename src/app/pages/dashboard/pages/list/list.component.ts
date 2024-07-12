import { Component } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  /**
   *
   */
  constructor(private service: DashboardService) {}

  ngOnInit() {
    this.getInvoices();
    // this.getJobs();
  }

  getInvoices() {
    this.service.getInvoices().subscribe({
      next: (data) => {
        console.log({ data });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getJobs() {
    this.service.getJobs().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
