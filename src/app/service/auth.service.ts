import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor( private apiService: ApiService) { }
  login(userData) {
    return this.apiService.singIn("user/login", userData);
  }
  loginForFileUpload(data) {
    return this.apiService.singInForFileUpload("http://192.168.116.229/otcs/cs.exe/api/v1/auth", data);
  }
}
