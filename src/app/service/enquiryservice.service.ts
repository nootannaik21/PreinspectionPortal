import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EnquiryserviceService {
  getEnquiryList(enquiryData) {
    return this.apiService.post("enquiry/enquiryDetails",enquiryData);
  }

  constructor(private apiService:ApiService) { }
}
