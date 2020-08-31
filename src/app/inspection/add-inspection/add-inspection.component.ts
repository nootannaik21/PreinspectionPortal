import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { InspectionSeriveService } from 'src/app/service/inspection-serive.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/service/alert.service';
import { FileuploadService } from 'src/app/service/fileupload.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-inspection',
  templateUrl: './add-inspection.component.html',
  styleUrls: ['./add-inspection.component.scss']
})
export class AddInspectionComponent implements OnInit, OnDestroy, AfterViewInit {
  showHistoryTable: boolean;
  showReferenceNo: boolean;
  disableInspection: boolean;
  ngAfterViewInit(): void {
    this.inspectionHistory = [];
    this.rerender();
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  inspectionHistory: any = [];
  inspectionData: any = {};
  branches: any = [];
  branchCode: any = [];
  title: string;
  addInspectionForm: FormGroup;
  submitted = false;
  paymentMode: any = [];
  status: any = [];
  PreinsvendorId: any = [];
  productTypes: any = [];
  riskTypes: any = [];
  duplicateinspections: any = [];
  convayances: any = [];
  inspectionreasons: any = [];
  vendorEmailIdDetails: any = [];
  showUpload: boolean = false;
  myFiles: string[] = [];
  constructor(private fileUploadService: FileuploadService, private alertService: AlertService, private formBuilder: FormBuilder, private inspectionService: InspectionSeriveService, private router: Router) {
    this.vendorEmailIdDetails = [
      {
        id: 1,
        vendorEmailId: "test@gmail.com"
      },
      {
        id: 2,
        vendorEmailId: "test12@gmail.com"
      },
      {
        id: 3,
        vendorEmailId: "sdsds@gmail.com"
      },
      {
        id: 4,
        vendorEmailId: "deeksha@vendor.com"
      }
    ]
    this.inspectionreasons = [
      {
        id: 1,
        inspectionreason: "reason1"
      },
      {
        id: 2,
        inspectionreason: "reason2"
      },
      {
        id: 3,
        inspectionreason: "reason3"
      },
    ]
    this.convayances = [
      {
        id: 1,
        convayance: "convayance1"
      },
      {
        id: 2,
        convayance: "convayance2"
      },
      {
        id: 3,
        convayance: "convayance3"
      },
    ]
    this.duplicateinspections = [
      {
        id: 1,
        duplicateinspection: "Yes"
      },
      {
        id: 0,
        duplicateinspection: "No"
      },

    ]
    this.riskTypes = [
      {
        id: 1,
        riskType: "risk1"
      },
      {
        id: 2,
        riskType: "risk2"
      },
      {
        id: 3,
        riskType: "risk3"
      },
    ]
    this.productTypes = [
      {
        id: 1,
        productType: "product1"
      },
      {
        id: 2,
        productType: "product2"
      },
      {
        id: 3,
        productType: "product3"
      },
    ]
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      // columnDefs: [
      //   { "width": "14%", "targets": [0,1,2,3,4,5,6] }
      // ],
      pageLength: 10,
    };
    this.addInspectionForm = this.formBuilder.group({
      branchName: ['', [Validators.required]],
      branchcode: ['', [Validators.required]],
      imdcode: ['', [Validators.required]],
      phoneNoofsales: ['', [Validators.required]],
      clientname: ['', [Validators.required]],
      clientphoneno: ['', [Validators.required]],
      clientemail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      emailidofsales: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      clientalternatephoneno: ['', [Validators.required]],
      inspectionreason: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      inspectionlocation: ['', [Validators.required]],
      riskType: ['', [Validators.required]],
      registrationno: ['', [Validators.required]],
      duplicateinspection: ['', [Validators.required]],
      paymentmodeid: ['', [Validators.required]],
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      statusid: ['', [Validators.required]],
      vendorEmailId: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      convayance: ['', [Validators.required]],
      conveyanceKm: ['', [Validators.required]],
      altclientname: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      // referenceno:['']
    });
    if (localStorage.getItem('inspectionId')) {
      this.title = "Update Inspection";
      this.showReferenceNo = true;
      if (localStorage.getItem('type') == "Vendor") {
        this.disableFields();
        this.showUpload = true;
        this.showHistoryTable = true;
        this.getInspectionsHistory();
        this.disableInspection=false;

        // this.getInspections();
      }
      else if (localStorage.getItem('type') == "Branch" || localStorage.getItem('type') == "IMD") {
        this.disableFields();
        this.addInspectionForm.get('statusid').disable();
        this.addInspectionForm.get('remarks').disable();
        this.disableInspection=true;
        // this.getInspections();
      }
      else {
        this.showUpload = false;
        this.showHistoryTable = false;
        this.disableInspection=false;
        // this.getInspections();
      }
      this.getInspections();
    }
    else {
      this.getAllBranches();
      localStorage.removeItem('inspectionId');
      this.title = "Add Inspection";
      this.showReferenceNo = false;
      // this.showUpload = false;
      // this.showHistoryTable=false;
    }
  }
  disableFields() {
    this.addInspectionForm.get('branchName').disable();
    this.addInspectionForm.get('branchcode').disable();
    this.addInspectionForm.get('imdcode').disable();
    this.addInspectionForm.get('vendorEmailId').disable();
    this.addInspectionForm.get('phoneNoofsales').disable();
    this.addInspectionForm.get('emailidofsales').disable();
    this.addInspectionForm.get('clientname').disable();
    this.addInspectionForm.get('clientemail').disable();
    this.addInspectionForm.get('altclientname').disable();
    this.addInspectionForm.get('clientphoneno').disable();
    this.addInspectionForm.get('clientalternatephoneno').disable();
    this.addInspectionForm.get('inspectionreason').disable();
    this.addInspectionForm.get('inspectionlocation').disable();
    this.addInspectionForm.get('registrationno').disable();
    this.addInspectionForm.get('duplicateinspection').disable();
    this.addInspectionForm.get('productType').disable();
    this.addInspectionForm.get('make').disable();
    this.addInspectionForm.get('model').disable();
    this.addInspectionForm.get('paymentmodeid').disable();
    this.addInspectionForm.get('convayance').disable();
    this.addInspectionForm.get('conveyanceKm').disable();
    this.addInspectionForm.get('riskType').disable();
  }
  getInspections() {
    this.getAllBranches();
    this.inspectionService.getInspectionById(localStorage.getItem('inspectionId')).subscribe(
      data => {
        this.inspectionData = Object.assign({}, data);
        if (this.inspectionData.duplicateinspection == true) { this.inspectionData.duplicateinspection = 1 }
        else { this.inspectionData.duplicateinspection = 0; }
        // this.getVendorEMailByBranchCode(this.inspectionData.branchcode);
      },
      err => {

      }
    )
  }
  getInspectionsHistory() {
    this.inspectionService.getInspectionHistoryById(localStorage.getItem('inspectionId')).subscribe(
      data => {
        this.inspectionHistory = data;
        this.rerender();
      },
      err => {

      })
  }
  rerender(): void {
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  getFileDetails(e) {
    //console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    console.log(this.myFiles)
  }

  uploadFiles() {
    const frmData = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) {
      // frmData.append("fileUpload", this.myFiles[i]);
    }
    // this.inspectionService.uploadDocument(this.inspectionData.id, frmData);

  }
  // // onSelectFile(event) {
  // //   if (event.target.files && event.target.files[0]) {
  // //     var filesAmount = event.target.files.length;
  // //     for (let i = 0; i < filesAmount; i++) {
  // //       var reader = new FileReader();
  // //       reader.onload = (event: any) => {
  // //         console.log(event.target.result);
  // //         this.urls.push(event.target.result);
  // //       }
  // //     }
  // //   }
  //   this.inspectionService.uploadDocument(this.inspectionData.id, this.urls);
  // }
  uploadInspectionDetails(files: FileList) {
    // this.fileToUpload = files.item(0);

    // this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
    //   // do something, if upload success
    //   }, error => {
    //     console.log(error);
    //   });
  }
  downloadInspectionDetails() {

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
      var x: number = +(this.inspectionData.paymentmodeid);
      var y: number = +(this.inspectionData.statusid);
      this.inspectionData.paymentmodeid = x;
      this.inspectionData.statusid = y;
      if (this.inspectionData.duplicateinspection == "1" ? this.inspectionData.duplicateinspection = true : this.inspectionData.duplicateinspection = false)
        this.inspectionService.updateInspection(this.inspectionData.id, this.inspectionData).subscribe(
          data => {
            this.alertService.successAlert("Success", "Inspection Updated successfully");
            this.router.navigateByUrl('inspection');
            this.inspectionData = {};
          },
          err => { }
        )
    }
  }
  onBranchSelect() {
    var temp = this.branches.filter(x => x.branchName == this.inspectionData.branchName)
    this.inspectionData.branchcode = temp[0].branchCode;
  }
  createInspection() {
    this.submitted = true;
    if (this.addInspectionForm.invalid) {
      return;
    } else {
      var x: number = +(this.inspectionData.paymentmodeid);
      var y: number = +(this.inspectionData.statusid);
      this.inspectionData.paymentmodeid = x;
      this.inspectionData.statusid = y;
      if (this.inspectionData.duplicateinspection == "1" ? this.inspectionData.duplicateinspection = true : this.inspectionData.duplicateinspection = false)
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
  getVendorEMailByBranchCode(branchCode){
    this.inspectionService.getVendorEmailByBranchCode(branchCode).subscribe(
      data => {
        this.vendorEmailIdDetails  = Object.assign({}, data);
      },
      err => {

      }
    )
  }
}
