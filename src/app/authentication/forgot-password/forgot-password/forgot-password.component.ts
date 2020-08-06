import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/service/alert.service';
import { dataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPwd: any = {};
  constructor(private alertService: AlertService, private dataService: dataService) { }

  ngOnInit(): void {
    this.getCaptcha(5);

  }
  getCaptcha(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      this.forgotPwd.captcha = result;
    }
    return result;
  }
  resetPassword(forgotPwd) {
    if (this.forgotPwd.userId == undefined) {
      this.alertService.infoAlert("", "Please Enter Email");
      return;
    }
    else if (this.forgotPwd.newPassword == undefined) {
      this.alertService.infoAlert("", "Please Enter New Password");
      return;
    }
    if (this.forgotPwd.captcha != this.forgotPwd.enteredCaptcha) {
      this.alertService.infoAlert("", "Entered text is not matching");
      this.getCaptcha(5);
      return;
    }
    else {
      this.dataService.changePassword(forgotPwd).subscribe(
        data => {
          var res:any=data;
          if(res.result=="success"){
            this.alertService.successAlert("Success","Password Changed Successfully");
            this.forgotPwd={};
            this.getCaptcha(5);
          }
          else{
            this.alertService.errorAlert("Error","Password Not Changed");
            return;
          }
        },
        err => {

        }
      )

    }

  }
}
