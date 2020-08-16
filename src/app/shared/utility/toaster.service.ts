import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ToasterService {
  options: any;
  constructor(private toastr: ToastrService) {
    this.options = {
      showCloseButton: true,
      enableHTML: true,
    };
  }
 
  success(message: string, title?: string): void {
    this.toastr.success(message);
  }
  info(message: string, title?: string): void {
    this.toastr.info(message);
  }
  warning(message: string, title?: string): void {
    this.toastr.warning(message);
  }
  error(message: string, title?: string): void {
    this.toastr.error(message);
  }
}
