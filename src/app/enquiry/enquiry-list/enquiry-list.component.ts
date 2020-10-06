import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { EnquiryserviceService } from '../../service/enquiryservice.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-enquiry-list',
  templateUrl: './enquiry-list.component.html',
  styleUrls: ['./enquiry-list.component.scss']
})
export class EnquiryListComponent implements OnInit, OnDestroy, AfterViewInit {
  enquiryData:any={};
  enquiryList:any=[];
  ngAfterViewInit(): void {
    this.enquiryList = [];
    this.rerender();
  }
  dtOptions: any = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  constructor(private router: Router, private enquiryService:EnquiryserviceService,private alertService: AlertService,) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      pageLength: 10,
      processing: true,
        dom: 'Bfrtip',
          buttons: [
              'excel'
          ]
    };
  }
  viewInspection(item){
    localStorage.setItem('inspectionId', item.id);
    localStorage.setItem('view', "View");
    this.router.navigateByUrl('inspection/viewInspection');
  }
  editInspectionRow(item) {
    localStorage.setItem('inspectionId', item.id);
    localStorage.setItem('view', "Edit");
    this.router.navigateByUrl('inspection/editInspection');
  }
  getEnquiryList(){
    this.enquiryService.getEnquiryList(this.enquiryData).subscribe(
      data =>{
        this.enquiryList=data;
        this.rerender();
      },
      err=>{
        this.alertService.errorAlert("Oops!", err.error.message);
      }
    )

  }
  reset(){
    this.enquiryData = {};
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
}
