import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { PreinspectionService } from 'src/app/service/preinspection.service';
import { ApiService } from 'src/app/service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AlertService } from 'src/app/service/alert.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
})
export class AuthSigninComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  user: any = {};
  isError: boolean;
  disableSignIn: boolean = true;
  resetPanel: boolean = false;
  remember: boolean = false;
  resetPwd: any = {};
  loginAttemptCounter: boolean=false;
  timeLeft: number = 1800;
  interval;
  timer: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private preInspection: PreinspectionService,
    private cookieService: CookieService,
    private apiService: ApiService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) {
    if (sessionStorage.getItem('remember') != undefined) {
      if (sessionStorage.getItem('remember') == 'Yes') {
        this.user.email = sessionStorage.getItem('email');
        this.user.password = sessionStorage.getItem('password');
      }
    }
    if (this.apiService.userValue) {
      this.router.navigateByUrl('/login');
    }
  }
  ngOnInit() {
    this.getCaptcha(5);
    if (localStorage.getItem('resetFlag') == 'true') {
      this.resetPanel = true;
      setTimeout(() => {
        if (this.resetPanel == true) {
          ('#hideresetPanel');
          this.resetPanel = false;
        }
      }, 20000);
    } else {
      this.resetPanel = false;
      localStorage.removeItem('resetFlag');
    }
    if (this.user.email != '' && this.user.password != '') {
      this.disableSignIn = false;
      this.remember = true;
    }
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required]],
      remember: [''],
      captcha: [''],
      enteredCaptcha: ['', [Validators.required]],
    });
  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.getLogin();
    }
  }
  onSubmit() {
    this.getLogin();
  }
  getCaptcha(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      this.resetPwd.captcha = result;
    }
    return result;
  }
  getLogin() {
    this.pauseTimer();
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.user = {};
      this.resetPwd.enteredCaptcha = undefined;
      this.getCaptcha(5);
      // this.loginAttemptCounter = this.loginAttemptCounter + 1;
      // if (this.loginAttemptCounter >= 3) {
      //   this.pauseTimer();
      //   this.startTimer();
      // }
    } else {
      if (this.resetPwd.captcha != this.resetPwd.enteredCaptcha) {
        this.alertService.infoAlert('', 'Entered Captcha is not matching');
        this.resetPwd.enteredCaptcha = undefined;
        this.getCaptcha(5);
        return;
      }
      // } else if (this.loginAttemptCounter >= 3) {
      //   this.pauseTimer();
      //   this.startTimer();
      // } 
      else {
        this.authservice.login(this.user).subscribe(
          (data) => {
            var res: any = data;
            if (res.result == 'success') {
              localStorage.setItem('UserName', this.user.email);
              this.preInspection.setInspnectioUser(res);

              let jwt = res.accessToken;
              let jwtData = jwt.split('.')[1];
              let decodedJwtJsonData = window.atob(jwtData);
              let decodedJwtData = JSON.parse(decodedJwtJsonData);
              localStorage.setItem('type', decodedJwtData.type);
              localStorage.setItem(
                'loggedInUser',
                decodedJwtData.firstName + ' ' + decodedJwtData.lastName
              );
              localStorage.setItem('userLoginId', decodedJwtData.email);
              localStorage.setItem('expiry', decodedJwtData.expires);
              decodedJwtData.type == 'Branch' || decodedJwtData.type == 'IMD'
                ? localStorage.setItem('branch', decodedJwtData.branchCode)
                : '';
              decodedJwtData.type == 'IMD'
                ? localStorage.setItem('imdCode', decodedJwtData.imdCode)
                : '';
              // this.router.navigateByUrl('users');

              if (localStorage.getItem('type') == 'Admin') {
                this.router.navigateByUrl('users');
              } else if (localStorage.getItem('type') == 'OPS') {
                this.router.navigateByUrl('inspection');
              } else if (localStorage.getItem('type') == 'IMD') {
                this.router.navigateByUrl('inspection');
              } else if (localStorage.getItem('type') == 'Branch') {
                this.router.navigateByUrl('inspection');
              } else if (localStorage.getItem('type') == 'Vendor') {
                this.router.navigateByUrl('inspection');
              } else if (localStorage.getItem('type') == 'Claims') {
                this.router.navigateByUrl('inspection');
              }
              this.disableSignIn = true;
            } else {
            }
          },
          (err) => {
            //this.loginAttemptCounter = this.loginAttemptCounter + 1;
            this.isError = true;
            this.resetPwd.enteredCaptcha = undefined;
            this.getCaptcha(5);
            setTimeout(() => {
              if (this.isError == true) {
                ('#hideDiv');
                this.isError = false;
                this.submitted = false;
              }
            }, 5000);
            this.disableSignIn = true;
            this.user = {};
            if (err.error.message == "Block user") {
              this.loginAttemptCounter = true;
              this.startTimer();
            }
          else if (err.error.message == "User blocked") {
              this.loginAttemptCounter = true;
             let tempTIme = this.datePipe.transform(err.error.blockTime, 'hh:mm:ss');
             let units = tempTIme.split(":"); //will break the string up into an array
             let hours = parseInt(units[0]); //first element
             let minutes = parseInt(units[1]); //first element
             let seconds = parseInt(units[2]); //second element
             let duration = 3600 * hours+ 60 * minutes + seconds; //add up our values
             let currentDate = new Date;
             let tempTIme1 = this.datePipe.transform(currentDate, 'hh:mm:ss');
             let units1 = tempTIme1.split(":"); //will break the string up into an array
             let hours1 = parseInt(units1[0]); //first element
             let minutes1 = parseInt(units1[1]); //first element
             let seconds1 = parseInt(units1[2]); //second element
             let duration1 = 3600 * hours1+ 60 * minutes1 + seconds1; //add up our values
              this.timeLeft = duration-duration1;
              this.startTimer();
            }
            else
            {
              this.loginAttemptCounter = false;
              setTimeout(() => {
                if (this.isError == true) {
                  ('#hideDiv');
                  this.isError = false;
                  this.submitted = false;
                }
              }, 5000);
            }
          }
        );
      }
    }
    
  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        // var minutes = Math.floor(this.timeLeft / 60000);
        // var seconds = ((this.timeLeft % 60000) / 1000).toFixed(0);
        // this.timer =
        // //   parseInt(seconds) == 60
        // //     ? minutes + 1 + ':00'
        // //     : minutes + ':' + (parseInt(seconds) < 10 ? '0' : '') + seconds;
        // // alert(this.timer);
        // this.timeLeft--;
        // var minutes = Math.floor(this.timeLeft / 60000);
        // var seconds = ((this.timeLeft % 60000) / 1000).toFixed(0);
        this.timer =
          Math.floor(this.timeLeft / 60) + ' : ' + (this.timeLeft % 60);
      } 
      else
      {
        this.loginAttemptCounter = false;
      }
      
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  onTextChange() {
    if (
      this.user.email != '' &&
      this.user.email != undefined &&
      this.user.password != '' &&
      this.user.password != undefined
    ) {
      this.disableSignIn = false;
    } else {
      this.disableSignIn = true;
    }
  }
  get f() {
    return this.loginForm.controls;
  }
}
