import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class dataService {
  constructor(private apiService: ApiService) { }
  getBranchList() {
    return this.apiService.get("branch");   
  }
  getBranchById(branchId) {
    return this.apiService.get('branch/getBranchById?Id='+branchId);   
  }
  updateBranch(branchId,branchData) {
    return this.apiService.put('branch/editBranch?id='+branchId,branchData);   
  }
  createBranch(branchData) {
    return this.apiService.post('branch/addBranch',branchData);   
  }
}
