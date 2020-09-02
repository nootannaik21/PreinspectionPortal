import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { BranchServiceService } from 'src/app/service/branch-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-addbranch',
  templateUrl: './addbranch.component.html',
  styleUrls: ['./addbranch.component.scss']
})
export class AddbranchComponent implements OnInit {
  branchdata: any = {};
  addBranchForm: FormGroup;
  submitted = false;
  title: string;
 message:string;
 branchNamemessage:string;
  constructor(private formBuilder: FormBuilder, private router: Router, private alertService: AlertService, private branchService: BranchServiceService) { }

  ngOnInit() {
    this.addBranchForm = this.formBuilder.group({
      branchCode: ['', [Validators.required]],
      // zone: ['', [Validators.required]],
      branchName: ['', [Validators.required]],
    });
    if (localStorage.getItem('branchid')) {
      this.title = "Update Branch";
      this.branchService.getBranchById(localStorage.getItem('branchid')).subscribe(
        data => {
          this.branchdata = data[0];
        },
        err => { })
    }
    else {
      this.title = "Add Branch";
      this.branchdata = {};
    }
  }
  get f() { return this.addBranchForm.controls; }
  addBranch() {
    this.submitted = true;
    if (this.addBranchForm.invalid) {
      return;
    } else {
      this.branchService.addBranch(this.branchdata).subscribe(
        data => {
          var res: any = data;
          if (res.result.result == "success") {
            this.alertService.successAlert("Success", "Branch Added Successfully");
            this.router.navigateByUrl('branch');
          }
          else {
            this.alertService.errorAlert("Oops!", "Branch Add Failed");
          }
        },
        err => { 
//           debugger;
//           if(err.error.message.includes("Branch code")){
//             this.message = err.error.message;
//           }
//           else
//           {
// this.branchNamemessage = err.error.message;
//           }
this.alertService.errorAlert("Oops!", err.error.message);
        }
      )
    }
  }
  updateBranch(branchdata) {
    this.submitted = true;
    if (this.addBranchForm.invalid) {
      return;
    } else {
      this.branchService.updateBranch(branchdata).subscribe(
        data => {
          var res: any = data;
          if (res.result.result == "success") {
            this.alertService.successAlert("Success", "Branch Updated Successfully");
            this.router.navigateByUrl('branch');
            this.branchdata = {};
          }
          else {
            this.alertService.errorAlert("Oops!", "You have not updated Branch");
            this.branchdata = {};
          }
        },
        err => {
          this.alertService.errorAlert("Oops!", err.error.message);
        }
      )
    }
  }
  cancel() {
    localStorage.removeItem('branchid');
    this.router.navigateByUrl('branch');

  }
}
