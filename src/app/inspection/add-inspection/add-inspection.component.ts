import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { InspectionSeriveService } from 'src/app/service/inspection-serive.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/service/alert.service';
import { FileuploadService } from 'src/app/service/fileupload.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';


@Component({
  selector: 'app-add-inspection',
  templateUrl: './add-inspection.component.html',
  styleUrls: ['./add-inspection.component.scss']
})
export class AddInspectionComponent implements OnInit, OnDestroy, AfterViewInit {
  showHistoryTable: boolean;
  showReferenceNo: boolean;
  disableInspection: boolean;
  hideStatus: boolean;
  fileToUpload: File = null;

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
  productTypes: any = [];
  riskTypes: any = [];
  duplicateinspections: any = [];
  convayances: any = [];
  inspectionreasons: any = [];
  vendorEmailIdDetails: any = [];
  showUpload: boolean = false;
  myFiles: FileList;
  file: File;
  constructor(private notifyService: NotificationService, private fileUploadService: FileuploadService, private alertService: AlertService, private formBuilder: FormBuilder, private inspectionService: InspectionSeriveService, private router: Router) {
    this.duplicateinspections = [
      { id: 1, duplicateinspection: 'Yes' },
      { id: 0, duplicateinspection: 'No', checked: "true" },
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
      imdcode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      phoneNoofsales: ['', [Validators.required,Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      clientname: ['', [Validators.required]],
      clientphoneno: ['', [Validators.required,Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      clientemail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      emailidofsales: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      clientalternatephoneno: ['', [Validators.required,Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      inspectionreason: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      inspectionlocation: ['', [Validators.required]],
      riskType: ['', [Validators.required]],
      registrationno: ['', [Validators.required]],
      duplicateinspection: ['', [Validators.required]],
      paymentmodeid: ['', [Validators.required]],
      make: ['', [Validators.required]],
      model: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9, ]+$')]],
      statusid: [''],
      vendorEmailId: [null],
      convayance: ['', [Validators.required]],
      conveyanceKm: ['', [Validators.required]],
      // altclientname: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      // referenceno:['']
    });
    if (localStorage.getItem('inspectionId')) {
      this.title = "Update Inspection";
      this.showReferenceNo = true;
      this.hideStatus = true;
      if (localStorage.getItem('type') == "Vendor") {
        this.disableFields();
        this.showHistoryTable = true;
        this.getInspectionsHistory();
        this.disableInspection = false;
      }
      else if (localStorage.getItem('type') == "Branch") {
        this.disableFields();
        this.addInspectionForm.get('statusid').disable();
        this.addInspectionForm.get('remarks').disable();
        this.disableInspection = true;
      }
      else if (localStorage.getItem('type') == "IMD") {
        this.disableFields();
        this.addInspectionForm.get('statusid').disable();
        this.addInspectionForm.get('remarks').disable();
        this.disableInspection = true;
      }
      else if (localStorage.getItem('type') == "OPS") {
        this.disableFields();
        this.addInspectionForm.get('statusid').disable();
        this.addInspectionForm.get('remarks').disable();
        this.disableInspection = true;
      }
      else {
        this.showUpload = false;
        this.showHistoryTable = false;
        this.disableInspection = false;
      }
      this.getInspections();

    }

    else {
      this.getAllBranches();
      this.getAllInspectionStatus();
      this.getPaymentMode();
      this.getRiskType();
      this.getallProductType();
      this.getinspectionreasons();
      this.getAllconvayances();
      localStorage.removeItem('inspectionId');
      this.inspectionData.branchName = "";
      this.inspectionData.branchcode = "";
      this.inspectionData.inspectionreason = "";
      this.inspectionData.productType = "";
      this.inspectionData.riskType = "";
      this.inspectionData.paymentmodeid = "";
      this.inspectionData.vendorEmailId = "";
      this.inspectionData.convayance = "";
      this.inspectionData.statusid = 6;
      this.inspectionData.duplicateinspection = "0";
      this.title = "Add Inspection";
      this.showReferenceNo = false;
      this.hideStatus = false;
      this.inspectionData.altclientname = "";
      // const vendorEmailId = this.addInspectionForm.get('vendorEmailId');
      // vendorEmailId.setValidators(null);
      // vendorEmailId.updateValueAndValidity();
      // this.showUpload = false;
      // this.showHistoryTable=false;
    }
  }
  selectedduplicateinspection(event) {
    if (event.target.value == 1) {
      this.inspectionData.duplicateinspection = true;
    }
    else {
      this.inspectionData.duplicateinspection = false;
    }
  }
  getAllconvayances() {
    this.inspectionService.getAllconvayances().subscribe(
      data => {
        this.convayances = data;
      },
      err => { }
    )
  }
  getinspectionreasons() {
    this.inspectionService.getAllInspectionsReason().subscribe(
      data => {
        this.inspectionreasons = data;
      },
      err => { }
    )
  }
  getallProductType() {
    this.inspectionService.getAllProductType().subscribe(
      data => {
        this.productTypes = data;
      },
      err => { }
    )
  }
  getRiskType() {
    this.inspectionService.getAllRiskType().subscribe(
      data => {
        this.riskTypes = data;
      },
      err => { }
    )
  }
  getPaymentMode() {
    this.inspectionService.getAllPaymentMode().subscribe(
      data => {
        this.paymentMode = data;
      },
      err => { }
    )
  }
  getAllInspectionStatus() {
    this.inspectionService.getAllInspectionStatus().subscribe(
      data => {
        this.status = data;
      },
      err => { }
    )
  }
  getVendorMailList(branchCode) {
    this.inspectionService.getVendorMailList(branchCode).subscribe(
      data => {
        this.vendorEmailIdDetails = data;
      },
      err => {

      }
    )
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
    if (localStorage.getItem('view') == "View") {
      this.title = "View Inspection";
      this.disableFields();
      this.addInspectionForm.get('remarks').disable();
      this.addInspectionForm.get('statusid').disable();
      this.disableInspection = true;
    }
    this.getAllBranches();
    this.getAllInspectionStatus();
    this.getPaymentMode();
    this.getRiskType();
    this.getallProductType();
    this.getinspectionreasons();
    this.getAllconvayances();
    // this.getVendorMailList(this.inspectionData.branchcode);     
    this.getinspectionByID();
  }
  statusChanged(event){
    if(event.target.value==1||event.target.value==2||event.target.value==4 && (localStorage.getItem('type') == "Vendor")){
      if (localStorage.getItem('type') == "Vendor") {
        this.showUpload = true;
      }      
    }
    else{
      this.showUpload=false
    }
  }
  getinspectionByID() {
    this.inspectionService.getInspectionById(localStorage.getItem('inspectionId')).subscribe(
      data => {
        var res: any = data;
        if (res) {
          this.getVendorMailList(res.branchcode);
        }
        this.inspectionData = Object.assign({}, data);
        this.inspectionData.vendorEmailId = res.vendorEmailId;
        this.inspectionData.inspectionreason=res.inspectionreason;
        this.inspectionData.productType=res.productType;
        this.inspectionData.riskType=res.riskType;
        this.inspectionData.convayance=res.convayance;        
        if (res.statusid == 1 || res.statusid == 2 || res.statusid == 4) {
          if (localStorage.getItem('type') == "Vendor") {
            this.showUpload = true;
          }
          else {
            this.showUpload = false;
          }
        }
        if (this.inspectionData.duplicateinspection == true) { this.inspectionData.duplicateinspection = "1" }
        else { this.inspectionData.duplicateinspection = "0"; }
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
    let fileList: FileList = e.target.files;
    if(fileList.length > 0) {
      this.file = fileList[0];
        
    }
    // if(e.target.files.length > 0) {
    //   let file: File = this.myFiles[0];
    //   let formData:FormData = new FormData();
    //   formData.append('uploadFile', file, file.name);
    // }
  }

  uploadFiles() {
    // const frmData = new FormData();
    let frmData:FormData = new FormData();
    frmData.append('uploadFile', this.file, this.file.name);
    // for (var i = 0; i < this.myFiles.length; i++) {
    //    frmData.append("fileUpload", this.myFiles[i]);
    // }
    //  this.inspectionService.uploadDocument(this.inspectionData.id, frmData);
    
    this.inspectionService.uploadDocument(this.inspectionData.id, frmData).subscribe(
      data => {
      },
      err => {
console.log(err.error.message)
      }
    )
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
      this.inspectionData.altclientname = "";
      this.inspectionData.duplicateinspection == "1" ? this.inspectionData.duplicateinspection = true : this.inspectionData.duplicateinspection = false;
      this.inspectionService.updateInspection(this.inspectionData.id, this.inspectionData).subscribe(
        data => {
          this.notifyService.showSuccess("Inspection Updated successfully !!", "Success");
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
    this.getVendorMailList(this.inspectionData.branchcode);
  }
  onBranchCodeSelect() {
    var temp = this.branches.filter(x => x.branchCode == this.inspectionData.branchcode)
    this.inspectionData.branchName = temp[0].branchName;
    if (this.inspectionData.branchcode) {
      this.getVendorMailList(this.inspectionData.branchcode);
    }
  }
  createInspection() {
    debugger;
    this.submitted = true;
    if (this.addInspectionForm.invalid) {
      return;
    } else {
      var x: number = +(this.inspectionData.paymentmodeid);
      this.inspectionData.paymentmodeid = x;
      this.inspectionData.duplicateinspection == "1" ? this.inspectionData.duplicateinspection = true : this.inspectionData.duplicateinspection = false;
      this.inspectionService.addInspection(this.inspectionData).subscribe(
        data => {
          this.notifyService.showSuccess("Inspection added successfully !!", "Success");

          this.router.navigateByUrl('inspection');
          this.inspectionData = {};
        },
        err => {
          this.notifyService.showError("Something is wrong", "Inspection Not Added");
          return;
        }
      )
    }
  }
  // getVendorEMailByBranchCode(branchCode){
  //   this.inspectionService.getVendorEmailByBranchCode(branchCode).subscribe(
  //     data => {
  //       this.vendorEmailIdDetails  = Object.assign({}, data);
  //     },
  //     err => {

  //     }
  //   )
  // }
}
