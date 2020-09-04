import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { PreinspectionService } from 'src/app/service/preinspection.service';
import { ApiService } from 'src/app/service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  disableSignIn: boolean;
  resetPanel:boolean=false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authservice: AuthService, private preInspection: PreinspectionService) {

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
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]]

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
      this.authservice.login(this.user).subscribe((data) => {
        var res: any = data;
        if (res.result == "success") {
          localStorage.setItem("UserName",this.user.email);
          this.preInspection.setInspnectioUser(res);
          
          let jwt = res.accessToken;
          let jwtData = jwt.split('.')[1];
          let decodedJwtJsonData = window.atob(jwtData);
          let decodedJwtData = JSON.parse(decodedJwtJsonData);
          localStorage.setItem('type', decodedJwtData.type);
localStorage.setItem('loggedInUser',decodedJwtData.Email);
          // this.router.navigateByUrl('users');
          
          // console.log(localStorage.getItem('permission'))

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
        this.disableSignIn = false;
        this.user = {};
      })
    }
  }
  get f() { return this.loginForm.controls; }
}
