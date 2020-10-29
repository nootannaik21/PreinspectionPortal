import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { PreinspectionService } from 'src/app/service/preinspection.service';
import { ApiService } from 'src/app/service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  user: any = {};
  isError: boolean;
  disableSignIn: boolean = true;
  resetPanel:boolean=false;
  remember: boolean=false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authservice: AuthService, private preInspection: PreinspectionService, private cookieService:CookieService) {
debugger;
    if(cookieService.get("remember") != undefined){
  if (cookieService.get("remember") == "Yes") {
    this.user.email = cookieService.get("email");
    this.user.password = cookieService.get("password");
  }
}
  }
  ngOnInit() {
    if(localStorage.getItem("resetFlag")=="true"){
      this.resetPanel=true;
      setTimeout(() => {
        if (this.resetPanel == true) {
          ("#hideresetPanel");
          this.resetPanel = false;
        }
      }, 20000);
    }
    else{
      this.resetPanel=false;
      localStorage.removeItem("resetFlag");
    }
    debugger;
    if (this.user.email != "" && this.user.password != "") {
      this.disableSignIn = false;
      this.remember = true;
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]],
      remember: ['']
    });
    
  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.getLogin();
    }
  }
  onSubmit() {
   this.getLogin();
  }
  getLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.user={};
      return;
    }
    else{
      debugger;
      this.authservice.login(this.user).subscribe((data) => {
        var res: any = data;
        if (res.result == "success") {
if (this.remember) {
  this.cookieService.set("remember","Yes");
  this.cookieService.set("email",this.user.email);
  this.cookieService.set("password",this.user.password);
} else {
  this.cookieService.set("remember","Yes");
  this.cookieService.set("email","");
  this.cookieService.set("password","");
}

          localStorage.setItem("UserName",this.user.email);
          this.preInspection.setInspnectioUser(res);
          
          let jwt = res.accessToken;
          let jwtData = jwt.split('.')[1];
          let decodedJwtJsonData = window.atob(jwtData);
          let decodedJwtData = JSON.parse(decodedJwtJsonData);
          localStorage.setItem('type', decodedJwtData.type);
localStorage.setItem('loggedInUser',decodedJwtData.firstName + " " +decodedJwtData.lastName);
decodedJwtData.type == "Branch" ||decodedJwtData.type == "IMD" ?localStorage.setItem('branch',decodedJwtData.branchCode):'';
decodedJwtData.type == "IMD" ?localStorage.setItem('imdCode',decodedJwtData.imdCode):'';         
// this.router.navigateByUrl('users');

          if(localStorage.getItem('type')=="Admin")
          {
          this.router.navigateByUrl('users');
          }         
          else if(localStorage.getItem('type')=="OPS")
          {
            this.router.navigateByUrl('inspection');
          }
          else if(localStorage.getItem('type')=="IMD")
          {
            this.router.navigateByUrl('inspection');
          }
          else if(localStorage.getItem('type')=="Branch")
          {
            this.router.navigateByUrl('inspection');
          }
          else if(localStorage.getItem('type')=="Vendor")
          {
            this.router.navigateByUrl('inspection');
          }
          else if(localStorage.getItem('type')=="Claims")
          {
            this.router.navigateByUrl('inspection');
          }
          this.disableSignIn = true;
        }
        else {
        }
      }, err => {
        this.isError = true;
        setTimeout(() => {
          if (this.isError == true) {
            ("#hideDiv");
            this.isError = false;
            this.submitted = false;

          }
        }, 5000);
        this.disableSignIn = true;
        this.user = {};
      })
    }
  }
onTextChange()
{
  if ((this.user.email !="" && this.user.email!= undefined) && (this.user.password != "" && this.user.password != undefined)) {
    this.disableSignIn = false;
  } else {
    this.disableSignIn = true;
  }
}
  get f() { return this.loginForm.controls; }
}
