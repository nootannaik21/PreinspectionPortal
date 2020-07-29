import { Injectable } from '@angular/core';
// import CryptoJS from 'crypto-js';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
const secret = "1371c65917a14400aab4816328a5358fc540e95e77aa469f975ab4eac61992fb574653386744491b8cad6cd1c42f00da";
@Injectable({
  providedIn: 'root'
})

export class userService {
  jwtHelper: JwtHelper = new JwtHelper();
  jcmsUserPermissions: any;
  constructor() { }
  setCurrentLoggedUser(data) {
    localStorage.setItem('currentJcmsUser', JSON.stringify(data));
  }
  removeCurrentUser() {
    localStorage.removeItem('currentJcmsUser');
  }
  getCurrentLoggedUser() {
    let data = localStorage.getItem('currentJcmsUser');
    if (data == null || data == undefined)
      return null;
    else
      return JSON.parse(data);
  }

  getUserPermissions() {
    let currentUser = localStorage.getItem('currentJcmsUser');
    if (currentUser) {
      var token = JSON.parse(currentUser);
      return this.jwtHelper.decodeToken(token.data);
    }
    else {
      return null;
    }
  }
}
