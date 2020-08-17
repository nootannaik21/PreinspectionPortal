import { Injectable } from '@angular/core';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
  successAlert(title, message) {
    Swal.fire(title, message, 'success');
  }

  warningAlert(title, message) {
    Swal.fire(title, message, 'warning');
  }

  errorAlert(title, message) {
    Swal.fire(title, message, 'error');
  }

  infoAlert(title, message) {
    Swal.fire(title, message, 'info');
  }

  confirmAlert(successCallBack, cancelCallBack?) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to revert!',
      // type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        successCallBack && successCallBack();
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        cancelCallBack && cancelCallBack();
      }
    });
  }

  // confirmAction(title,successCallBack, cancelCallBack?) {
  //   Swal.fire({
  //     title: title,
  //     type: 'warning',
  //     showCloseButton: true,
  //     showCancelButton: true
  //   }).then((result) => {
  //     if (result.value) {
  //       successCallBack && successCallBack();
  //     }
  //     else if (result.dismiss === Swal.DismissReason.cancel) {
  //       cancelCallBack && cancelCallBack();
  //     }
  //   });
  // }
}

