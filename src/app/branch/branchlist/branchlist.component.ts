import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BranchServiceService } from '../../service/branch-service.service'
import { AlertService } from 'src/app/service/alert.service';


@Component({
  selector: 'app-branchlist',
  templateUrl: './branchlist.component.html',
  styleUrls: ['./branchlist.component.scss']
})
export class BranchlistComponent implements OnInit, OnDestroy, AfterViewInit {
  branchList:any=[];
  ngAfterViewInit(): void {
    this.branchList = [];
    this.rerender();
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  constructor(private branchService:BranchServiceService,private alertService:AlertService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      pageLength: 10,
    };
    this.getAllBranches();
  }
  getAllBranches() {
    this.branchService.getBranches().subscribe(
      data =>{
        var res:any=data;
        this.branchList=res.data;
        this.rerender();
      },
      err =>{

      }
    )
    
  }
  editBranchRow(item){

  }
  deleteBranch(item){
    this.branchService.deleteBranch(item.id).subscribe(
      data =>{
        this.alertService.successAlert("Success","Branch Deleted Successfully");
        this.getAllBranches();

      },
      err =>{

      }
    )

  }
  gotoAddBranchScreen(){

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
