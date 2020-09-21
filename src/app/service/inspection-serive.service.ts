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
  uploadDocument(id,status, files) {
    return this.apiService.postUpload("inspection/uploadDocument?inspectionId="+id+"&status="+status,files);   
  }
  deleteDocument(file,inspectionId) {
    return this.apiService.delete("inspection/deleteDocument?file="+file+"&inspectionId="+inspectionId);   
  }
  downloadDocument(file) {
    return this.apiService.getFile("inspection/deleteDocument?filename="+file);   
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
  IsDuplicateInspection(RegNo){
    return this.apiService.get('inspection/getDuplicateInspectonByRegNo?RegNo='+RegNo)
  }
getVendorEmailByBranchCode(branchCode){
  return this.apiService.get('vendor/getActiveVendorByBranchCode?branchCode='+ branchCode);
}
addRiskType(riskTypeData) {
  return this.apiService.post("inspection/addRiskType",riskTypeData);   
}
getRiskTypeById(id){
  return this.apiService.get('inspection/getRiskTypeById?id='+ id);
}
updateRiskType(riskTypeData) {
  debugger;
  return this.apiService.put("inspection/editRiskType?id="+riskTypeData.id,riskTypeData);   
}
deleteRiskType(id: any) {
  return this.apiService.delete("inspection/deleteRiskType?id="+id);
}

addProductType(productTypeData) {
  return this.apiService.post("inspection/addProductType",productTypeData);   
}
getProductTypeById(id){
  return this.apiService.get('inspection/getProductTypeById?id='+ id);
}
updateProductType(productTypeData) {
  debugger;
  return this.apiService.put("inspection/editProductType?productTypeId="+productTypeData.id,productTypeData);   
}
deleteProductType(id: any) {
  return this.apiService.delete("inspection/deletePrductType?id="+id);
}
  constructor(private apiService:ApiService) { }
}
