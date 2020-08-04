import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PreinspectionService } from 'src/app/services/preinspection.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  user: any = {};
  param: any = {};
  isError: boolean;
  submitLoader: boolean;


  constructor(private router: Router, private authservice: AuthService,private preInspection:PreinspectionService, private apiService:ApiService) { }

  ngOnInit() {
  }
  onSubmitLoader() {
    this.authservice.login(this.user).subscribe((data) => {
      var res: any = data;
      this.submitLoader = false;
      if (res.result == "success") {
        this.preInspection.setInspnectioUser(res);        
          this.router.navigateByUrl('user');
      }
      else {
        // this.router.navigateByUrl('errorpage');
      }
    }, err => {
      // this.router.navigateByUrl('errorpage');
      this.isError=true;
      this.user = {};
      this.submitLoader = false;
    })
  }
}
