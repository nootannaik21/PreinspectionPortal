import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserapiserviceService } from '../service/userapiservice.service'
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AlertService } from '../service/alert.service';
import { NotificationService } from '../service/notification.service'
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tbl-datatable',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'toaster-not';
  userList: any = [];
  checkBox:any;
  ngAfterViewInit(): void {
    this.userList = [];
    this.rerender();
  }
  dtOptions: any = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  public options = [
    { value: "on", id: "On" },
    { value: "off", id: "Off" },
  ]
  constructor(private notifyService: NotificationService, private router: Router, private userapiService: UserapiserviceService, private alertService: AlertService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      pageLength: 10,
      processing: true,
        dom: 'Blfrtip',
          buttons: [
              'excel'
          ]
    };
    this.getUSerList();
    
  }
  changeStatus(id,state) {
    this.userapiService.getUserById(id).subscribe(
      data => {
        var res: any = data;
        if (res.isDeleted == true) {
          res.status = true;
        }
        else {
          res.status = false;
        }
        this.userapiService.updateUser(res.id, res).subscribe(
          data => {
            this.getUSerList();
          },
          err => [
          ]
        )
      }
    )
  }
  getUSerList() {
    this.userapiService.getUserList().subscribe(
      data => {
        this.rerender();
        this.userList = data;
      },
      err => {
      }
    )
  }

  editUserRow(item) {
    if (!item.isDeleted) {
      localStorage.setItem('userid', item.id)
      this.router.navigateByUrl('users/editUser');
    }
  }
  deleteUser(item) {
    if (!item.isDeleted) {
      this.alertService.confirmAlert(() => {
        this.userapiService.deleteUser(item.id).subscribe(
          data => {
            var res: any = data;
            this.notifyService.showSuccess("User Deleted successfully !!", "Success");
            this.getUSerList();
          },
          err => {
            this.notifyService.showError("Something is wrong", "User Not Deleted");
          }
        )
      })
    }
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
  gotoAddUserScreen() {
    localStorage.removeItem('userid')
    this.router.navigateByUrl('users/addUser');
  }
  onSelectionChange(entry) {
  }
}
