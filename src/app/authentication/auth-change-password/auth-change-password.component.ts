import { Component, OnInit, DebugElement } from '@angular/core';
import { ReturnStatement } from '@angular/compiler';
import { dataService } from 'src/app/service/data.service';
import { AlertService } from 'src/app/service/alert.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-change-password',
  templateUrl: './auth-change-password.component.html',
  styleUrls: ['./auth-change-password.component.scss']
})
export class AuthChangePasswordComponent implements OnInit {
  changePwd: any = {};
  passwordChangeForm:FormGroup;
  submitted = false;

  constructor(private formBuilder:FormBuilder, private alertService:AlertService, private dataService: dataService) { }

  ngOnInit() {
    this.passwordChangeForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(15)]],
      newpwd: ['', [Validators.required, Validators.minLength(15)]]
    });
  }
  changePassword() {
    if (this.changePwd.newPassword != this.changePwd.newpwd) {
      this.alertService.infoAlert("","New Password and Re-Type New Password not matching");
      return;
    }
    else {
      this.dataService.changePassword( localStorage.getItem("UserName"),this.changePwd).subscribe(
        data => {
          var res : any=data;
          this.alertService.successAlert("Success",res.message);
          this.changePwd={};
        },
        err => {
            this.alertService.errorAlert("Oops!","Password Change Failed");
        }
      )
    }

  }
  get f() { return this.passwordChangeForm.controls; }

  pwdChangeClick(event){
  }
}
