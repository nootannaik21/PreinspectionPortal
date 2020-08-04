import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseApiUrl: string = "";
  isLoading: boolean;
  IsLoggedIn: boolean = false;
  SignInData: any;
  Userdetails: any;
  lastAction: any;
  env = environment;

  constructor(private http: HttpClient) {
    // this.baseApiUrl = this.env.baseApiUrl;
    this.baseApiUrl = "https://dev-api.preinspection-portal.forthedemo.com/api/";
   }
  singIn(relativeUrl: string, resource: any) {
    return this.http.post(this.baseApiUrl + relativeUrl, resource)
  }
}
