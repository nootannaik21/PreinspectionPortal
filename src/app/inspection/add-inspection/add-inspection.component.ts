import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { InspectionSeriveService } from '../../service/inspection-serive.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { FileuploadService } from '../../service/fileupload.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NotificationService } from '../../service/notification.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-add-inspection',
  templateUrl: './add-inspection.component.html',
  styleUrls: ['./add-inspection.component.scss'],
})
export class AddInspectionComponent
  implements OnInit, OnDestroy, AfterViewInit {
  showHistoryTable: boolean;
  showReferenceNo: boolean;
  disableInspection: boolean;
  hideStatus: boolean;
  fileToUpload: File = null;
  showBranchDetail: boolean;

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
  file: File;
  fileList: FileList;
  IsDupInspection:boolean=false;
  documents:any=[];
  constructor(
    private notifyService: NotificationService,
    private fileUploadService: FileuploadService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private inspectionService: InspectionSeriveService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.duplicateinspections = [
      { id: 1, duplicateinspection: 'Yes' },
      { id: 0, duplicateinspection: 'No', checked: 'true' },
    ];
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      pageLength: 10,
    };
    this.addInspectionForm = this.formBuilder.group({
      branchName: ['', [Validators.required]],
      branchcode: ['', [Validators.required]],
      imdcode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{8}$')],
      ],
      phoneNoofsales: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      clientname: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{1,20}$')]],
      clientphoneno: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      clientemail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      emailidofsales: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      clientalternatephoneno: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      inspectionreason: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      inspectionlocation: ['', [Validators.required]],
      riskType: ['', [Validators.required]],
      registrationno: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      duplicateinspection: ['', [Validators.required]],
      paymentmodeid: ['', [Validators.required]],
      make: ['', [Validators.required]],
      model: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9, ]+$')],
      ],
      statusid: [''],
      vendorEmailId: [null],
      convayance: ['', [Validators.required]],
      conveyanceKm: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
    });

    if (localStorage.getItem('inspectionId')) {
      this.title = 'Update Inspection';
      this.showReferenceNo = true;
      this.hideStatus = true;
      if (localStorage.getItem('type') == 'Vendor') {
        this.disableFields();
        this.showHistoryTable = true;
        this.getInspectionsHistory();
        this.disableInspection = true;
        this.showBranchDetail = true;
        this.addInspectionForm.get('branchName').disable();
        this.addInspectionForm.get('branchcode').disable();
      } else if (localStorage.getItem('type') == 'Branch') {
        this.disableFields();
        this.showHistoryTable = true;
        this.addInspectionForm.get('branchName').disable();
        this.addInspectionForm.get('branchcode').disable();
        this.addInspectionForm.get('statusid').disable();
        this.addInspectionForm.get('remarks').disable();
        this.disableInspection = true;
        this.showBranchDetail = true;
      } else if (localStorage.getItem('type') == 'IMD') {
        this.disableFields();
        this.showHistoryTable = true;
        this.addInspectionForm.get('branchName').disable();
        this.addInspectionForm.get('branchcode').disable();
        this.addInspectionForm.get('statusid').disable();
        this.addInspectionForm.get('remarks').disable();
        this.disableInspection = true;
      } else if (localStorage.getItem('type') == 'OPS') {
        this.disableFields();
        this.showHistoryTable = true;
        this.addInspectionForm.get('branchName').disable();
        this.addInspectionForm.get('branchcode').disable();
        this.showBranchDetail = false;
        this.disableInspection = true;
      } else if (localStorage.getItem('type') == 'Claims') {
        this.showBranchDetail = true;
        this.showHistoryTable = true;
        this.addInspectionForm.get('branchName').disable();
        this.addInspectionForm.get('branchcode').disable();
      } else {
        this.showUpload = false;
        this.showHistoryTable = true;
        this.disableInspection = true;
        this.showBranchDetail = true;
      }
      this.getInspections();
    } else {
      this.getAllBranches();
      this.getAllInspectionStatus();
      this.getPaymentMode();
      this.getRiskType();
      this.getallProductType();
      this.getinspectionreasons();
      this.getAllconvayances();
      localStorage.removeItem('inspectionId');
      this.inspectionData.branchName = '';
      this.inspectionData.branchcode = '';
      this.inspectionData.inspectionreason = '';
      this.inspectionData.productType = '';
      this.inspectionData.riskType = '';
      this.inspectionData.paymentmodeid = '';
      this.inspectionData.vendorEmailId = '';
      this.inspectionData.convayance = '';
      this.inspectionData.statusid = 6;
      this.inspectionData.duplicateinspection = '0';
      this.title = 'Add Inspection';
      this.showReferenceNo = false;
      this.hideStatus = false;
      this.inspectionData.altclientname = '';
      if (
        localStorage.getItem('type') == 'IMD' ||
        localStorage.getItem('type') == 'Branch'
      ) {
        this.showBranchDetail = false;
        this.addInspectionForm.get('branchName').disable();
        this.addInspectionForm.get('branchcode').disable();
        this.getVendorMailList(localStorage.getItem('branch'));
      } else {
        this.showBranchDetail = true;
      }
    }
  }
  selectedduplicateinspection(event) {
    if (event.target.value == 1) {
      this.inspectionData.duplicateinspection = true;
    } else {
      this.inspectionData.duplicateinspection = false;
    }
  }
  getAllconvayances() {
    this.inspectionService.getAllconvayances().subscribe(
      (data) => {
        this.convayances = data;
      },
      (err) => {}
    );
  }
  getinspectionreasons() {
    this.inspectionService.getAllInspectionsReason().subscribe(
      (data) => {
        this.inspectionreasons = data;
      },
      (err) => {}
    );
  }
  getallProductType() {
    this.inspectionService.getAllProductType().subscribe(
      (data) => {
        this.productTypes = data;
      },
      (err) => {}
    );
  }
  getRiskType() {
    this.inspectionService.getAllRiskType().subscribe(
      (data) => {
        this.riskTypes = data;
      },
      (err) => {}
    );
  }
  getPaymentMode() {
    this.inspectionService.getAllPaymentMode().subscribe(
      (data) => {
        this.paymentMode = data;
      },
      (err) => {}
    );
  }
  getAllInspectionStatus() {
    this.inspectionService.getAllInspectionStatus().subscribe(
      (data) => {
        this.status = data;
      },
      (err) => {}
    );
  }
  // getVendorMailList(branchCode) {
  //   this.inspectionService.getVendorMailList(branchCode).subscribe(
  //     (data) => {
  //       this.vendorEmailIdDetails = data;
  //     },
  //     (err) => {}
  //   );
  // }
  getVendorMailList(branchCode) {
    this.inspectionService.getVendorMailList(branchCode).subscribe(
      (data) => {
        this.vendorEmailIdDetails = data;
      },
      (err) => {}
    );
  }
  disableFields() {
    this.addInspectionForm.get('branchcode').disable();
    this.addInspectionForm.get('branchName').disable();
    this.addInspectionForm.get('imdcode').disable();
    this.addInspectionForm.get('vendorEmailId').disable();
    this.addInspectionForm.get('phoneNoofsales').disable();
    this.addInspectionForm.get('emailidofsales').disable();
    this.addInspectionForm.get('clientname').disable();
    this.addInspectionForm.get('clientemail').disable();
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
    debugger;
    if (localStorage.getItem('view') == 'View') {
      this.title = 'View Inspection';
      this.disableInspection = false;
      this.disableFields();
      this.addInspectionForm.get('remarks').disable();
      this.addInspectionForm.get('statusid').disable();
    }
    this.getAllBranches();
    this.getAllInspectionStatus();
    this.getPaymentMode();
    this.getRiskType();
    this.getallProductType();
    this.getinspectionreasons();
    this.getAllconvayances();
    this.getinspectionByID();
  }
  statusChanged(event) {
    if (
      event.target.value == 1 ||
      event.target.value == 2 ||
      (event.target.value == 4 && localStorage.getItem('type') == 'Vendor')
    ) {
      if (localStorage.getItem('type') == 'Vendor') {
        this.showUpload = true;
      }
    } else {
      this.showUpload = false;
    }
  }
  getinspectionByID() {
    debugger;
    this.inspectionService
      .getInspectionById(localStorage.getItem('inspectionId'))
      .subscribe(
        (data) => {
          var res: any = data;
          if (res) {
            this.getVendorMailList(res.branchcode);
          }
          debugger;
          this.inspectionData = Object.assign({}, data);
          this.inspectionData.vendorEmailId = res.vendorEmailId;
          this.inspectionData.inspectionreason = res.inspectionreason;
          this.inspectionData.productType = res.productType;
          this.inspectionData.riskType = res.riskType;
          this.inspectionData.convayance = res.convayance;
          let i = 0;
          if(res.documentPath){
            //this.documents =res.documentPath.split(',');
            res.documentPath.split(',').forEach(element => {
              this.documents[i]=element;
              i++;
            });
          }
          if (res.statusid == 1 || res.statusid == 2 || res.statusid == 4) {
            if (localStorage.getItem('type') == 'Vendor') {
              this.showUpload = true;
            } else {
              this.showUpload = false;
            }
          }
          if (this.inspectionData.duplicateinspection == true) {
            this.inspectionData.duplicateinspection = '1';
          } else {
            this.inspectionData.duplicateinspection = '0';
          }
        },
        (err) => {}
      );
  }
  getInspectionsHistory() {
    this.inspectionService
      .getInspectionHistoryById(localStorage.getItem('inspectionId'))
      .subscribe(
        (data) => {
          this.inspectionHistory = data;
          this.rerender();
        },
        (err) => {}
      );
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
  this.fileList = e.target.files;
    if (this.fileList.length > 0) {
      this.file = this.fileList[0];
    }
  }

  uploadFiles() {
    debugger;
    debugger;
    let frmData: FormData = new FormData();
    frmData.append('uploadFile', this.file, this.file.name);
    if(this.fileList.length){
      for(let i=1 ; i < this.fileList.length ; i++)
        frmData.append('files[]', this.fileList[i],this.fileList[i].name);
    }
    this.inspectionService
      .uploadDocument(this.inspectionData.id,this.inspectionData.statusid, frmData)
      .subscribe(
        (data) => {
          debugger;
          this.alertService.successAlert("Success","File(s) uploaded successfully");
        },
        (err) => {
          console.log(err.error.message);
        }
      );
  }
  uploadInspectionDetails(files: FileList) {}
  downloadInspectionDetails() {}
  get f() {
    return this.addInspectionForm.controls;
  }

  getAllBranches() {
    this.inspectionService.getBranches().subscribe(
      (data) => {
        var res: any = data;
        this.branches = res.data;
        this.branches = res.data;
      },
      (err) => {}
    );
  }
  cancel() {
    this.router.navigateByUrl('inspection');
    localStorage.removeItem('inspectionId');
    this.inspectionData = {};
  }
  updateInspection() {
    debugger;
    this.submitted = true;
    if (this.addInspectionForm.invalid) {
      return;
    } else {
      var x: number = +this.inspectionData.paymentmodeid;
      var y: number = +this.inspectionData.statusid;
      this.inspectionData.paymentmodeid = x;
      this.inspectionData.statusid = y;
      this.inspectionData.altclientname = '';
      this.inspectionData.duplicateinspection == '1'
        ? (this.inspectionData.duplicateinspection = true)
        : (this.inspectionData.duplicateinspection = false);
      this.inspectionService
        .updateInspection(this.inspectionData.id, this.inspectionData)
        .subscribe(
          (data) => {
            this.notifyService.showSuccess(
              'Inspection Updated successfully !!',
              'Success'
            );
            this.router.navigateByUrl('inspection');
            this.inspectionData = {};
          },
          (err) => {}
        );
    }
  }
  onBranchSelect() {
    var temp = this.branches.filter(
      (x) => x.branchName == this.inspectionData.branchName
    );
    this.inspectionData.branchcode = temp[0].branchCode;
    this.getVendorMailList(this.inspectionData.branchcode);
  }
  onBranchCodeSelect() {
    var temp = this.branches.filter(
      (x) => x.branchCode == this.inspectionData.branchcode
    );
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
      if (
        localStorage.getItem('type') == 'Branch' ||
        localStorage.getItem('type') == 'IMD'
      ) {
        this.inspectionData.branchCode = '';
        this.inspectionData.branchName = '';
      }
      var x: number = +this.inspectionData.paymentmodeid;
      this.inspectionData.paymentmodeid = x;
      this.inspectionData.duplicateinspection == '1'
        ? (this.inspectionData.duplicateinspection = true)
        : (this.inspectionData.duplicateinspection = false);
      this.inspectionService.addInspection(this.inspectionData).subscribe(
        (data) => {
          this.notifyService.showSuccess(
            'Inspection added successfully !!',
            'Success'
          );

          this.router.navigateByUrl('inspection');
          this.inspectionData = {};
        },
        (err) => {
          this.notifyService.showError(
            'Something is wrong',
            'Inspection Not Added'
          );
          return;
        }
      );
    }
  }
IsDuplicateInspection(evt){
  debugger;
  this.inspectionService.IsDuplicateInspection(this.inspectionData.registrationno).subscribe(data =>{
debugger;
if(data){
  this.IsDupInspection = true;
  this.inspectionData.duplicateinspection = "yes";
  this.inspectionData.paymentmodeid = '2';
  this.addInspectionForm.get('paymentmodeid').disable();
}
else{
  this.IsDupInspection = false;
  this.addInspectionForm.get('paymentmodeid').enable();
  this.inspectionData.paymentmodeid = '';
}
  },err=>{

  })
}
  onDuplicateInspection(evt){
    debugger;
if(evt.target.value == "yes"){
  this.inspectionData.paymentmodeid = '2';
  this.addInspectionForm.get('paymentmodeid').disable();
}
else{
  this.addInspectionForm.get('paymentmodeid').enable();
  this.inspectionData.paymentmodeid = '';
}
  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
}
}
