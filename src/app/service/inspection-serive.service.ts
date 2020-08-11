import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InspectionSeriveService {
  getInspectionList() {
    return this.apiService.get('inspection/getAllActiveInspections');   
  }

  constructor(private apiService:ApiService) { }
}
