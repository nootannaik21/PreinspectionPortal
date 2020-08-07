import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataService } from 'src/app/service/data.service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userdata: any = {};


  constructor(private router: Router, private dataService: dataService, private alertService:AlertService) { }

  ngOnInit() {
    this.userdata={};
    if (localStorage.getItem('userid')) {
      this.dataService.getUserById(localStorage.getItem('userid')).subscribe(
        data => {
          this.userdata = Object.assign(data);
        },
        err => { }
      )
    }
    else {
      this.userdata = {};
    }
  }
  addUser(data) {
    debugger
    if(this.userdata.password!=this.userdata.confPassword){
      this.alertService.infoAlert("!","Password and Confirm Password are not matching");
      return;
    }
    else{
    this.dataService.addUser(data).subscribe(
      data => {
        debugger
        this.router.navigateByUrl('user');
      },
      err => {

      }
    )}
  }
  updateUser(data) {
    this.dataService.updateUser(data.id, data).subscribe(
      data => {
        debugger
        this.router.navigateByUrl('user');
      },
      err => { }
    )
  }
}
