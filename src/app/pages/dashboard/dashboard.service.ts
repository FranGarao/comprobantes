import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from './interfaces/Invoice';
import { environment } from '../../../environments/env.example';
const urlBack = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http : HttpClient) { }
  //Postea el formulario al backend
  sendForm(form: Invoice){
    const url = `${environment.API_URL}/invoices`;
    return this.http.post(url, form);
  }
  test(){
      const url = `${environment.API_URL}/test`;
      return this.http.get("https://localhost:7031/api/invoices");
  }
}
