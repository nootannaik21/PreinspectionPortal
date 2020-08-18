import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InspectionSeriveService {
  getInspectionHistoryById(inspectionId) {
    return this.apiService.get("inspection/getInspectionHistoryByInspectionId?inspectionId="+inspectionId);   
  }
  addInspection(inspectionData) {
    return this.apiService.post("inspection/addInspection",inspectionData);   
  }
  updateInspection(inspectionId,inspectionData) {
    return this.apiService.put("inspection/editInspection/"+inspectionId,inspectionData);   
  }
  getBranches() {
    return this.apiService.get("branch/getAllActiveBranches");   
  }
  getInspectionById(inspectionId) {
    return this.apiService.get("inspection/getActiveInspectionById?inspectionId="+inspectionId);   
  }
  deleteInspection(inspectionId) {
    return this.apiService.delete("inspection/deleteInspection/"+inspectionId);   
  }
  
  getInspectionList() {
    return this.apiService.get('inspection/getAllActiveInspections');   
  }

  constructor(private apiService:ApiService) { }
}
