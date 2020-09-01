import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dataService } from 'src/app/service/data.service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  changePasswordForm:FormGroup;
  changePwd:any={};
  submitted = false;


  constructor(private formBuilder: FormBuilder, private router: Router,private alertService:AlertService,private dataService: dataService) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      // newPassword: ['', [Validators.required, Validators.minLength(15)]],
      newPassword: [null, [Validators.required,Validators.minLength(15),Validators.pattern('(?![0-9]|.*[0-9]$)(?=.*[a-zA-Z0-9])(?=.*\d)(?=.*[_!?@#$%]).{8}$')]],

      newpwd: ['', [Validators.required, Validators.minLength(15)]]}
    )
}
changePassword() {
  debugger
  this.submitted = true;
  if (this.changePasswordForm.invalid) {
    return;
  } else {
  if (this.changePwd.newPassword != this.changePwd.newpwd) {
    this.alertService.infoAlert("","New Password and Re-Type New Password not matching");
    return;
  }
  else {
    this.dataService.changePassword( localStorage.getItem("UserName"),this.changePwd).subscribe(
      data => {
        debugger
        var res : any=data;
        this.alertService.successAlert("Success",res.message);
        this.changePwd={};
        this.submitted=false;
      },
      err => {
          this.alertService.errorAlert("Oops!","Password Change Failed");
      }
    )
  }
  }
}
get f() { return this.changePasswordForm.controls; }

}
