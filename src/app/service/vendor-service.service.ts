import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VendorServiceService {
  updateVendorDetails(vendorid, vendordata) {
    return this.apiService.put("vendor/editVendor?id="+vendorid,vendordata);
  }
  getVendorById(vendorId) {
    return this.apiService.get("vendor/getVendorById?id="+vendorId);
  }
  getVendorByEmail(email) {
    return this.apiService.get("vendor/getVendorByEmail?email="+email);
  }
  addVendorDetails(vendordata) {
    return this.apiService.post("vendor/addVendor",vendordata);

  }
  getBranches() {
    return this.apiService.get("branch/getAllActiveBranches");
  }
  deleteVendor(id) {
    return this.apiService.delete("vendor/deleteVendor?id="+id);
  }
  getVendors() {
    return this.apiService.get("vendor/getAllActiveVendors");
  }
  getAllVendors() {
    return this.apiService.get("vendor/getAllVendors");
  }

  constructor(private apiService:ApiService) { }
}
