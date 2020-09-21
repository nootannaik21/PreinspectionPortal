import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private apiService:ApiService) { }
  getReport(fromDate, toDate)
  {
    return this.apiService.get("inspection/getReport?fromDatee="+fromDate+"&toDatee="+toDate);
  }
}
