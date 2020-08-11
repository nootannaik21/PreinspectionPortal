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
    debugger;
    this.userapiService.getBranches().subscribe(
      data => {
        debugger
        var res: any = data;
        this.branches = res.data;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'id',
          textField: 'branchCode',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          // allowSearchFilter: true
        };
      },
      err => {
      }
    )


    if (localStorage.getItem('userid')) {
      debugger
      this.userapiService.getUserById(localStorage.getItem('userid')).subscribe(
        data => {
          var res: any = data;
          let tmp = [];
          this.userdata = Object.assign(data);
          for (let i = 0; i < res.branchlist.split(',').length; i++) {
            this.userapiService.getbranchlistbyid(res.branchlist.split(',')[i]).subscribe(
              data => {
                tmp.push({ id: res.branchlist.split(',')[i], branchCode: data[i].branchCode });
                debugger
                // this.branches = tmp;
                  this.selectedItems = [
                    { id: res.branchlist.split(',')[i], branchCode: data[i].branchCode },
                  ];
                  console.log(this.selectedItems);
              },
              err => { }
            )
          }
          debugger;
          this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'branchCode',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            // allowSearchFilter: true
          };
        },
        err => { }
      )
    }
    else {
      this.userdata = {};
    }
    console.log(this.branches);

  }

  onItemSelect(item: any) {
    debugger;
    console.log(item);
    this.branchCodes.push(item.id);
    // this.branchCodes.push(item.id);
    this.userdata.branchlist = this.branchCodes.map(String);
  }
  onSelectAll(items: any) {
    debugger
    console.log(items);
    items.forEach(element => {
      var temp: any = {};
      temp.branchlist = element.id
      this.branchCodes.push(temp);
    });
    debugger
    this.userdata.branchlist = this.branchCodes.map(String);
  }
  addUser(data) {
    debugger
    this.userdata = {};
    if (this.userdata.password != this.userdata.confPassword) {
      this.alertService.infoAlert("!", "Password and Confirm Password are not matching");
      return;
    }
    else {
      this.userapiService.addUser(data).subscribe(
        data => {
          debugger
          var res: any = data;
          if (res.result == "success") {
            this.alertService.successAlert("Success", "User Added Successfully");
            this.router.navigateByUrl('users');
            this.userdata = {};
          }
          else {
            this.alertService.errorAlert("Error", "User Not added");
            this.branches = [];
            return;
          }
        },
        err => {
          this.alertService.errorAlert("Error", "User Not added");
          return;
        }
      )
    }
  }
  updateUser(data) {
    debugger;
    this.userapiService.updateUser(data.id, data).subscribe(
      data => {
        debugger;
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
    )
  }
  cancelUser() {
    this.userdata = {};
  }

}
