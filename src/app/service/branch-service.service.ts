import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BranchServiceService {
  updateBranch(branchdata: any) {
    return this.apiService.put("branch/editBranch?id="+branchdata.id,branchdata);
  }
  addBranch(branchdata) {
    return this.apiService.post("branch/addBranch",branchdata);
  }
  getBranchById(branchId) {
    return this.apiService.get("branch/getActiveBranchById?id="+branchId);
  }
getBranchByListofId(branchId) {
    return this.apiService.get("branch/getActiveBranchById?"+branchId);
  }
  deleteBranch(id: any) {
    return this.apiService.delete("branch/deleteBranch?id="+id);
  }
  getBranches() {
    return this.apiService.get("branch/getAllActiveBranches");

  }
  getBranchForVendorByOrganization(vendorOrganization) {
    return this.apiService.get("branch/getBranchesForVendor?vendorOrganization="+vendorOrganization);
  }

  constructor(private apiService:ApiService) { }
}
