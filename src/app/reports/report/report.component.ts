import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ReportService } from 'src/app/service/report.service';
//import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  reportDate: any={};
  reportData: any={};
  constructor(private reportService:ReportService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      pageLength: 10,
    };
    this.getReport();
  }
  getReport()
  {
    debugger;
    let fromDate = this.reportDate.fromDate ? this.reportDate.fromDate : this.datePipe.transform(new Date(), "dd/MM/yyyy");
    let toDate = this.reportDate.toDate ? this.reportDate.toDate : this.datePipe.transform(new Date(),"dd/MM/yyyy");
this.reportService.getReport(fromDate,toDate).subscribe(data => {
  debugger;
  this.reportData = data;
  this.rerender();
},err=>{

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
}
