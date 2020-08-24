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
  showBranch: boolean;
  title: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private alertService: AlertService, private userapiService: UserapiserviceService) { }

  ngOnInit() {
    debugger
    this.addUserForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      company: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      branchName: ['', [Validators.required]],
      type: ['', [Validators.required]],
      branchCode: ['', [Validators.required]],
      status: ['', [Validators.required]],
      // branches: ['', [Validators.required]],
      selectedItems: ['',],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(15)]],
      confPassword: ['', [Validators.required, Validators.minLength(15)]]

    });
    if (localStorage.getItem('userid')) {
      this.title = "Update User";
      var temp: any = {};
    debugger
      // this.addUserForm.get('email').reset();
      this.addUserForm.get('email').disable();
      this.addUserForm.get('password').disable();
      this.addUserForm.get('confPassword').disable();
      this.userapiService.getUserById(localStorage.getItem('userid')).subscribe(
        data => {
          debugger
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
            if(user.branches!=0){
            this.userapiService.getBranches().subscribe(
              branches => {
                debugger
                var res: any = branches;
                this.branches = res.data;
                for (let i = 0; i < user.branches.split(',').length; i++) {
                  var branch = this.branches.filter(x => x.id == user.branches.split(',')[i])
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
            )}
            else{
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
      this.selectedItems=[];
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
  onTypeSelect(eve) {
    debugger
    if (eve.target.value == "Admin") {
      this.showBranch = false;
      this.userdata.branchName = "";
      this.userdata.branchCode = "";
      this.userdata.branches = [];
    }
    else {
      this.showBranch = true;
      this.userdata.branchName = "";
      this.userdata.branchCode = "";
      this.userdata.branches = [];
      this.getAllBranches();
    }
  }
  onStatusSelect(eve) {
    debugger
      this.userdata.status=eve.target.value
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
    debugger
    this.userdata.branches=[];
    if(this.selectedItems.length>0){
      this.selectedItems.forEach(element => {
        this.userdata.branches.push(element.id);
      })
    }   
    // this.branchCodes=[];
    // if(this.userdata.branches.length>0){
    // this.userdata.branches.push(item.id);
    // }
    // else { 

    // this.branchCodes.push(item.id);
    // this.userdata.branches=this.branchCodes;

  // }
  }
  onSelectAll(items: any) {
    debugger
    this.branchCodes=[];
    this.userdata.branches=[];
    items.forEach(element => {
      // var temp: any = {};
      // temp.branchlist = element.id
      this.branchCodes.push(element.id);
      // this.userdata.branchlist = this.branchCodes;
    });
    this.userdata.branches = this.branchCodes;
  }
  reset() {
    this.userdata = {};
    this.selectedItems = [];
    this.router.navigateByUrl('users');
  }
  onSubmit() {
    debugger
    this.submitted = true;
    if (this.userdata.type == "Admin") {
      this.submitted = false;
      this.addUserDetails(this.userdata);

    } else {
      if (this.addUserForm.invalid) {
        return;
      }
      else {
        if (this.userdata.password != this.userdata.confPassword) {
          this.alertService.infoAlert("", "Password and Confirm Password are not matching");
          return;
        }
        else{
        this.addUserDetails(this.userdata);}

      }
    }}
    addUserDetails(userdata) {
      this.userapiService.addUser(userdata).subscribe(
        data => {
          debugger
          var res: any = data;
          if (res.result == "success") {
            this.alertService.successAlert("Success", "User Added Successfully");
            this.router.navigateByUrl('users');
            this.userdata = {};
            this.selectedItems = [];
            this.submitted = false;
          }

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
    updateUser(data) {
      debugger
      this.submitted = true;
      this.showBranch = true;
      this.userdata.branches=[];
      if(this.selectedItems.length>0){
        this.selectedItems.forEach(element => {
          this.userdata.branches.push(element.id);
        })
      }      
      if (this.userdata.type == "Admin") {
        this.submitted = false;
        this.showBranch = false
        this.updateUserDetails(data);
      }
      else {
        if (this.addUserForm.invalid) {
          return;
        }
        else
        this.updateUserDetails(data);
      }
    }
    updateUserDetails(data) {
      this.userapiService.updateUser(data.id, data).subscribe(
        data => {
          debugger
          var res: any = data;
          if (res.result.result == "success") {
            this.alertService.successAlert("Success", "User Updated Successfully");
            this.router.navigateByUrl('users');
            this.userdata = {};
            this.getAllBranches();
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
      // data.branches = [];
      // this.selectedItems.forEach(element => {
      //   data.branches.push(element.id);
      // });
    }
  }
