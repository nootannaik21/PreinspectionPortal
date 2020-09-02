import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { UserapiserviceService } from 'src/app/service/userapiservice.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userdata: any = {};
  branches: any = [];
  submitted = false;
  dropdownList: any = [];
  branch: any = [];
  selectedItems = [];
  dropdownSettings: any = [];
  branchCodes: any = [];

  addUserForm: FormGroup;
  showBranch: boolean;
  title: string;

  constructor(private notifyService: NotificationService, private formBuilder: FormBuilder, private router: Router, private alertService: AlertService, private userapiService: UserapiserviceService) { }

  ngOnInit() {
    this.userdata.type = "";
    this.userdata.branchName = "";
    this.addUserForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      company: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      branchName: ['', [Validators.required]],
      type: ['', [Validators.required]],
      branchCode: ['', [Validators.required]],
      status: ['', [Validators.required]],
      branches: ['', [Validators.required]],
      // selectedItems: ['',],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^[a-zA-Z][a-zA-Z0-9!@#$]{6,}[a-zA-Z](?=.*[@#$%^&+=]).*$')]],

      confPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^[a-zA-Z][a-zA-Z0-9!@#$]{6,}[a-zA-Z](?=.*[@#$%^&+=]).*$')]]

    });
    if (localStorage.getItem('userid')) {
      this.title = "Update User";
      var temp: any = {};
      // this.addUserForm.get('email').reset();
      this.addUserForm.get('email').disable();
      this.addUserForm.get('password');
      this.addUserForm.get('confPassword');
      this.userapiService.getUserById(localStorage.getItem('userid')).subscribe(
        data => {
          var user: any = data;
          this.userdata = Object.assign(data);
          this.userdata.confPassword = this.userdata.password;
          this.userdata.status = this.userdata.isDeleted;
          if (this.userdata.type == "Admin") {
            this.showBranch = false;
          }
          else {
            this.showBranch = true;
            let tmp = [];
            if (user.branches != 0) {
              this.userapiService.getBranches().subscribe(
                branches => {
                  var res: any = branches;
                  this.branches = res.data;
                  // for (let i = 0; i < user.branches.split(',').length; i++) {
                    for (let i = 0; i < user.branches[i]; i++) {
                    // var branch = this.branches.filter(x => x.id == user.branches.split(',')[i])
                    var branch = this.branches.filter(x => x.id == user.branches[i])
                    if (branch.length > 0) {
                      var branchid: number = +branch[0].id;
                      tmp.push({ id: branchid, branchCode: branch[0].branchCode });
                      this.selectedItems = tmp;
                    }
                  }
                  this.dropdownSettings = {
                    singleSelection: false,
                    idField: 'id',
                    textField: 'branchCode',
                    selectAllText: 'Select All',
                    unSelectAllText: 'UnSelect All',
                    itemsShowLimit: 10,
                    allowSearchFilter: true
                  };
                },
                err => {
                }
              )
            }
            else {
              this.getAllBranches();
            }
          }

        },
        err => { }
      )
    }
    else {
      this.getAllBranches();
      this.title = "Add User";
      this.showBranch = true;
      this.selectedItems = [];
    }
    // else {
    //   this.userdata = {};
    // }

  }

  get f() { return this.addUserForm.controls; }

  avoidSpecialchar(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  onBranchSelect() {
    var temp = this.branches.filter(x => x.branchName == this.userdata.branchName)
    this.userdata.branchCode = temp[0].branchCode;
  }
  onBranchCodeSelect() {
    var temp = this.branches.filter(x => x.branchCode  == this.userdata.branchCode)
    this.userdata.branchName = temp[0].branchName;
  }
  onTypeSelect(eve) {
    if (eve.target.value == "Admin") {
      this.showBranch = false;
      this.userdata.branchName = "";
      this.userdata.branchCode = "";
      this.userdata.branches = [];
    }
    else {
      this.showBranch = true;
      this.userdata.branchCode = "";
      this.userdata.branches = [];
      this.userdata.branchName = "";
      this.getAllBranches();
    }
  }
  onStatusSelect(eve) {
    if(eve.target.value=="true")
    this.userdata.status = true;
    else{
    this.userdata.status = false;
    }
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
          itemsShowLimit: 10,
          allowSearchFilter: true
        };
      },
      err => {
      }
    )
  }

  onItemSelect(item: any) {
    this.userdata.branches = [];
    if (this.selectedItems.length > 0) {
      this.selectedItems.forEach(element => {
        this.userdata.branches.push(element.id);
      })
    }
  }
  onSelectAll(items: any) {
    this.branchCodes = [];
    this.userdata.branches = [];
    items.forEach(element => {
      this.branchCodes.push(element.id);
    });
    this.userdata.branches = this.branchCodes;
  }
  reset() {
    this.userdata = {};
    this.selectedItems = [];
    this.router.navigateByUrl('users');
  }
  onSubmit() {
    this.submitted = true;
    const branchName = this.addUserForm.get('branchName');
    const branchCode = this.addUserForm.get('branchCode');
    const branches = this.addUserForm.get('branches');
    const status = this.addUserForm.get('status');
    if (this.userdata.type == "Admin") {
      this.showBranch = false;
      this.userdata.branchName = "";
      this.userdata.branchCode = "";
      this.userdata.branches = [];
      branchName.setValidators(null);
      branchCode.setValidators(null);
      branches.setValidators(null);
    }
    else {
      this.showBranch = true;
      // this.getAllBranches();
      branchName.setValidators([Validators.required]);
      branchCode.setValidators([Validators.required]);
      branches.setValidators([Validators.required]);
      this.userdata.branches = [];
      if (this.selectedItems.length > 0) {
        this.selectedItems.forEach(element => {
          this.userdata.branches.push(element.id);
        })
      }

    }
    status.setValidators(null);
    branchName.updateValueAndValidity();
    branchCode.updateValueAndValidity();
    branches.updateValueAndValidity();
    status.updateValueAndValidity();
    this.addUserDetails(this.userdata);


    // if (this.userdata.type == "Admin") {
    //   this.submitted = false;
    //   this.addUserDetails(this.userdata);

    // } else {
    //   if (this.addUserForm.invalid) {
    //     return;
    //   }
    //   else {
    //     if (this.userdata.password != this.userdata.confPassword) {
    //       this.alertService.infoAlert("", "Password and Confirm Password are not matching");
    //       return;
    //     }
    //     else {
    //       this.addUserDetails(this.userdata);
    //     }

    //   }
    // }
  }
  addUserDetails(userdata) {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    else if (this.userdata.password != this.userdata.confPassword) {
      this.alertService.infoAlert("", "Password and Confirm Password are not matching");
      return;
    }
    else {
      this.userapiService.addUser(userdata).subscribe(
        data => {
          var res: any = data;
          if (res.result == "success") {
            this.notifyService.showSuccess("User Added successfully !!", "Success");
            // this.alertService.successAlert("Success", "User Added Successfully");
            this.router.navigateByUrl('users');
            this.userdata = {};
            this.selectedItems = [];
            this.submitted = false;
          }

        },
        err => {
          // this.alertService.errorAlert("Error", "User Not added");
          this.notifyService.showError("Something is wrong", "User Not Added");

          this.selectedItems = [];
          this.userdata = {};
          this.submitted = false;
          return;
        }
      )
    }
  }
  updateUser(data) {
    const branchName = this.addUserForm.get('branchName');
    const branchCode = this.addUserForm.get('branchCode');
    const branches = this.addUserForm.get('branches');

    if (this.userdata.type == "Admin") {
      this.showBranch = false;
      this.userdata.branchName = "";
      this.userdata.branchCode = "";
      this.userdata.branches = [];
      branchName.setValidators(null);
      branchCode.setValidators(null);
      branches.setValidators(null);
    }
    else {
      this.showBranch = true;
      this.getAllBranches();
      branchName.setValidators([Validators.required]);
      branchCode.setValidators([Validators.required]);
      branches.setValidators([Validators.required]);
      this.userdata.branches = [];
      if (this.selectedItems.length > 0) {
        this.selectedItems.forEach(element => {
          this.userdata.branches.push(element.id);
        })
      }

    }
    branchName.updateValueAndValidity();
    branchCode.updateValueAndValidity();
    branches.updateValueAndValidity();
    this.updateUserDetails(data);

  }
  updateUserDetails(data) {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    else {
      this.userapiService.updateUser(data.id, data).subscribe(
        data => {
          var res: any = data;
          if (res.result.result == "success") {
            // this.alertService.successAlert("Success", "User Updated Successfully");
            this.notifyService.showSuccess("User Updated successfully !!", "Success");

            this.router.navigateByUrl('users');
            this.userdata = {};
            this.getAllBranches();
          }
          else {
            // this.alertService.errorAlert("Error", "You have not updated anything");
            this.notifyService.showError("Something is wrong", "User Not Updated");

          }
        },
        err => {
          // this.alertService.errorAlert("Error", "User Update Failed");
          this.notifyService.showError("Something is wrong", "User Not Updated");

          return;
        }
      )
    }
    // data.branches = [];
    // this.selectedItems.forEach(element => {
    //   data.branches.push(element.id);
    // });
  }
}
