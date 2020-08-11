import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { PreinspectionService } from 'src/app/service/preinspection.service';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  user : any= {};
  isError: boolean;

  constructor(private router:Router, private authservice: AuthService, private preInspection: PreinspectionService) { }

  ngOnInit() {
  }
  onSubmit() {
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
      this.isError=true;
      this.user = {};
    })
  }
}
