import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class dataService {
  changePassword(emailId,changePwd) {
    return this.apiService.put("user/changePassword?email="+emailId+"&oldPassword="+changePwd.oldPassword+"&newPassword="+changePwd.newPassword,null);   
  }
  resetPassword(resetPwd: any) {
    return this.apiService.post("user/reset-password?email="+resetPwd.email,null);   
  }
  addUser(userdata: any) {
    return this.apiService.post("user/addUser", userdata);   
  }
  updateUser(userid) {
    return this.apiService.put("user/editUser?id="+userid,null);   
  }
  getUserById(userid) {
    return this.apiService.get("user/getUserById?userId="+userid);   
  }
 
  getUserList() {
    return this.apiService.get("user/getAllUser");   
  }
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
