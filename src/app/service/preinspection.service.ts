import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreinspectionService {
 
	redirectUrl: any;
  constructor() { }
  setInspnectioUser(data) {
    localStorage.setItem('currentUser', JSON.stringify(data));
  }
  removeCurrentUser() {
    localStorage.removeItem('currentUser');
  }
}
