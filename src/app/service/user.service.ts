import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
// import CryptoJS from 'crypto-js';
// import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
const secret = "1371c65917a14400aab4816328a5358fc540e95e77aa469f975ab4eac61992fb574653386744491b8cad6cd1c42f00da";
@Injectable({
  providedIn: 'root'
})

export class userService {
  //   var JWTHelper = require('jwthelper');
  // var helper = JWTHelper.createJWTHelper([options]);


  // jwtHelper: JwtHelper = new JwtHelper();
  // jcmsUserPermissions: any;
  constructor() { }
  setCurrentLoggedUser(data) {
    debugger;
    localStorage.setItem('currentUser', JSON.stringify(data));
  }
  removeCurrentUser() {
    localStorage.removeItem('currentUser');
  }
  getCurrentLoggedUser() {
    let data = localStorage.getItem('currentUser');
    if (data == null || data == undefined)
      return null;
    else
      return JSON.parse(data);
  }
  getUserType() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      var token = JSON.parse(currentUser);
      const helper = new JwtHelperService();

      let data = helper.decodeToken(token.accessToken);
      return data.type ? data.type : null;
    }
    else {
      return null;
    }
  }
  getUserPermissions() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      var token = JSON.parse(currentUser);
      const helper = new JwtHelperService();

      return helper.decodeToken(token.accessToken);
      // const expirationDate = helper.getTokenExpirationDate(myRawToken);
      // const isExpired = helper.isTokenExpired(myRawToken);

      // return this.jwtHelper.decodeToken(token.data);
    }
    else {
      return null;
    }
  }
}
