import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { VendorServiceService } from '../../service/vendor-service.service'
import { AlertService } from 'src/app/service/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendorlist',
  templateUrl: './vendorlist.component.html',
  styleUrls: ['./vendorlist.component.scss']
})
export class VendorlistComponent implements OnInit, OnDestroy, AfterViewInit {
  vendorList: any = [];

  ngAfterViewInit(): void {
    this.vendorList = [];
    this.rerender();
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  constructor(private router:Router ,private vendorService: VendorServiceService, private alertService:AlertService) { }

  ngOnInit() {
    this.getAllVendors();
  }
  getAllVendors() {
    this.vendorService.getVendors().subscribe(
      data => {
        // var res:any=data;
        this.vendorList = data;
        this.rerender();
      },
      err => {

      }
    )
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
  gotoAddVendorScreen() {
    localStorage.removeItem('VendorIdid')
    this.router.navigateByUrl('vendor/addVendor');

  }
  deleteVendor(item) {
    this.vendorService.deleteVendor(item.id).subscribe(
      data => {
        var res: any = data;
        if (res.message.result == "success") {
          this.alertService.successAlert("Success","Vendor Deleted Successfully");
            this.getAllVendors();
        }
      },
      err => {
      }
    )

  }
}
