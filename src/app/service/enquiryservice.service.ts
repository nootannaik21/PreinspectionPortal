import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EnquiryserviceService {
  getEnquiryList(enquiryData) {
    return this.apiService.get("branch/getActiveBranchById?id="+enquiryData);
  }

  constructor(private apiService:ApiService) { }
}
