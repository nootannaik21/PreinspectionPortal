import { Component, OnInit } from '@angular/core';
import { dataService } from 'src/app/service/data.service';
import { AlertService } from 'src/app/service/alert.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss']
})
export class AuthResetPasswordComponent implements OnInit {
  resetPwd:any= {};
  constructor(private alertService: AlertService,private dataService:dataService,private router:Router) { }

  ngOnInit() {
  }
  resetPassword(resetPwd) {
    this.dataService.resetPassword(resetPwd).subscribe(
      data => {
        var res :any =data;
        if(res.result=="success"){
        this.alertService.successAlert("Success","New Password has sent to your Email");
        this.router.navigateByUrl("/login");
      }
      else{
        this.alertService.errorAlert("Oops!","Password Reset Failed");
      }
      },
      err => {

      }
    )

  }

}
