import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BranchServiceService } from '../../service/branch-service.service'
import { AlertService } from 'src/app/service/alert.service';
import { Router } from '@angular/router';


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
  dtOptions: any = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  constructor(private router:Router, private branchService:BranchServiceService,private alertService:AlertService) { }

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
    localStorage.setItem('branchid', item.id);
    this.router.navigateByUrl('location/editLocation');
  }
  deleteBranch(item){
    this.alertService.confirmAlert(() => {
    this.branchService.deleteBranch(item.id).subscribe(
      data =>{
        this.alertService.successAlert("Success", "Location Successfully");
        this.getAllBranches();

      },
      err =>{

      }
    )})

  }
  gotoAddBranchScreen(){
    localStorage.removeItem('branchid');
    this.router.navigateByUrl('location/addLocation');
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
