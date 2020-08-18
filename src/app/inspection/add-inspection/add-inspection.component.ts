import { Component, OnInit } from '@angular/core';
import { InspectionSeriveService } from 'src/app/service/inspection-serive.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-add-inspection',
  templateUrl: './add-inspection.component.html',
  styleUrls: ['./add-inspection.component.scss']
})
export class AddInspectionComponent implements OnInit {
  inspectionData: any = {};
  branches: any = [];
  branchCode: any = [];
  title: string;
  addInspectionForm: FormGroup;
  submitted = false;
  paymentMode: any = [];
  status: any = [];
  PreinsvendorId: any = [];
  constructor(private alertService: AlertService, private formBuilder: FormBuilder, private inspectionService: InspectionSeriveService, private router: Router) {

    this.PreinsvendorId = [
      {
        preInstid: 1,
        paymentText: "ABC"
      },
      {
        preInstid: 2,
        paymentText: "XYZ"
      },
      {
        preInstid: 3,
        paymentText: "PQR"
      }
    ], this.paymentMode = [
      {
        paymentid: 1,
        paymentText: "Cash"
      },
      {
        paymentid: 2,
        paymentText: "Check"
      },
      {
        paymentid: 3,
        paymentText: "Internet Banking"
      }
    ],
      this.status = [
        {
          statusid: 1,
          statusText: "Recommended"
        },
        {
          statusid: 2,
          statusText: "Not Recommended"
        },
        {
          statusid: 3,
          statusText: "Appointment Fix"
        },
        {
          statusid: 4,
          statusText: "Canceled"
        },
        {
          statusid: 5,
          statusText: "Rescheduled"
        }
      ]
  }

  ngOnInit() {
    this.addInspectionForm = this.formBuilder.group({
      branchcode: ['', [Validators.required]],
      imdcode: ['', [Validators.required]],
      vendorid: ['', [Validators.required]],
      phoneNoofsales: ['', [Validators.required]],
      clientname: ['', [Validators.required]],
      clientemail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      clientphoneno: ['', [Validators.required]],
      emailidofsales: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      clientalternatephoneno: ['', [Validators.required]],
      altclientname: ['', [Validators.required]],
      inspectionreason: ['', [Validators.required]],
      preinsvendorid: ['', [Validators.required]],
      make: ['', [Validators.required]],
      paymentmodeid: ['', [Validators.required]],
      registrationno: ['', [Validators.required]],
      duplicateinspection: ['', [Validators.required]],
      inspectionlocation: ['', [Validators.required]],
      updatereason: ['', [Validators.required]],
      referenceno: ['', [Validators.required]],
      statusid: ['', [Validators.required]],
      model: ['', [Validators.required]],
      conveyanceKm: ['', [Validators.required]],
      updatestatus: ['', [Validators.required]],
      remarks: ['', [Validators.required]]
    });
    if (localStorage.getItem('inspectionId')) {
      this.title = "Update Inspection";
      this.getAllBranches();
      this.inspectionService.getInspectionById(localStorage.getItem('inspectionId')).subscribe(
        data => {
          this.inspectionData = Object.assign({},data);
        },
        err => {

        }
      )
    }
    else {
      this.getAllBranches();
      localStorage.removeItem('inspectionId');
      this.title = "Add Inspection";

    }
  }
  get f() { return this.addInspectionForm.controls; }

  // onOptionsSelected(event) {
  //   var temp = this.branches.filter(x => x.branchCode == this.inspectionData.branchcode)
  //   this.inspectionData.branchName = temp[0].branchName;
  //   // this.newAssessmentforFine.UniqueID = temp[0].UniqueID;
  // }
  
  getAllBranches() {
    this.inspectionService.getBranches().subscribe(
      data => {
        var res: any = data;
        this.branches = res.data;
      },
      err => {

      }
    )
  }
  cancel() {
    this.router.navigateByUrl('inspection');
    localStorage.removeItem('inspectionId');
    this.inspectionData = {};
  }
  updateInspection() {
    this.submitted = true;
    if (this.addInspectionForm.invalid) {
      return;
    } else {
    this.inspectionService.updateInspection(this.inspectionData.id, this.inspectionData).subscribe(
      data => {
        this.alertService.successAlert("Success", "Inspection Updated successfully");
        this.router.navigateByUrl('inspection');
          this.inspectionData = {};
      },
      err => { }
    )}
  }
  createInspection() {
    this.submitted = true;
    if (this.addInspectionForm.invalid) {
      return;
    } else {
      var x: number = +(this.inspectionData.paymentmodeid);
      var y: number = +(this.inspectionData.statusid);
      var z: number = +(this.inspectionData.preinsvendorid);
      var v: number = +(this.inspectionData.vendorid);
      this.inspectionData.paymentmodeid = x;
      this.inspectionData.statusid = y;
      this.inspectionData.preinsvendorid = z;
      this.inspectionData.vendorid = v;
      this.inspectionService.addInspection(this.inspectionData).subscribe(
        data => {
          this.alertService.successAlert("Success", "Inspection added successfully");
          this.router.navigateByUrl('inspection');
          this.inspectionData = {};
        },
        err => {
          this.alertService.errorAlert("Oops!", "Failed to add Inspection details");
          return;
        }
      )
    }
  }
}
