import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InvoicesListComponent } from './pages/dashboard/pages/invoices-list/invoices-list.component';
import { JobsListComponent } from './pages/dashboard/pages/jobs-list/jobs-list.component';
import { CustomersListComponent } from './pages/dashboard/pages/customers-list/customers-list.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'list/invoices',
        component: InvoicesListComponent,
      },
      {
        path: 'list/jobs',
        component: JobsListComponent,
      },
      {
        path: 'list/customers',
        component: CustomersListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
