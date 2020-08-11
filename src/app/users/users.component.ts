import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserapiserviceService } from '../service/userapiservice.service'
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AlertService } from '../service/alert.service';
@Component({
  selector: 'app-tbl-datatable',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  userList: any = [];
  ngAfterViewInit(): void {
    this.userList = [];
    this.rerender();
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  constructor(private router: Router, private userapiService: UserapiserviceService, private alertService:AlertService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      pageLength: 10,
    };
    this.getUSerList();

  }
  getUSerList() {
    debugger
    this.userapiService.getUserList().subscribe(
      data => {
        debugger
        this.userList = data;
        this.rerender();
      },
      err => {

      }
    )
  }
  editUserRow(item) {
    debugger;
    localStorage.setItem('userid', item.id);
    this.router.navigateByUrl('users/addUser');
  }
  deleteUser(item) {
    debugger;
    this.userapiService.deleteUser(item.id).subscribe(
      data => {
        debugger
        var res :any =data;
        this.alertService.successAlert("Success",res.message);
        this.getUSerList();
      },
      err => {
        this.alertService.errorAlert("Oops!","User Not Deleted");
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
  gotoAddUserScreen(){
      localStorage.removeItem('userid')
      this.router.navigateByUrl('users/addUser');
    }
}
