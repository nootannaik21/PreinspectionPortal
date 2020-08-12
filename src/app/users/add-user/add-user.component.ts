import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { UserapiserviceService } from 'src/app/service/userapiservice.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userdata: any = {};
  branches: any = [];

  dropdownList: any = [];
  branch: any = [];
  selectedItems = [];
  dropdownSettings: any = [];
  branchCodes: any = [];

  constructor(private router: Router, private alertService: AlertService, private userapiService: UserapiserviceService) { }

  ngOnInit() {
    if (localStorage.getItem('userid')) {
      var temp: any = {};
      this.userapiService.getUserById(localStorage.getItem('userid')).subscribe(
        data => {
          var user: any = data;
          this.userdata = Object.assign(data);
          this.userdata.confPassword=this.userdata.password;
          let tmp = [];
          this.userapiService.getBranches().subscribe(
            branches => {
              var res: any = branches;
              this.branches = res.data;
              for (let i = 0; i < user.branchlist.split(',').length; i++) {
                var branch = this.branches.filter(x => x.id == user.branchlist.split(',')[i])
                var branchid: number = +branch[0].id;
                tmp.push({ id: branchid, branchCode: branch[0].branchCode });
                this.selectedItems = tmp;
              }
              this.dropdownSettings = {
                singleSelection: false,
                idField: 'id',
                textField: 'branchCode',
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                itemsShowLimit: 3,
              };
            },
            err => {
            }
          )
        },
        err => { }
      )
    }
    else {
      this.getAllBranches();
    }
    // else {
    //   this.userdata = {};
    // }

  }
  getAllBranches() {
    this.userapiService.getBranches().subscribe(
      data => {
        var res: any = data;
        this.branches = res.data;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'id',
          textField: 'branchCode',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
        };
      },
      err => {
      }
    )
  }

  onItemSelect(item: any) {
    this.branchCodes.push(item.id);
    // this.branchCodes.push(item.id);
    this.userdata.branchlist = this.branchCodes.map(String);
    // this.userdata.branchlist.push(this.selectedItems.id) 
  }
  onSelectAll(items: any) {
    items.forEach(element => {
      var temp: any = {};
      temp.branchlist = element.id
      this.branchCodes.push(temp);
    });
    this.userdata.branchlist = this.branchCodes.map(String);
  }
  reset() {
    this.userdata = {};
    this.selectedItems = [];
  }
  addUser(form) {
    if (this.userdata.password != this.userdata.confPassword) {
      this.alertService.infoAlert("", "Password and Confirm Password are not matching");
      return;
    }
    else {
      this.userapiService.addUser(form).subscribe(
        data => {
          var res: any = data;
          if (res.result == "success") {
            this.alertService.successAlert("Success", "User Added Successfully");
            this.router.navigateByUrl('users');
            this.userdata = {};
            this.selectedItems = [];
          }
          // else {
          //   this.alertService.errorAlert("Error", "User Not added");
          //   return;
          // }
        },
        err => {
          this.alertService.errorAlert("Error", "User Not added");
          this.selectedItems = [];
          this.userdata = {};
          return;
        }
      )
    }
  }
  updateUser(data) {
    if (this.userdata.password != this.userdata.confPassword) {
      this.alertService.infoAlert("", "Password and Confirm Password are not matching");
      return;
    }
    else {
    data.branchlist = [];
    this.selectedItems.forEach(element => {
      data.branchlist.push(element.id);
    });
    data.branchlist = data.branchlist.map(String);
    this.userapiService.updateUser(data.id, data).subscribe(
      data => {
        var res: any = data;
        if (res.result.result == "success") {
          this.alertService.successAlert("Success", "User Updated Successfully");
          this.router.navigateByUrl('users');
          this.userdata = {};
        }
        else {
          this.alertService.errorAlert("Error", "You have not updated anything");
        }
      },
      err => {
        this.alertService.errorAlert("Error", "User Update Failed");
        return;
      }
    )}
  }
}
