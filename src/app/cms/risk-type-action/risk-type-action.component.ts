import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { InspectionSeriveService } from 'src/app/service/inspection-serive.service';

@Component({
  selector: 'app-risk-type-action',
  templateUrl: './risk-type-action.component.html',
  styleUrls: ['./risk-type-action.component.scss']
})
export class RiskTypeActionComponent implements OnInit {
  title: string;
  riskTypeData:any={};
  addEditRiskTypeForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder,private inspectionServce:InspectionSeriveService,private alertService:AlertService,private router:Router) { }

  ngOnInit(): void {
    this.addEditRiskTypeForm = this.formBuilder.group({
      type: ['', [Validators.required, Validators.pattern('^([a-zA-Z0-9]).*$')]]
    });
    if (localStorage.getItem('risktypeid')) {
      this.title = "Update Risk Type";
      this.inspectionServce.getRiskTypeById(localStorage.getItem('risktypeid')).subscribe(
        data => {
          var res:any=JSON.stringify(data);
        this.riskTypeData=JSON.parse(res);
        },
        err => { });
    }
    else {
    this.title = "Add Risk Type";
    this.riskTypeData = {};    
  }
  }
  get f() { return this.addEditRiskTypeForm.controls; }
  onSubmit(){
    this.submitted = true;
    if (this.addEditRiskTypeForm.invalid) {
      return;
    } else {
      this.inspectionServce.addRiskType(this.riskTypeData).subscribe(
        data => {
          var res: any = data;
          if (res.result.result == "success") {
            this.alertService.successAlert("Success", "Risk Type Added Successfully");
            this.router.navigateByUrl('cms/risktype');
          }
          else {
            this.alertService.errorAlert("Oops!", "Risk Type Add Failed");
          }
        },
        err => { 
this.alertService.errorAlert("Oops!", err.error.message);
        }
      )
    }
  }
  updateRiskType(riskTypeData){
    this.submitted = true;
    if (this.addEditRiskTypeForm.invalid) {
      return;
    } else {
      this.inspectionServce.updateRiskType(riskTypeData).subscribe(
        data => {
          var res: any = data;
          if (res.result.result == "success") {
            this.alertService.successAlert("Success", "Risk Type Updated Successfully");
            this.router.navigateByUrl('cms/risktype');
            this.riskTypeData = {};
          }
          else {
            this.alertService.errorAlert("Oops!", "You have not updated Risk Type");
            this.riskTypeData = {};
          }
        },
        err => {
          this.alertService.errorAlert("Oops!", err.error.message);
        }
      )
    }
  }
  reset(){
    localStorage.removeItem('risktypeid');
    this.router.navigateByUrl('cms/risktype');
  }
}
