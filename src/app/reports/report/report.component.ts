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
  dtOptions: any = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  reportDate: any={};
  reportData: any={};
  constructor(private reportService:ReportService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.dtOptions = {
      // pagingType: 'full_numbers',
      // lengthMenu: [
      //   [10, 25, 50, -1],
      //   [10, 25, 50, 'All'],
      // ],
      // pageLength: 10,
      // processing: true,
      // dom: 'Bfrtip',
      //   buttons: [
      //       'copy', 'csv', 'excel', 'print'
      //   ]
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        dom: 'Bfrtip',
          buttons: [
              'excel'
          ]
      };
    this.getReport();
  }
  getReport()
  {
    let fromDate: any;
    let toDate :any;
   if (this.reportDate.fromDate) {
     let day = this.reportDate.fromDate.day < 10 ? "0" + this.reportDate.fromDate.day:this.reportDate.fromDate.day;
     let month = this.reportDate.fromDate.month < 10 ? "0" + this.reportDate.fromDate.month:this.reportDate.fromDate.month;
    fromDate = day +"/"+ month +"/" +this.reportDate.fromDate.year;
   } else {
    fromDate = this.datePipe.transform(new Date(), "dd/MM/yyyy");
   }
   if (this.reportDate.toDate) {
    let day = this.reportDate.toDate.day < 10 ? "0" + this.reportDate.toDate.day:this.reportDate.toDate.day;
     let month = this.reportDate.toDate.month < 10 ? "0" + this.reportDate.toDate.month:this.reportDate.toDate.month;
    toDate = day +"/" + month +"/" +this.reportDate.toDate.year;
   } else {
   toDate = this.datePipe.transform(new Date(),"dd/MM/yyyy");
   }
this.reportService.getReport(fromDate,toDate).subscribe(data => {
  let tempdata:any = [];
  tempdata = data;
  if (tempdata.length > 0) {
    this.reportData = data;
  }
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
