// import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';
// import { dataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy,AfterViewInit {
  isAdd: boolean;
  title: string;
  // branch: Object;
  ngAfterViewInit(): void {
    this.item = [];
    this.rerender();
   }
  item: any = {};
  branch: any = {};
  formError: boolean;
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  @ViewChild('editBranchModal', { static: false })
  public editBranchmodal: ModalDirective;

  constructor(private router: Router) {
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

  ngOnInit(): void {
  }
  addUser() {
    this.router.navigateByUrl('user/addUser');
  }
  showAddModal() {
    this.isAdd = true;
    this.branch = {};
    this.editBranchmodal.show();
    this.title = "Create Branch";
  }

  showEditBranchModal(branchId) {
    this.isAdd = false;
    this.title = "Edit Branch";
    // this.dataService.getBranchById(branchId).subscribe((data) => {
    //   this.branch = data;
    //   this.editBranchmodal.show();
    // });
  }
  updateBranch(branchId, branchForm) {
    this.formError = false;
    if (branchForm.status == 'VALID') {
      //let formData: FormData = new FormData();
      // formData.append('BranchCode', this.branch.branchCode);
      // formData.append('BranchName', this.branch.branchName);
      // formData.append('Zone', this.branch.zone);
      let data = {
        "branchCode": this.branch.branchCode,
        "branchName": this.branch.branchName,
        "zone": this.branch.zone
      }
      if (this.isAdd) {
        // this.dataService.createBranch(data).subscribe(data => {
        //   this.editBranchmodal.hide();
        //   // this.getAllUser();
        //   this.dataService.getBranchList().subscribe((data) => {
        //     this.item = data;
        //   });
        //   this.formError = false;
        // }, err => {
        // });
      } else {
          // this.dataService.updateBranch(branchId, data).subscribe(data => {
          //   this.editBranchmodal.hide();
          //   // this.getAllUser();
          //   this.dataService.getBranchList().subscribe((data) => {
          //     this.item = data;
          //   });
          //   this.formError = false;
          // }, err => {
          // });
        }

      } else {
        this.formError = true;
      }
    }

    rerender(): void {
      if(this.isDtInitialized) {
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
