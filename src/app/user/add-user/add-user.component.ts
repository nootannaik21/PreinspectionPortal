import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userdata: any = {};


  constructor(private router: Router, private dataService: dataService) { }

  ngOnInit() {
    debugger;
    if (localStorage.getItem('userid')) {
      this.dataService.getUserById(localStorage.getItem('userid')).subscribe(
        data => {
          debugger
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
    data = {
      id: 0,
      username: "u",
      password: "1231",
      email: "j1@gmail.com",
      firstName: "Jaya1",
      lastName: "sharma1",
      company: "abc1",
      phone: "9986958681",
      address: "abcaaa1",
      branchlist: "p,c,d",
      type: "testtype1",
      branchname: "testbranch1",
      branchcode: "testbranchcode1",
      vendorid: "2",
      status: "teststatus1",
      createdOn: "05-07-2020",
      ip_Address: "191.36.01",
      salt: "testabc1",
      isActive: true
    }
    debugger
    this.dataService.addUser(data).subscribe(
      data => {
        debugger;
        this.router.navigateByUrl('user');
      },
      err => {

      }
    )
  }
  updateUser(data) {
    debugger
    this.dataService.updateUser(data.id, data).subscribe(
      data => {
        debugger;
        this.router.navigateByUrl('user');
      },
      err => { }
    )
  }
}
