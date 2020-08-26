import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { InspectionSeriveService } from '../../service/inspection-serive.service'
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.component.html',
  styleUrls: ['./inspection-list.component.scss']
})
export class InspectionListComponent implements OnInit, OnDestroy, AfterViewInit {
  inspectionList:any=[];
  ngAfterViewInit(): void {
    this.inspectionList = [];
    this.rerender();
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  constructor(private router: Router, private inspectionService: InspectionSeriveService, private alertService: AlertService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      // columnDefs: [
      //   { "width": "14%", "targets": [0,1,2,3,4,5,6] }
      // ],
      pageLength: 10,
    };
    this.getInspectionList();
  }
  downloadInspectionDetails(item){
    localStorage.setItem('inspectionId', item.id);
    this.router.navigateByUrl('inspection/addInspection');
    // this.inspectionService.getInspectionHistoryById(item.id).subscribe(
    //   data =>{
    //   },
    //   err =>{

    //   }
    // )
  }
  editInspectionRow(item){
    localStorage.setItem('inspectionId', item.id);
    this.router.navigateByUrl('inspection/addInspection');

  }
  getInspectionList() {
    this.inspectionService.getInspectionList().subscribe(
      data =>{
        var res:any=data;
        this.inspectionList=res.data;
        this.rerender();
      },
      err =>{

      }
    )
  }
  gotoAddInspectionScreen() {
    localStorage.removeItem('inspectionId');
    this.router.navigateByUrl('inspection/addInspection');
  }
  deleteInspection(item){
    this.alertService.confirmAlert(() => {
    this.inspectionService.deleteInspection(item.id).subscribe(
      data => {
        var res :any =data;
        if(res.result=="success"){
        this.alertService.successAlert("Success","Deleted Successfully");
        this.getInspectionList();}
      },
      err => {
        this.alertService.errorAlert("Oops!","User Not Deleted");
       }
    )})    
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
