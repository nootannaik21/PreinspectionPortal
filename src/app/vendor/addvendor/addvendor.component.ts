import { Component, OnInit } from '@angular/core';
import { VendorServiceService } from 'src/app/service/vendor-service.service';
import { Router } from '@angular/router';
import { userService } from 'src/app/service/user.service';
import { UserapiserviceService } from 'src/app/service/userapiservice.service';
import { AlertService } from 'src/app/service/alert.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-addvendor',
  templateUrl: './addvendor.component.html',
  styleUrls: ['./addvendor.component.scss'],
})
export class AddvendorComponent implements OnInit {
  addVendorForm: FormGroup;
  vendordata: any = {};

  dropdownList: any = [];
  branch: any = [];
  selectedItems = [];
  dropdownSettings: any = [];
  branchCodes: any = [];
  title: string;
  vendorStatus: any = [];
  submitted = false;
  branches: any = [];
  constructor(
    private notifyService: NotificationService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userapiService: UserapiserviceService,
    private vendorService: VendorServiceService
  ) {
    this.vendorStatus = [
      {
        id: false,
        status: 'Active',
      },
      {
        id: true,
        status: 'De-Active',
      },
    ];
  }
  branchCode: any = [];
  ngOnInit() {
    this.addVendorForm = this.formBuilder.group({
      vendorname: ['', [Validators.required]],
      branches: ['', [Validators.required]],
      inspectionemail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      status:['']
    });
    if (localStorage.getItem('vendorid')) {
      this.addVendorForm.get('inspectionemail').disable();
      this.title = 'Update Vendor';
      // this.getBranches();
      this.vendorService
        .getVendorById(localStorage.getItem('vendorid'))
        .subscribe(
          (data) => {
            var res: any = data;
            this.vendordata = Object.assign({}, res);
            this.vendordata.status = res.isDeleted;
            // this.getBranches();
            let tmp = [];
            if (this.vendordata.branchcode.length > 0) {
              this.vendorService.getBranches().subscribe(
                (branches) => {
                  var res: any = branches;
                  this.branches = res.data;
                  for (let i = 0; i <= this.vendordata.branchcode.length; i++) {
                    var branch = this.branches.filter(
                      (x) => x.id == this.vendordata.branchcode[i]
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
            }
          },
          (err) => {}
        );
        
    } else {
      this.title = 'Add Vendor';
      this.getBranches();
    }
  }
  get f() {
    return this.addVendorForm.controls;
  }
  getBranches() {
    this.vendorService.getBranches().subscribe(
      (data) => {
        var res: any = data;
        //this.branchCode = res.data;
        this.branches = res.data;
        // this.branchCode = res.data.branchCode+res.data.branchName;
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
  addVendorDetails() {
        this.submitted = true;
    if (this.addVendorForm.invalid) {
      return;
    } else {
      this.vendorService.addVendorDetails(this.vendordata).subscribe(
        (data) => {
          var res: any = data;
          if (res.message.result == 'success') {
            this.notifyService.showSuccess(
              'Vendor Added Successfully.',
              'Success'
            );
            this.vendordata = {};
            this.router.navigateByUrl('vendor');
          } else {
          }
        },
        (err) => {
          this.alertService.errorAlert('Oops!', err.error.message);
        }
      );
    }
  }
  Cancel() {
    this.vendordata = {};
    localStorage.removeItem('vendorid');
    this.router.navigateByUrl('vendor');
  }
  onItemSelect(item: any) {
    // this.branchCodes.push(item.id);
    this.vendordata.branchCode = [];
    if (this.selectedItems.length > 0) {
      this.selectedItems.forEach((element) => {
        this.vendordata.branchCode.push(element.id);
      });
    }
  }
  onSelectAll(items: any) {
    // items.forEach((element) => {
    //   var temp: any = {};
    //   temp.branchlist = element.id;
    //   this.branchCodes.push(temp);
    // });
    this.branchCodes = [];
    this.vendordata.branches = [];
    items.forEach((element) => {
      this.branchCodes.push(element.id);
    });
    this.vendordata.branchCode = this.branchCodes;
  }
  UpdateVendorDetails() {
    debugger;
    this.submitted = true;
    if (this.addVendorForm.invalid) {
      return;
    } else {
      if (this.vendordata.status == 'true') {
        this.vendordata.status = true;
        this.vendordata.isDeleted = true;
      } else {
        this.vendordata.status = false;
        this.vendordata.isDeleted = false;
      }
      this.vendordata.branchCode = [];
      if (this.selectedItems.length > 0) {
        this.selectedItems.forEach((element) => {
          this.vendordata.branchCode.push(element.id);
        });
      }
      this.vendorService
        .updateVendorDetails(this.vendordata.id, this.vendordata)
        .subscribe(
          (data) => {
            this.notifyService.showSuccess(
              'Vendor Updated Successfully !!',
              'Success'
            );

            this.vendordata = {};
            this.router.navigateByUrl('vendor');
          },
          (err) => {
            this.alertService.errorAlert('Oops!', err.error.message);
          }
        );
    }
  }
  
}
