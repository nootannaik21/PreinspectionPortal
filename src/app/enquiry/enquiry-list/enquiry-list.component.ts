import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { EnquiryserviceService } from '../../service/enquiryservice.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';

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
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  constructor(private router: Router, private enquiryService:EnquiryserviceService) { }

  ngOnInit() {
  }
  viewInspection(item){
    localStorage.setItem('inspectionId', item.id);
    localStorage.setItem('view', "View");
    this.router.navigateByUrl('inspection/addInspection');
  }
  editInspectionRow(item) {
    localStorage.setItem('inspectionId', item.id);
    localStorage.setItem('view', "Edit");
    this.router.navigateByUrl('inspection/addInspection');
  }
  getEnquiryList(){
    this.enquiryService.getEnquiryList(this.enquiryData).subscribe(
      data =>{
        this.enquiryList=data;
        this.rerender();
      },
      err=>{

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
}
