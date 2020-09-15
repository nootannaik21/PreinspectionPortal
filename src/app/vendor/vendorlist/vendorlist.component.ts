import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { VendorServiceService } from '../../service/vendor-service.service';
import { AlertService } from '../../service/alert.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-vendorlist',
  templateUrl: './vendorlist.component.html',
  styleUrls: ['./vendorlist.component.scss'],
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

  constructor(
    private notifyService: NotificationService,
    private router: Router,
    private vendorService: VendorServiceService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.getAllVendors();
    localStorage.removeItem('vendorid');
  }
  editVendor(item) {
    if (!item.isDeleted) {
      localStorage.setItem('vendorid', item.id);
      this.router.navigateByUrl('vendor/addVendor');
    }
  }
  getAllVendors() {
    this.vendorService.getVendors().subscribe(
      (data) => {
        this.vendorList = data;
        this.rerender();
      },
      (err) => {}
    );
  }
  changeStatus(id) {
    this.vendorService.getVendorById(id).subscribe((data) => {
      var res: any = data;
      if (res.isDeleted == true) {
        res.status = false;
        res.isDeleted = false;
      } else {
        res.status = true;
        res.isDeleted = true;
      }

      this.vendorService.updateVendorDetails(res.id, res).subscribe(
        (data) => {
          this.getAllVendors();
        },
        (err) => []
      );
    });
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
    localStorage.removeItem('VendorIdid');
    this.router.navigateByUrl('vendor/addVendor');
  }
}
