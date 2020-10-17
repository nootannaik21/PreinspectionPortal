import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dataService } from 'src/app/service/data.service';
import { AlertService } from 'src/app/service/alert.service';
import { NotificationService } from 'src/app/service/notification.service';


@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  changePasswordForm:FormGroup;
  changePwd:any={};
  submitted = false;


  constructor(private notifyService:NotificationService, private formBuilder: FormBuilder, private router: Router,private alertService:AlertService,private dataService: dataService) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      // newPassword: ['', [Validators.required, Validators.minLength(15)]],
      newPassword: ['', [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$')]],
      // newPassword: [null, [Validators.required,Validators.minLength(8),Validators.pattern('^[a-zA-Z][a-zA-Z0-9!@#$]{6}[a-zA-Z]$')]],
      newpwd: ['', [Validators.required]]}
    )
}
changePassword() {
  this.submitted = true;
  if (this.changePasswordForm.invalid) {
    return;
  } else {
  if (this.changePwd.newPassword != this.changePwd.newpwd) {
    this.alertService.infoAlert("","New Password and Confirm New Password not matching");
    return;
  }
  else {
    this.dataService.changePassword( localStorage.getItem("UserName"),this.changePwd).subscribe(
      data => {
        var res : any=data;
        this.notifyService.showSuccess("Password changed successfully !!", "Success");
        this.router.navigateByUrl("auth");
        this.changePwd={};
        this.submitted=false;
      },
      err => {
        if (err.error.message != null) {
        this.notifyService.showError(err.error.message, "");
        } else {
          
        }
      }
    )
  }
  }
}
get f() { return this.changePasswordForm.controls; }

}
