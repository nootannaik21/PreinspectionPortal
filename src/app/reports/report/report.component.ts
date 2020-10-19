import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/service/alert.service';
import { ReportService } from 'src/app/service/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  reportDate: any = {};
  reportData: any = {};
  fromDate: any;
  toDate: any;
  constructor(
    private reportService: ReportService,
    private datePipe: DatePipe,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      buttons: ['excel'],
    };
    this.getData(this.fromDate, this.toDate);
  }
  getReport() {
    let fromDate2: any;
    let toDate2: any;
    let fromDate: any;
    let toDate: any;
    if (this.reportDate.fromDate && this.reportDate.toDate) {
      let day =
        this.reportDate.fromDate.day < 10
          ? '0' + this.reportDate.fromDate.day
          : this.reportDate.fromDate.day;
      let month =
        this.reportDate.fromDate.month < 10
          ? '0' + this.reportDate.fromDate.month
          : this.reportDate.fromDate.month;
      fromDate = day + '/' + month + '/' + this.reportDate.fromDate.year;
      fromDate2 = this.reportDate.fromDate.year + '/' + month + '/' + day;

      let toDay =
        this.reportDate.toDate.day < 10
          ? '0' + this.reportDate.toDate.day
          : this.reportDate.toDate.day;
      let toMSonth =
        this.reportDate.toDate.month < 10
          ? '0' + this.reportDate.toDate.month
          : this.reportDate.toDate.month;
      toDate = toDay + '/' + toMSonth + '/' + this.reportDate.toDate.year;
      toDate2 = this.reportDate.toDate.year + '/' + toMSonth + '/' + toDay;

      var Todate: Date = new Date(toDate2);
      var FromDate: Date = new Date(fromDate2);
      const daysDiff = (<any>Todate - <any>FromDate) / (1000 * 60 * 60 * 24);
      if (daysDiff >= 0) {
        this.getData(fromDate, toDate);
      } else {
        this.reportData = [];
        this.rerender();
        return this.alertService.infoAlert(
          'Oops !',
          'End date should be greater than start date'
        );
      }
    } else {
      this.reportData = [];
      return this.alertService.infoAlert(
        'Oops !',
        'Please provide Start Date and End date'
      );
    }
  }
  getData(fromDate, toDate) {
    this.reportService.getReport(fromDate, toDate).subscribe(
      (data) => {
        let tempdata: any = [];
        tempdata = data;
        this.reportData = data;
        this.rerender();
      },
      (err) => {
        this.reportData = [];
        this.rerender();
      }
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
}
