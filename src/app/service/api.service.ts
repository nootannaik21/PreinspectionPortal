import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { userService } from './user.service';
// import { JcmsuserService } from './jcmsuser.service';
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
  constructor(private http: HttpClient, private router: Router, private UserService: userService) {
    this.baseApiUrl = this.env.baseApiUrl
    this.SignInData = {};

  }

  get(relativeUrl: string) {
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    return this.http.get(url, { headers: this.getHeaderOptions() });

  }

  getString(relativeUrl: string) {
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    return this.http.get(url, { headers: this.getHeaderOptions(),responseType: 'text' });
  }



//   'Accept': 'text/html, application/xhtml+xml, */*',
//   'Content-Type': 'application/x-www-form-urlencoded'
// }),
// responseType: 'text'

  getgrid(relativeUrl: string, param: HttpParams) {
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    return this.http.get(url, { params: param });
  }

  downloadReport(relativeUrl, resource): Observable<any> {
    return this.http.post(this.baseApiUrl + relativeUrl, resource, {
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }
  getFIleUsingPost(relative)
  {
    let url = this.baseApiUrl + relative;
    return this.http.post(url,null, {headers: this.getHeaderOptions(),responseType: 'blob'});
  }
  getFile(relative)
  {
    let url = this.baseApiUrl + relative;
    return this.http.get(url, {headers: this.getHeaderOptions(),responseType: 'blob'});
  }

  singIn(relativeUrl: string, resource: any) {
    return this.http.post(this.baseApiUrl + relativeUrl, resource)
  }
  post(relativeUrl: string, resource: any) {
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    return this.http.post(this.baseApiUrl + relativeUrl, resource, { headers: this.getHeaderOptions() });
  }
  postUpload(relativeUrl: string, resource: any) {
    debugger;
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    return this.http.post(this.baseApiUrl + relativeUrl, resource, { headers: this.getHeaderOptionsforFileUpload() });
  }
  delete(relativeUrl: string) {
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    return this.http.delete(url, { headers: this.getHeaderOptions() });
  }

  deleteBodyData(relativeUrl: string, data: any) {
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    // return this.http.delete(url,data, { headers: this.getHeaderOptions() });
    return this.http.request('delete', url, { body:data,headers:this.getHeaderOptions()});
  }

  upload(relativeUrl, data: FormData) {
    this.isLoading = true;
    return this.http.post(this.baseApiUrl + relativeUrl, data, { headers: this.getHeaderOptions() });
  }

  put(relativeUrl: string, resource) {
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    return this.http.put(url, resource, { headers: this.getHeaderOptions()})
  }

  getHeaderOptions() {
    this.Userdetails = this.UserService.getCurrentLoggedUser()
    if ((this.Userdetails == null)) {
      this.router.navigateByUrl("/login");
    }
    else {
      const authToken = this.Userdetails.accessToken;
      const headers = new HttpHeaders().set('Authorization', "bearer "+authToken);
      return headers;
    }
  }
  getHeaderOptionsforFileUpload() {
    this.Userdetails = this.UserService.getCurrentLoggedUser()
    if ((this.Userdetails == null)) {
      this.router.navigateByUrl("/login");
    }
    else {
      const authToken = this.Userdetails.accessToken;
      const headers = new HttpHeaders().set('Authorization', "bearer "+authToken);
      headers.set('Content-Type', 'multipart/form-data')
      headers.set('Accept', 'application/json');
      return headers;
    }
  }
}
