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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AuthService } from 'src/app/service/auth.service';
import { UserapiserviceService } from 'src/app/service/userapiservice.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UiModalComponent } from 'src/app/theme/shared/components/modal/ui-modal/ui-modal.component';
import { variable } from '@angular/compiler/src/output/output_ast';


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
  image: any;
  canUpload: boolean = true;
  inspectionDataSaved: any = {};
  @ViewChild('pdfPopup', {static: false})
  pdfPopup: UiModalComponent;
  fileUrl: string;
  hideUpdateButton: boolean = false;
  showSpinner: boolean = false;

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
  IsDupInspection: boolean = false;
  documents: any = [];
  documentsPath: any = [];
  documentsPdfPath: any = [];
  showRequestRaisedErr: boolean = false;
  imdData: any = [];
  makeData: any = [];
  modelData: any = [];
  imduserDetail: boolean = false;
  documentsName: any = [];
  tempInspectionData: any ={};
  constructor(
    private notifyService: NotificationService,
    private fileUploadService: FileuploadService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private inspectionService: InspectionSeriveService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService,
    private authService: AuthService,
    private userapiService: UserapiserviceService
  ) {
    this.duplicateinspections = [
      { id: 1, duplicateinspection: 'Yes' },
      { id: 2, duplicateinspection: 'No', checked: 'true' },
    ];
  }
  imgResultBeforeCompress: number;
  imgResultAfterCompress: string;
  localCompressedURl: any;
  sizeOFCompressedImage: number;
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
      branchName: [''],
      branchcode: ['', [Validators.required]],
      // imdcode: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      imdcode: ['', [Validators.required]],
      phoneNoofsales: ['', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      clientname: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{1,20}$')],
      ],
      altclientname: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{10,}$')],
      ],
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
        [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      inspectionreason: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      inspectionlocation: ['', [Validators.required]],
      riskType: ['', [Validators.required]],
      registrationno: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]+[0-9 ]+[a-zA-Z0-9 ]{1,8}$')],
      ],
      duplicateinspection: ['', [Validators.required]],
      paymentmodeid: ['', [Validators.required]],
      make: ['', [Validators.required]],
      // model: [
      //   '',
      //   [Validators.required, Validators.pattern('^[a-zA-Z0-9, ]+$')],
      // ],
      model: ['', [Validators.required]],
      statusid: [''],
      vendororganization: ['', [Validators.required]],
      convayance: ['', [Validators.required]],
      conveyanceKm: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
    });

    if (localStorage.getItem('inspectionId')) {
      this.title = 'Update Inspection';
      this.showReferenceNo = true;
      this.hideStatus = true;
      this.imduserDetail = false;
      this.getInspectionsHistory();
      //this.getAllVehicleMake();
      //this.getAllVehicleModel();
      if (localStorage.getItem('type') == 'Vendor') {
        this.disableFields();
        this.showHistoryTable = true;
        this.disableInspection = true;
        this.showBranchDetail = true;
        this.addInspectionForm.get('branchName').disable();
        this.addInspectionForm.get('branchcode').disable();
      } else if (localStorage.getItem('type') == 'Branch') {
        this.showHistoryTable = true;
        this.addInspectionForm.get('branchName').disable();
        this.inspectionData.branchcode = localStorage.getItem('branch');
        //this.getAllImdDetails(localStorage.getItem('branch'));
        this.addInspectionForm.get('branchcode').disable();
        this.addInspectionForm.get('statusid').disable();
        this.disableInspection = true;
        this.showBranchDetail = true;
        this.addInspectionForm.get('branchName').disable();
        this.addInspectionForm.get('clientname').disable();
        this.addInspectionForm.get('altclientname').disable();
        this.addInspectionForm.get('clientemail').disable();
        this.addInspectionForm.get('clientphoneno').disable();
        this.addInspectionForm.get('clientalternatephoneno').disable();
        this.addInspectionForm.get('productType').disable();
        this.addInspectionForm.get('make').disable();
        this.addInspectionForm.get('model').disable();
        this.addInspectionForm.get('paymentmodeid').disable();
        this.addInspectionForm.get('convayance').disable();
        this.addInspectionForm.get('conveyanceKm').disable();
        this.addInspectionForm.get('registrationno').disable();
        this.addInspectionForm.get('inspectionreason').disable();
        this.addInspectionForm.get('riskType').disable();
        this.addInspectionForm.get('statusid').disable();
        this.addInspectionForm.get('duplicateinspection').disable();
      } else if (localStorage.getItem('type') == 'IMD') {
        this.showHistoryTable = true;
        this.addInspectionForm.get('branchName').disable();
        this.inspectionData.branchcode = localStorage.getItem('branch');
        //this.getAllImdDetails(localStorage.getItem('branch'));
        this.addInspectionForm.get('branchcode').disable();
        this.addInspectionForm.get('statusid').disable();
        this.disableInspection = true;
        this.showBranchDetail = true;
        this.disableFields();
        this.addInspectionForm.get('vendororganization').enable();
      } else if (localStorage.getItem('type') == 'OPS') {
        this.showHistoryTable = true;
        this.addInspectionForm.get('branchName').disable();
        this.addInspectionForm.get('clientname').disable();
        this.addInspectionForm.get('altclientname').disable();
        this.addInspectionForm.get('clientemail').disable();
        this.addInspectionForm.get('clientphoneno').disable();
        this.addInspectionForm.get('clientalternatephoneno').disable();
        this.addInspectionForm.get('productType').disable();
        this.addInspectionForm.get('make').disable();
        this.addInspectionForm.get('model').disable();
        this.addInspectionForm.get('paymentmodeid').disable();
        this.addInspectionForm.get('convayance').disable();
        this.addInspectionForm.get('conveyanceKm').disable();
        this.addInspectionForm.get('registrationno').disable();
        this.addInspectionForm.get('inspectionreason').disable();
        this.addInspectionForm.get('riskType').disable();
        this.addInspectionForm.get('statusid').disable();
        this.addInspectionForm.get('inspectionlocation').disable();
        this.addInspectionForm.get('duplicateinspection').disable();
        this.showBranchDetail = true;
        this.disableInspection = true;
      } else if (localStorage.getItem('type') == 'Claims') {
        this.showBranchDetail = true;
        this.showHistoryTable = true;
        this.addInspectionForm.get('branchName').disable();
        this.addInspectionForm.get('branchcode').disable();
        this.disableInspection = true;
        this.disableFields();
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
      this.getAllImdDetails(this.inspectionData.branchcode);
      this.getAllVehicleMake();
      this.getAllVehicleModel();
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
      this.inspectionData.vendorOrganization = '';
      this.inspectionData.imdcode = '';
      this.inspectionData.make = '';
      this.inspectionData.model = '';
      this.title = 'Add Inspection';
      this.showReferenceNo = false;
      this.hideStatus = false;
      // this.inspectionData.altclientname = '';
      if (localStorage.getItem('type') == 'Branch') {
        this.showBranchDetail = true;
        this.addInspectionForm.get('branchName').disable();
        this.inspectionData.branchcode = localStorage.getItem('branch');
        this.getAllImdDetails(localStorage.getItem('branch'));
        this.addInspectionForm.get('branchcode').disable();
        this.getVendorMailList(localStorage.getItem('branch'));
      } else if (localStorage.getItem('type') == 'IMD') {
        this.showBranchDetail = true;
        this.addInspectionForm.get('branchName').disable();
        this.inspectionData.branchcode = localStorage.getItem('branch');
        this.getAllImdDetails(localStorage.getItem('branch'));
        this.addInspectionForm.get('branchcode').disable();
        this.getVendorMailList(localStorage.getItem('branch'));
        this.inspectionData.imdcode = localStorage.getItem('imdCode');
        this.inspectionData.emailidofsales = localStorage.getItem('UserName');
        this.addInspectionForm.get('imdcode').disable();
        this.addInspectionForm.get('emailidofsales').disable();
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
        //this.getInspectionStatus(localStorage.getItem('type'));
      },
      (err) => {}
    );
  }
  getAllImdDetails(branchCode) {
    this.inspectionService.getAllImdDetails(branchCode).subscribe(
      (data) => {
        var res: any = data;
        this.imdData = res;
      },
      (err) => {}
    );
  }
  getAllVehicleMake() {
    this.inspectionService.getAllVehicleMake().subscribe(
      (data) => {
        var res: any = data;
        this.makeData = res.data;
      },
      (err) => {}
    );
  }
  getAllVehicleModel() {
    this.inspectionService.getAllVehicleModel().subscribe(
      (data) => {
        var res: any = data;
        this.modelData = res.data;
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
    this.addInspectionForm.get('vendororganization').disable();
    this.addInspectionForm.get('phoneNoofsales').disable();
    this.addInspectionForm.get('emailidofsales').disable();
    this.addInspectionForm.get('clientname').disable();
    this.addInspectionForm.get('altclientname').disable();
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
    this.getAllBranches();
    this.getAllInspectionStatus();
    this.getPaymentMode();
    this.getRiskType();
    this.getallProductType();
    this.getinspectionreasons();
    this.getAllconvayances();
    this.getAllVehicleMake();
    this.getAllVehicleModel();
    this.getAllImdDetails(localStorage.getItem('branch'));
    this.getinspectionByID();
    if (localStorage.getItem('view') == 'View') {
      this.title = 'View Inspection';
      this.disableInspection = false;
      this.disableFields();
      this.addInspectionForm.get('remarks').disable();
      this.addInspectionForm.get('statusid').disable();
    }
    if (localStorage.getItem('type') == 'IMD') {
      this.addInspectionForm.get('imdcode').disable();
      this.addInspectionForm.get('emailidofsales').disable();
    }
  }
  statusChanged(event) {
    if (event.target.value == 6 && localStorage.getItem('inspectionId')) {
      this.showRequestRaisedErr = true;
    } else {
      this.showRequestRaisedErr = false;
      if (
        (event.target.value == 1 ||
        event.target.value == 2) &&
          (localStorage.getItem('type') == 'Vendor' ||
            localStorage.getItem('type') == 'Admin')
      ) {
        this.showUpload = true;
        this.hideUpdateButton = true;
      } else {
        this.showUpload = false;
        this.hideUpdateButton = false;
      }
    }
  }
  getinspectionByID() {
    this.inspectionService
      .getInspectionById(localStorage.getItem('inspectionId'))
      .subscribe(
        (data) => {
          var res: any = data;
          this.tempInspectionData = data;
          if (res) {
            this.getVendorMailList(res.branchcode);
           localStorage.getItem('type') =="Admin" || localStorage.getItem('type') =="OPS" || localStorage.getItem('type') =="Claims" || localStorage.getItem('type') =="Vendor"? this.getAllImdDetails(res.branchcode):null;
          }
          this.inspectionData = Object.assign({}, data);
          this.inspectionData.vendorEmailId = res.vendorEmailId;
          this.inspectionData.inspectionreason = res.inspectionreason;
          this.inspectionData.productType = res.productType;
          this.inspectionData.riskType = res.riskType;
          this.inspectionData.convayance = res.convayance;
          this.inspectionData.imdcode = res.imdcode;
          this.inspectionData.make = res.make;
          this.inspectionData.model = res.model;
          if (this.inspectionData.duplicateinspection == true) {
            this.inspectionData.duplicateinspection = '1';
            this.inspectionData.paymentmodeid = '2';
            this.addInspectionForm.get('paymentmodeid').disable();
          } else {
            this.inspectionData.duplicateinspection = '0';
          }
          if ((localStorage.getItem('type') == "Admin" || localStorage.getItem('type') == "Claims" || localStorage.getItem('type') == "Vendor")) 
          {
            this.getInspectionStatus(localStorage.getItem('type'));
          }
          if(localStorage.getItem('type') == "Claims" && (this.inspectionData.statusid != 1 && this.inspectionData.statusid != 2))
          {
          this.addInspectionForm.get('statusid').disable();
        }
          let i = 0;
          if (res.documentPath) {
            res.documentPath.split(',').forEach((element) => {
              this.documents[i] = element;
              i++;
            });
            this.PreviewDoc(this.documents,this.documentsName);
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

  // uploadFiles(event: any) {
  //   let formData: FormData = new FormData();
  //   //frmData.append('uploadFile', this.file, this.file.name);

  //   if (this.fileList) {
  //     for (let i = 1; i < this.fileList.length; i++){
  //        formData.append('files[]',this.fileList[i-1], this.fileList[i-1].name);
  //       //formData.append('files[]', this.fileList[i], this.fileList[i].name);
  //     this.inspectionService
  //       .uploadDocument(
  //         this.inspectionData.id,
  //         this.inspectionData.statusid,
  //         formData
  //       )
  //       .subscribe(
  //         (data) => {
  //           this.alertService.successAlert(
  //             'Success',
  //             'File(s) uploaded successfully'
  //           );
  //         },
  //         (err) => {
  //           this.alertService.errorAlert('OOPS!', err.error.message);
  //         }
  //       );
  //   }
  //   } else {
  //     this.alertService.infoAlert('OOPS!', 'Please select the document');
  //   }
  // }

  uploadFiles() {
    debugger;
    this.showSpinner = true;
    document.getElementById('inspection').style.opacity='0.5';
    let frmData: FormData = new FormData();
    //frmData.append('uploadFile', this.file, this.file.name);
    if (this.fileList != undefined) {
      for (let i = 0; i < this.fileList.length; i++) {
        const mimeType = this.fileList[i].type;
        if (
          mimeType.match(/image\/*/) == null &&
          mimeType.match(/application\/pdf/) == null
        ) {
          this.showSpinner = false;
              document.getElementById('inspection').style.opacity="1";
          this.alertService.infoAlert(
            '',
            'Only JPEG,PNG and PDF formats are allowed.'
          );
          return (this.canUpload = false);
        }
      }
      if (this.canUpload) {
        for (let i = 0; i < this.fileList.length; i++)
          frmData.append('files[]', this.fileList[i], this.fileList[i].name);
        this.inspectionService
          .uploadDocument(
            this.inspectionData.id,
            this.inspectionData.statusid,
            frmData
          )
          .subscribe(
            (data) => {
              debugger;
              this.showSpinner = false;
              document.getElementById('inspection').style.opacity="1";
              this.alertService.successAlert(
                'Success',
                'File(s) uploaded successfully'
              );
              this.hideUpdateButton = false;
            },
            (err) => {
              debugger;
              this.showSpinner = false;
              document.getElementById('inspection').style.opacity="1";
              console.log(err.error.message);
              this.inspectionData = {};
            }
          );
      }
    } else {
      this.showSpinner = false;
              document.getElementById('inspection').style.opacity="1";
      this.alertService.infoAlert('Oops !', 'Please choose document.');
    }
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
    debugger;
    if (this.showUpload == true) {
      this.tempInspectionData.documentPath = null;
      this.tempInspectionData.documentName = null;
      this.inspectionService.updateInspection(this.inspectionData.id,this.tempInspectionData).subscribe(data => 
        {
          debugger;
          this.router.navigateByUrl('inspection');
          localStorage.removeItem('inspectionId');
          this.inspectionData = {};
        },
        err =>
        {

        })
    } else {
      this.router.navigateByUrl('inspection');
    localStorage.removeItem('inspectionId');
    this.inspectionData = {};
    }
    

  }
  updateInspection() {
    this.submitted = true;
    if (this.addInspectionForm.invalid || this.showRequestRaisedErr) {
      return;
    } else {
      var x: number = +this.inspectionData.paymentmodeid;
      var y: number = +this.inspectionData.statusid;
      this.inspectionData.paymentmodeid = x;
      this.inspectionData.statusid = y;
      this.inspectionData.duplicateinspection == '1'
        ? (this.inspectionData.duplicateinspection = true)
        : (this.inspectionData.duplicateinspection = false);
        // if (
        //   this.inspectionData.statusid == '1' ||
        //   this.inspectionData.statusid == '2'
        // ) {
        //         this.inspectionService
        //           .updateInspection(this.inspectionData.id, this.inspectionData)
        //           .subscribe(
        //             (data) => {
        //               this.notifyService.showSuccess(
        //                 'Inspection Updated successfully !!',
        //                 'Success'
        //               );
        //               this.router.navigateByUrl('inspection');
        //               this.inspectionData = {};
        //             },
        //             (err) => {
        //               this.notifyService.showError(
        //                 'Inspection Update failed !!',""
        //               );
        //             }
        //           );
        // }
       
        this.inspectionService
          .updateInspection(this.inspectionData.id, this.inspectionData)
          .subscribe(
            (data) => {
              var res: any = data;
              ///if (res.result == 'success') {
              this.notifyService.showSuccess(
                'Inspection Updated successfully !!',
                'Success'
              );
              this.router.navigateByUrl('inspection');
              this.inspectionData = {};
              //}
            },
            (err) => {
              if (err.error.message != null) {
                this.notifyService.showError(err.error.message, "");
          return;
              } else {
                this.notifyService.showSuccess(
                  'Inspection Updated successfully !!',
                  'Success'
                );
                this.router.navigateByUrl('inspection');
              }
             
              // this.notifyService.showError(
              //   'Inspection Update failed !!',
              //   err.error.message
              // );
            }
          );
    }
  }
  onBranchSelect() {
    // var temp = this.branches.filter(
    //   (x) => x.branchName == this.inspectionData.branchName
    // );
    
    this.getVendorMailList(this.inspectionData.branchcode);
    this.getAllImdDetails(this.inspectionData.branchcode);
    this.inspectionData.imdcode = '';
    this.inspectionData.vendorOrganization='';
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
  onIMDSelect() {
    var temp = this.imdData.filter(
      (x) => x.imdCode == this.inspectionData.imdcode
    );
    this.inspectionData.emailidofsales = temp[0].email;
    //this.inspectionData.phoneNoofsales = temp[0].imdPhone;
  }
  onConvayanceSelect() {
    if (this.inspectionData.convayance == 'Yes') {
      this.inspectionData.conveyanceKm = '';
      this.addInspectionForm.get('conveyanceKm').enable();
    } else {
      this.inspectionData.conveyanceKm = '0';
      this.addInspectionForm.get('conveyanceKm').disable();
    }
  }
  createInspection() {
    this.submitted = true;
    if (this.addInspectionForm.invalid) {
      return;
    }
    // else if(this.IsDupInspection)
    // {
    //   this.alertService.infoAlert('OOPS!', 'It is a duplicate inspection.');
    // }
    else {
      if (localStorage.getItem('type') == 'Branch') {
        this.inspectionData.branchCode = '';
        this.inspectionData.branchName = '';
      }
      if (localStorage.getItem('type') == 'IMD') {
        this.inspectionData.branchCode = '';
        this.inspectionData.branchName = '';
        //   var y: number = +this.inspectionData.imdCode;
        // this.inspectionData.imdCode = y;
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
          if (err.error.message != null) {
            this.notifyService.showError(
              err.error.message,
              'Inspection Not Added'
            );
            return;
          } else {
            this.notifyService.showSuccess(
              'Inspection added successfully !!',
              'Success'
            );
            this.router.navigateByUrl('inspection');
          }
        }
      );
    }
  }
  IsDuplicateInspection(evt) {
    this.inspectionService
      .IsDuplicateInspection(this.inspectionData.registrationno)
      .subscribe(
        (data) => {
          if (data) {
            this.IsDupInspection = true;
            this.inspectionData.duplicateinspection = '1';
            this.inspectionData.paymentmodeid = '2';
            this.addInspectionForm.get('paymentmodeid').disable();
          } else {
            this.IsDupInspection = false;
            this.addInspectionForm.get('paymentmodeid').enable();
            this.inspectionData.paymentmodeid = '';
          }
        },
        (err) => {}
      );
  }
  onDuplicateInspection(evt) {
    if (evt.target.value == '1') {
      this.inspectionData.paymentmodeid = '2';
      this.addInspectionForm.get('paymentmodeid').disable();
    } else {
      this.addInspectionForm.get('paymentmodeid').enable();
      this.inspectionData.paymentmodeid = '';
    }
  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
  PreviewDoc(document,fileName) {
    let i = 0;
    document.forEach(
      (element,index) => {
        this.inspectionService.downloadDocument(element).subscribe((data) => {
          var res: any = data;
            var blob = new Blob([data], { type: res.type });
            var fileURL = URL.createObjectURL(blob);
            var type = res.type == "application/pdf"?'pdf':'image';
            this.documentsPath[index] = {type:type,url:fileURL,fileName:element};
        },(err) => {
          this.documentsPath[index] = {type:null,url:null};
        });
      }
      
    );
    this.showSpinner = false;
    document.getElementById('inspection').style.opacity='1';
  }

  downloadDoc(url) {
    var link = document.createElement('a');
    link.href = url;
    link.download = 'download';
    link.click();
  }
  compressFile(file, fileName) {
    //   this.imageCompress.uploadFile().then(({ image, orientation }) => {
    //     this.imgResultBeforeCompress = image;
    //     this.imageCompress
    //       .compressFile(image, orientation, 50, 50)
    //       .then((result) => {
    //         this.imgResultAfterCompress = result;
    //           'Size in bytes is now:',
    //           this.imageCompress.byteCount(result)
    //         );
    //       });
    //   });
    // }
    var orientation = -1;
    this.imgResultBeforeCompress =
      this.imageCompress.byteCount(file.size) / (1024 * 1024);
    this.imageCompress
      .compressFile(file, orientation, 50, 50)
      .then((result) => {
        this.imgResultAfterCompress = result;
        this.localCompressedURl = result;
        this.sizeOFCompressedImage =
          this.imageCompress.byteCount(result) / (1024 * 1024);
      });
  }
  getPdfView(item)
  {
this.fileUrl = item.url;
this.pdfPopup.show();
  }
  getInspectionStatus(role)
  {
    let allStatus = this.status;
    if(role == "Claims"  && (this.inspectionData.statusid == 1 || this.inspectionData.statusid == 2))
    {
    this.status = [];
      var claimsStatus = [6,7,8];
      for (let index = 0; index < allStatus.length; index++) {
        var tempStatus = allStatus.filter(
          (x) => x.id == claimsStatus[index]
        );
        var i= 0;
        if(tempStatus.length > 0)
        {
          this.status.push(tempStatus[i]);
          i++;
        }
      }
      
    }
    if((role == "Claims" || role == "Admin")  && (this.inspectionData.statusid == 1 || this.inspectionData.statusid == 2))
    {
    this.status = [];
    var inspectionCurrentStatus : number = +this.inspectionData.statusid;
      var claimsStatus = [7,8,inspectionCurrentStatus];
      for (let index = 0; index < allStatus.length; index++) {
        //const element = array[index];
        var tempStatus = allStatus.filter(
          (x) => x.id == claimsStatus[index]
        );
        var i= 0;
        if(tempStatus.length > 0)
        {
          this.status.push(tempStatus[i]);
          i++;
        }
      }
      
    }
    if(role == "Claims"  && this.inspectionData.statusid != 1 && this.inspectionData.statusid != 2)
    {
    this.status = [];
    var inspectionCurrentStatus : number = +this.inspectionData.statusid;
      var claimsStatus = [inspectionCurrentStatus];
      for (let index = 0; index < allStatus.length; index++) {
        //const element = array[index];
        var tempStatus = allStatus.filter(
          (x) => x.id == claimsStatus[index]
        );
        var i= 0;
        if(tempStatus.length > 0)
        {
          this.status.push(tempStatus[i]);
          i++;
        }
      }
      
    }
    
    if((role == "Admin" || role == "OPS")  && (this.inspectionData.statusid != 1 || this.inspectionData.statusid != 2))
    {
    this.status = [];
    var inspectionCurrentStatus : number = +this.inspectionData.statusid;
      var claimsStatus = [1,2,3,4,5,6,inspectionCurrentStatus];
      for (let index = 0; index < allStatus.length; index++) {
        //const element = array[index];
        var tempStatus = allStatus.filter(
          (x) => x.id == claimsStatus[index]
        );
        var i= 0;
        if(tempStatus.length > 0)
        {
          this.status.push(tempStatus[i]);
          i++;
        }
      }
    }
      
    // }
    if(role == "Vendor")
    {
    this.status = [];
      var claimsStatus = [1,2,3,4,5,6];
      for (let index = 0; index < allStatus.length; index++) {
        //const element = array[index];
        var tempStatus = allStatus.filter(
          (x) => x.id == claimsStatus[index]
        );
        var i= 0;
        if(tempStatus.length > 0)
        {
          this.status.push(tempStatus[i]);
          i++;
        }
      }
      
    }
  }
}
