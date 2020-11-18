import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { userService } from './user.service';
// import { JcmsuserService } from './jcmsuser.service';
import { User } from '../model/user';
import { map } from 'rxjs/operators';
import { PreinspectionService } from './preinspection.service';
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
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpClient, private router: Router, private UserService: userService, private preInspectionService:PreinspectionService) {
    this.baseApiUrl = this.env.baseApiUrl
    this.SignInData = {};
    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();

  }
  public get userValue(): User {
    debugger;
    return this.userSubject.value;
}

  get(relativeUrl: string) {
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    return this.http.get<any>(url, { headers: this.getHeaderOptions(),withCredentials: true })
  //   .pipe(map(user => {
  //     debugger;
  //     this.userSubject.next(user);
  //     this.startRefreshTokenTimer();
  //     //return user;
  // }))
  ;

  }

  getString(relativeUrl: string) {
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    return this.http.get(url, { headers: this.getHeaderOptions(),responseType: 'text' });
  }


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
    return this.http.get(url, {headers: this.getHeaderOptionsforFileDownload(),responseType: 'blob'});
  }

  singIn(relativeUrl: string, resource: any) {
    debugger;
    return this.http.post<any>(this.baseApiUrl + relativeUrl, resource, {withCredentials: true})
    .pipe(map(user => {
      debugger;
      this.userSubject.next(user);
      this.startRefreshTokenTimer();
      return user;
  }));
  }
  //logout
  singInForFileUpload(relativeUrl: string, resource: any) {
    return this.http.post(relativeUrl, resource)
  }
  post(relativeUrl: string, resource: any) {
    this.isLoading = true;
    let url = this.baseApiUrl + relativeUrl;
    return this.http.post(this.baseApiUrl + relativeUrl, resource, { headers: this.getHeaderOptions() });
  }
  postUpload(relativeUrl: string, resource: any) {
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
  getHeaderOptionsforFileDownload() {
    this.Userdetails = this.UserService.getCurrentLoggedUser()
    if ((this.Userdetails == null)) {
      this.router.navigateByUrl("/login");
    }
    else {
      const authToken = this.Userdetails.accessToken;
      const headers = new HttpHeaders().set('Authorization', "bearer "+authToken);
      headers.set('Accept', 'application/octet-stream');
      return headers;
    }
  }
  refreshToken() {
    debugger;
    localStorage.removeItem("resetFlag");
    return this.http.post<any>(this.baseApiUrl + 'user/refresh-token',{},{withCredentials:true})
        .pipe(map((user) => {
          debugger;
         if(user)
         {
            this.userSubject.next(user);
            this.startRefreshTokenTimer();
            return user;
          }
          else
          {
            return alert("invalid token");
          }
        },err =>
        {
          debugger;
        return ;
        }));
}
private refreshTokenTimeout;

    private startRefreshTokenTimer() {
      debugger;
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.userValue.accessToken.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(
          () => 
        {
          debugger;
        this.refreshToken().subscribe()}, timeout);

        
    }
    
logout()
{
  this.preInspectionService.removeCurrentUser();
    this.router.navigateByUrl("/login");
    localStorage.clear();
    this.stopRefreshTokenTimer();
}

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}
