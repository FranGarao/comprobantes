import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor() { }

  loading(title: string, message: string) {
    Swal.fire({
      title,
      text: message,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  error(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
    });
  }
  success(title: string, message: string) {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
    });
  }
}
