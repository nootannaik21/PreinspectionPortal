import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { BranchServiceService } from 'src/app/service/branch-service.service';

@Component({
  selector: 'app-addbranch',
  templateUrl: './addbranch.component.html',
  styleUrls: ['./addbranch.component.scss']
})
export class AddbranchComponent implements OnInit {
  branchdata: any = {};

  constructor(private router: Router, private alertService: AlertService, private branchService: BranchServiceService) { }

  ngOnInit() {
    if (localStorage.getItem('branchid')) {
      this.branchService.getBranchById(localStorage.getItem('branchid')).subscribe(
        data => {
          this.branchdata = data[0];
        },
        err => { })
    }
  }
  addBranch(branchdata) {
    this.branchService.addBranch(branchdata).subscribe(
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
      err => { }
    )
  }
  updateBranch(branchdata) {
    this.branchService.updateBranch(branchdata).subscribe(
      data => {
        var res: any = data;
        if (res.result.result == "success") {
          this.alertService.successAlert("Success", "Branch Updated Successfully");
          this.router.navigateByUrl('branch');
          this.branchdata={};
        }
        else {
          this.alertService.errorAlert("Oops!", "You have not updated Branch");
          this.branchdata={};
        }
      },
      err => { 
        this.alertService.errorAlert("Oops!", "Branch Update Failed");
      }
    )
  }

}
