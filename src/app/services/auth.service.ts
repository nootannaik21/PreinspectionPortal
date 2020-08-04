import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = "Authentication/";
  logindetails: string = "";

 

  constructor(private apiService:ApiService) { }
  login(userData) {
    return this.apiService.singIn("user/login", userData);
  }
}
