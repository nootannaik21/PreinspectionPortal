import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InspectionSeriveService {
  getAllconvayances() {
    return this.apiService.get("inspection/getAllConvayance");
  }
  getAllInspectionsReason() {
    return this.apiService.get("inspection/getAllInspectionReason");
  }
  getAllProductType() {
    return this.apiService.get("inspection/getAllProductType");
  }
  getAllRiskType() {
    return this.apiService.get("inspection/getAllRiskType");   
  }
  getAllPaymentMode() {
    return this.apiService.get("inspection/getAllPaymentMode");   
  }
  getAllInspectionStatus() {
    return this.apiService.get("inspection/getAllInspectionStatus");   
  }
  getVendorMailList(branchCode) {
    return this.apiService.get("vendor/getActiveVendorByBranchCode?branchCode="+branchCode);   
  }
  uploadDocument(id, files) {
    debugger
    return this.apiService.postUpload("inspection/uploadDocument?inspectionId="+id, files);   
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
getVendorEmailByBranchCode(branchCode){
  return this.apiService.get('vendor/getActiveVendorByBranchCode?branchCode='+ branchCode);
}
  constructor(private apiService:ApiService) { }
}
