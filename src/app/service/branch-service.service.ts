import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BranchServiceService {
  deleteBranch(id: any) {
    return this.apiService.delete("branch/deleteBranch?id="+id);
  }
  getBranches() {
    return this.apiService.get("branch/getAllActiveBranches");

  }

  constructor(private apiService:ApiService) { }
}
