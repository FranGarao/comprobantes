import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/env';
const urlBack = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) { }

  public login(user: any) {
    const url = `${urlBack}/user/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(url, user, {
      headers,
      withCredentials: true, // Debe ir aquí, no como cabecera
    });
  }
}
