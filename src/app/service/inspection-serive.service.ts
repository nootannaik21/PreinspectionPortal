import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InspectionSeriveService {
  uploadDocument(id, files) {
    return this.apiService.post("inspection/uploadDocument?inspectionId="+id,files);   
  }
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
    // return this.apiService.get("inspection/getActiveInspectionById?inspectionId="+inspectionId);   
     return this.apiService.get("inspection/getInspectionById?inspectionId="+inspectionId);
  }
  deleteInspection(inspectionId) {
    return this.apiService.delete("inspection/deleteInspection/"+inspectionId);   
  }
  
  getInspectionList() {
    return this.apiService.get('inspection/getAllInspections');   
  }

  constructor(private apiService:ApiService) { }
}
