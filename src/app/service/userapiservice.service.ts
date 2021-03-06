import { Injectable } from '@angular/core';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class UserapiserviceService {
  getbranchlistbyid(branchid) {
    return this.apiService.get("branch/getActiveBranchById?id="+branchid);   
  }
  updateUser(userid,data) {
    return this.apiService.put("user/editUser/"+userid,data);   
  }
  addUser(userdata) {
    return this.apiService.post("user/addUser", userdata);   
  }
  getUserById(userid) {
    return this.apiService.get("user/getUserById?userId="+userid);   
  }
  getBranches() {
    return this.apiService.get("branch/getAllActiveBranches");   
  }
  deleteUser(userId) {
    return this.apiService.delete("user/deleteUser/"+userId);   
  }
  getUserList() {
    return this.apiService.get("user/getAllUsersList");   
  }

  constructor(private apiService: ApiService) { }
}
