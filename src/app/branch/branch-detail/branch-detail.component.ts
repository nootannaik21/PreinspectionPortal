import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.scss']
})
export class BranchDetailComponent implements OnInit,OnDestroy,AfterViewInit {

  branchList: any=[];
  ngAfterViewInit(): void {
    this.branchList = [];
    this.rerender();
  }

  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      pageLength: 10,
      // 'columnDefs': [{
      //   'targets': [3], // column index (start from 0)
      //   'orderable': false, // set orderable false for selected columns
      // }]
    };
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