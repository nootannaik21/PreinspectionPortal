import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(private httpClient: HttpClient) { }
  postFile(fileToUpload: File, accessToken:string): Observable<boolean> {
    const endpoint = 'http://192.168.116.229/otcs/cs.exe/api/v2/nodes';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(endpoint, formData, { headers: this.getHeaderOptionsforFileDownload(accessToken) })
      .map(() => { return true; })
}
getHeaderOptionsforFileDownload(accessToken) {
    //const authToken = this.Userdetails.accessToken;
    const headers = new HttpHeaders().set('Authorization', "OTCSTicket "+accessToken);
    headers.set('Accept', 'application/octet-stream');
    return headers;
}
}
