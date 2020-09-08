import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../service/alert.service';
import { UserapiserviceService } from '../../service/userapiservice.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NotificationService } from '../../service/notification.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
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
  showBranchDetail: boolean;
  constructor(
    private notifyService: NotificationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private userapiService: UserapiserviceService
  ) {}

  ngOnInit() {
    this.userdata.type = '';
    this.userdata.branchName = '';
    this.addUserForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      company: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      branchName: ['', [Validators.required]],
      type: ['', [Validators.required]],
      branchCode: ['', [Validators.required]],
      status: ['', [Validators.required]],
      branches: [''],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$'
          ),
        ],
      ],
      confPassword: ['', [Validators.required]],
    });

    if (localStorage.getItem('userid')) {
      this.title = 'Update User';
      var temp: any = {};
      // this.addUserForm.get('email').reset();
      this.addUserForm.get('email').disable();
      this.addUserForm.get('password');
      this.addUserForm.get('confPassword');
      this.userapiService.getUserById(localStorage.getItem('userid')).subscribe(
        (data) => {
          var user: any = data;
          this.userdata = Object.assign(data);
          this.userdata.confPassword = this.userdata.password;
          this.userdata.status = this.userdata.isDeleted;
          if (this.userdata.type == 'Admin' || this.userdata.type == 'Claims') {
            this.showBranchDetail = false;
            this.showBranch = false;
            this.getAllBranches();
          }
          if (this.userdata.type == 'IMD' || this.userdata.type == 'Branch') {
            this.showBranch = false;
            this.showBranchDetail = true;
            this.getAllBranches();
          } else {
            this.showBranch = true;
            this.showBranchDetail = true;
            let tmp = [];
            if (user.branches != 0) {
              this.userapiService.getBranches().subscribe(
                (branches) => {
                  var res: any = branches;
                  this.branches = res.data;
                  for (let i = 0; i < user.branches[i]; i++) {
                    var branch = this.branches.filter(
                      (x) => x.id == user.branches[i]
                    );
                    if (branch.length > 0) {
                      var branchid: number = +branch[0].id;
                      tmp.push({
                        id: branchid,
                        branchCode: branch[0].branchCode,
                      });
                      this.selectedItems = tmp;
                    }
                  }
                  this.dropdownSettings = {
                    singleSelection: false,
                    idField: 'id',
                    textField: 'branchCode',
                    selectAllText: 'Select All',
                    unSelectAllText: 'UnSelect All',
                    // itemsShowLimit: 10,
                    allowSearchFilter: true,
                  };
                },
                (err) => {}
              );
            } else {
              this.getAllBranches();
            }
          }
        },
        (err) => {}
      );
    } else {
      this.getAllBranches();
      this.title = 'Add User';
      this.showBranch = true;
      this.selectedItems = [];
    }
  }

  get f() {
    return this.addUserForm.controls;
  }

  avoidSpecialchar(event) {
    var k;
    k = event.charCode; // k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }
  onBranchSelect() {
    var temp = this.branches.filter(
      (x) => x.branchName == this.userdata.branchName
    );
    this.userdata.branchCode = temp[0].branchCode;
  }
  onBranchCodeSelect() {
    var temp = this.branches.filter(
      (x) => x.branchCode == this.userdata.branchCode
    );
    this.userdata.branchName = temp[0].branchName;
  }
  onTypeSelect(eve) {
    if (eve.target.value == 'IMD' || eve.target.value == 'Branch') {
      this.showBranch = false;
      this.showBranchDetail = true;
      this.userdata.branchName = '';
      this.userdata.branchCode = '';
      this.userdata.branches = [];
    } else if (eve.target.value == 'Admin' || eve.target.value == 'Claims') {
      this.showBranch = false;
      this.showBranchDetail = false;
    } else {
      this.showBranch = true;
      this.showBranchDetail = true;
      this.userdata.branchCode = '';
      this.userdata.branches = [];
      this.userdata.branchName = '';
      this.getAllBranches();
    }
  }
  onStatusSelect(eve) {
    if (eve.target.value == 'true') this.userdata.status = true;
    else {
      this.userdata.status = false;
    }
  }
  getAllBranches() {
    this.userapiService.getBranches().subscribe(
      (data) => {
        var res: any = data;
        this.branches = res.data;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'id',
          textField: 'branchCode',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          allowSearchFilter: true,
        };
      },
      (err) => {}
    );
  }

  onItemSelect(item: any) {
    this.userdata.branches = [];
    if (this.selectedItems.length > 0) {
      this.selectedItems.forEach((element) => {
        this.userdata.branches.push(element.id);
      });
    }
  }
  onSelectAll(items: any) {
    this.branchCodes = [];
    this.userdata.branches = [];
    items.forEach((element) => {
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
    if (this.userdata.type == 'IMD' || this.userdata.type == 'Branch') {
      this.showBranch = false;
      this.showBranchDetail = true;
      this.userdata.branches = [];
      branches.setValidators(null);
      this.userdata.branches = [];
    } else if (
      this.userdata.type == 'Admin' ||
      this.userdata.type == 'Claims'
    ) {
      this.showBranch = false;
      this.showBranchDetail = false;
      this.userdata.branchName = '';
      this.userdata.branchCode = '';
      this.userdata.branches = [];
      branchName.setValidators(null);
      branchCode.setValidators(null);
      branches.setValidators(null);
    } else {
      this.showBranch = true;
      this.showBranchDetail = true;
      branchName.setValidators([Validators.required]);
      branchCode.setValidators([Validators.required]);
      this.userdata.branches = [];
      if (this.selectedItems.length > 0) {
        this.selectedItems.forEach((element) => {
          this.userdata.branches.push(element.id);
        });
      }
    }
    status.setValidators(null);
    branchName.updateValueAndValidity();
    branchCode.updateValueAndValidity();
    branches.updateValueAndValidity();
    status.updateValueAndValidity();
    this.addUserDetails(this.userdata);
  }
  addUserDetails(userdata) {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    } else if (this.userdata.password != this.userdata.confPassword) {
      this.alertService.infoAlert(
        '',
        'Password and Confirm Password are not matching'
      );
      return;
    } else {
      this.userapiService.addUser(userdata).subscribe(
        (data) => {
          var res: any = data;
          if (res.result == 'success') {
            this.notifyService.showSuccess(
              'User Added successfully !!',
              'Success'
            );
            this.router.navigateByUrl('users');
            this.userdata = {};
            this.selectedItems = [];
            this.submitted = false;
          }
        },
        (err) => {
          this.notifyService.showError(err.error.message, 'User Not Added');
          return;
        }
      );
    }
  }
  updateUser(data) {
    const branchName = this.addUserForm.get('branchName');
    const branchCode = this.addUserForm.get('branchCode');
    const branches = this.addUserForm.get('branches');

    if (this.userdata.type == 'Admin') {
      this.showBranch = false;
      this.userdata.branchName = '';
      this.userdata.branchCode = '';
      this.userdata.branches = [];
      branchName.setValidators(null);
      branchCode.setValidators(null);
      branches.setValidators(null);
    } else {
      this.showBranch = true;
      this.getAllBranches();
      branchName.setValidators([Validators.required]);
      branchCode.setValidators([Validators.required]);
      branches.setValidators([Validators.required]);
      this.userdata.branches = [];
      if (this.selectedItems.length > 0) {
        this.selectedItems.forEach((element) => {
          this.userdata.branches.push(element.id);
        });
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
    } else {
      this.userapiService.updateUser(data.id, data).subscribe(
        (data) => {
          var res: any = data;
          if (res.result.result == 'success') {
            this.notifyService.showSuccess(
              'User Updated successfully !!',
              'Success'
            );

            this.router.navigateByUrl('users');
            this.userdata = {};
            this.getAllBranches();
          } else {
            this.notifyService.showError(
              'Something is wrong',
              'User Not Updated'
            );
          }
        },
        (err) => {
          this.notifyService.showError(
            'Something is wrong',
            'User Not Updated'
          );

          return;
        }
      );
    }
  }
}
