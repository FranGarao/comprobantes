import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './pages/dashboard/components/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { InvoicesModalComponent } from './pages/dashboard/components/invoices-modal/invoices-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { provideHttpClient } from '@angular/common/http';
import { JobModalComponent } from './pages/dashboard/components/job-modal/job-modal.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CdkMenuModule } from '@angular/cdk/menu';
import { InvoicesListComponent } from './pages/dashboard/pages/invoices-list/invoices-list.component';
import { JobsListComponent } from './pages/dashboard/pages/jobs-list/jobs-list.component'; // Import CdkMenuModule
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomerModalComponent } from './pages/dashboard/components/customer-modal/customer-modal.component';
import { CustomersListComponent } from './pages/dashboard/pages/customers-list/customers-list.component';
import { NewInvoiceComponent } from './pages/dashboard/pages/new-invoice/new-invoice.component';
import { FormsModule } from '@angular/forms';
import { ProductsListComponent } from './pages/dashboard/pages/products-list/products-list.component';
import { ProductModalComponent } from './pages/dashboard/components/product-modal/product-modal.component';
import { SalesComponent } from './pages/dashboard/pages/sales/sales.component'; // Importa FormsModule


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    LoginComponent,
    NotFoundComponent,
    InvoicesModalComponent,
    JobModalComponent,
    InvoicesListComponent,
    JobsListComponent,
    CustomerModalComponent,
    CustomersListComponent,
    NewInvoiceComponent,
    ProductsListComponent,
    ProductModalComponent,
    SalesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatListModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
    CdkMenuModule,
    BrowserModule,
    FormsModule, // Asegúrate de incluirlo aquí
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [provideAnimationsAsync(), provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'whatsapp',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/wsp.svg')
    );
  }
}
