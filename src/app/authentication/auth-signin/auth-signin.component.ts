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

  constructor(private formBuilder: FormBuilder, private router: Router, private authservice: AuthService, private preInspection: PreinspectionService) {

  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
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
          this.router.navigateByUrl('users');
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
    this.authservice.login(this.user).subscribe((data) => {
      var res: any = data;
      if (res.result == "success") {
        this.preInspection.setInspnectioUser(res);
        this.router.navigateByUrl('users');
      }
      else {
        // this.router.navigateByUrl('errorpage');
      }
    }, err => {
      // this.router.navigateByUrl('errorpage');
      this.isError = true;
      this.user = {};
    })
  }
  get f() { return this.loginForm.controls; }
}
