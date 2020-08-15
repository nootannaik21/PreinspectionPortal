import { Component, OnInit } from '@angular/core';
import { dataService } from 'src/app/service/data.service';
import { AlertService } from 'src/app/service/alert.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss']
})
export class AuthResetPasswordComponent implements OnInit {
  resetPwd: any = {};
  resetForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private alertService: AlertService, private dataService: dataService, private router: Router) { }

  ngOnInit() {
    this.getCaptcha(5);
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      captcha: [],
      enteredCaptcha: [],
    });
  }
  getCaptcha(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      this.resetPwd.captcha = result;
    }
    return result;
  }
  onSubmit() {
    this.resetPassword();
  }
  resetPassword() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      this.resetPwd = {};
      return;
    }
    else {
      if (this.resetPwd.captcha != this.resetPwd.enteredCaptcha) {
        this.alertService.infoAlert("", "Entered text is not matching");
        this.resetPwd.enteredCaptcha=undefined;
        this.getCaptcha(5);
        return;
      }
      else{ 
      this.dataService.resetPassword(this.resetPwd).subscribe(
        data => {
          // this.alertService.successAlert("Success", "Password Reset Done");
          // this.router.navigateByUrl('users');


          //   var res :any =data;
          //   if(res.result=="success"){
          //   this.router.navigateByUrl("/login");
          // }
          // else{
          //   this.alertService.errorAlert("Oops!","Password Reset Failed");
          // }
        },
        err => {
          this.submitted = false;
          this.alertService.infoAlert("", "Entered Email does not exists");
          // this.router.navigateByUrl("/auth/reset-password");
        }
      )}
    }
  }
  get f() { return this.resetForm.controls; }

}
