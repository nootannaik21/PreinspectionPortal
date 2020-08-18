import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { UserapiserviceService } from 'src/app/service/userapiservice.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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

  constructor(private formBuilder: FormBuilder, private router: Router, private alertService: AlertService, private userapiService: UserapiserviceService) { }

  ngOnInit() {
    this.userdata.type = -1;
    this.addUserForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      company: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      vendorid: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      type: ['',],
      selectedItems: ['',],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confPassword: ['', [Validators.required, Validators.minLength(6)]]

    });
    if (localStorage.getItem('userid')) {
      var temp: any = {};
      this.userapiService.getUserById(localStorage.getItem('userid')).subscribe(
        data => {
          var user: any = data;
          this.userdata = Object.assign(data);
          this.userdata.confPassword = this.userdata.password;
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
  get f() { return this.addUserForm.controls; }

  avoidSpecialchar(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
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
    this.userdata.branchlist = this.branchCodes.map(String);
  }
  onSelectAll(items: any) {
    items.forEach(element => {
      // var temp: any = {};
      // temp.branchlist = element.id
      this.branchCodes.push(element.id);
      // this.userdata.branchlist = this.branchCodes.map(String);
    });
    this.userdata.branchlist = this.branchCodes.map(String);
  }
  reset() {
    this.userdata = {};
    this.selectedItems = [];
    this.router.navigateByUrl('users');
  }
  onSubmit() {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    } else {
      if (this.userdata.password != this.userdata.confPassword) {
        this.alertService.infoAlert("", "Password and Confirm Password are not matching");
        return;
      }
      if (this.userdata.type == -1) {
        this.alertService.infoAlert("", "Please Select User Type");
        return;
      }
      if (this.userdata.branchlist.length == 0) {
        this.alertService.infoAlert("", "Please Select Branches");
        return;
      }
      else {
        this.userapiService.addUser(this.userdata).subscribe(
          data => {
            var res: any = data;
            if (res.result == "success") {
              this.alertService.successAlert("Success", "User Added Successfully");
              this.router.navigateByUrl('users');
              this.userdata = {};
              this.selectedItems = [];
              this.submitted = false;
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
            this.submitted = false;
            return;
          }
        )
      }
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
      )
    }
  }
}
