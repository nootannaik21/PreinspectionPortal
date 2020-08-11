import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VendorServiceService {
  deleteVendor(id) {
    return this.apiService.delete("vendor/deleteVendor?id="+id);
  }
  getVendors() {
    return this.apiService.get("vendor/getAllActiveVendors");
  }

  constructor(private apiService:ApiService) { }
}
