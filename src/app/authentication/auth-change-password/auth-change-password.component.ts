import { Component, OnInit } from '@angular/core';
import { ReturnStatement } from '@angular/compiler';
import { dataService } from 'src/app/service/data.service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-auth-change-password',
  templateUrl: './auth-change-password.component.html',
  styleUrls: ['./auth-change-password.component.scss']
})
export class AuthChangePasswordComponent implements OnInit {
  changePwd: any = {};
  constructor(private alertService:AlertService, private dataService: dataService) { }

  ngOnInit() {
  }
  changePassword(changePwd) {
    if (this.changePwd.newPassword != this.changePwd.newpwd) {
      this.alertService.infoAlert("","New Password and Re-Type New Password not matching");
      return;
    }
    else {
      this.dataService.changePassword(this.changePwd).subscribe(
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
}
