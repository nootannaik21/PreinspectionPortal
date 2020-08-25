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
  styleUrls: ['./addvendor.component.scss']
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
  constructor(private notifyService: NotificationService,private alertService: AlertService,private formBuilder: FormBuilder, private router: Router, private userapiService: UserapiserviceService, private vendorService: VendorServiceService,) {
    this.vendorStatus = [
      {
        id: false,
        status: "Active"
      },
      {
        id: true,
        status: "De-Active"
      }
    ]
  }
  branchCode: any = [];
  ngOnInit() {
    this.addVendorForm = this.formBuilder.group({
      vendorname: ['', [Validators.required]],
      branchcode: ['', [Validators.required]],
      status: ['', [Validators.required]],
      inspectionemail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
    if (localStorage.getItem('vendorid')) {
      this.addVendorForm.get('inspectionemail').disable();
      this.title = "Update Vendor";
      this.getBranches();
      this.vendorService.getVendorById(localStorage.getItem('vendorid')).subscribe(
        data => {
          var res:any=data;
          this.vendordata = Object.assign({}, res);
          this.vendordata.status = res.isDeleted;
        },
        err => {

        }
      )

    }
    else {
      // this.vendordata.status = undefined;
      // this.vendordata.branchcode = undefined;
      this.title = "Add Vendor";
      this.getBranches();
    }
  }
  get f() { return this.addVendorForm.controls; }
  getBranches() {
    this.vendorService.getBranches().subscribe(
      data => {
        var res: any = data;
        this.branchCode = res.data;
      },
      err => { }
    )
  }
  addVendorDetails() {
    this.submitted = true;
    if (this.addVendorForm.invalid) {
      return;
    } else {
      this.vendorService.addVendorDetails(this.vendordata).subscribe(
        data => {
          var res: any = data;
          if (res.message.result == "success") {
            this.notifyService.showSuccess("Vendor Added Successfully !!", "Success");
            // this.alertService.successAlert("Success","Vendor Added Successfully");
            this.vendordata = {};
            this.router.navigateByUrl('vendor');
          }
          else {

          }
        },
        err => { }
      )
    }

  }
  Cancel() {
    this.vendordata = {};
    localStorage.removeItem('vendorid');
    this.router.navigateByUrl('vendor');
  }
  onItemSelect(item: any) {
    console.log(item);
    this.branchCodes.push(item.id);
    // this.branchCodes.push(item.id);
    // this.userdata.branchlist = this.branchCodes.map(String);
  }
  onSelectAll(items: any) {
    console.log(items);
    items.forEach(element => {
      var temp: any = {};
      temp.branchlist = element.id
      this.branchCodes.push(temp);
    });
    // this.userdata.branchlist = this.branchCodes.map(String);
  }
  UpdateVendorDetails() {
    this.submitted = true;
    if (this.addVendorForm.invalid) {
      return;
    } else {
      if(this.vendordata.status=="true"){
        this.vendordata.status=true;
        this.vendordata.isDeleted=true;
      }
      else{
        this.vendordata.status=false;
        this.vendordata.isDeleted=false;
      }
      
      this.vendorService.updateVendorDetails(this.vendordata.id, this.vendordata).subscribe(
        data => {
          // this.alertService.successAlert("Success","Vendor Updated Successfully");
          this.notifyService.showSuccess("Vendor Updated Successfully !!", "Success");

          this.vendordata = {};
          this.router.navigateByUrl('vendor');
        },
        err => {

        }
      )
    }
  }
}
