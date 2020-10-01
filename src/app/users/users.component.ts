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
      // columnDefs: [
      //   { "width": "14%", "targets": [0,1,2,3,4,5,6] }
      // ],
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
          res.status = false;
        }
        else {
          res.status = true;
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
  // showSuccess() {
  //   this.toastr.success('Hello world!', 'Toastr fun!');
  // }
  // showToasterSuccess() {
  //   this.notifyService.showSuccess("Data shown successfully !!", "Success")
  // }

  // showToasterError() {
  //   this.notifyService.showError("Something is wrong", "ItSolutionStuff.com")
  // }

  // showToasterInfo() {
  //   this.notifyService.showInfo("This is info", "ItSolutionStuff.com")
  // }

  // showToasterWarning() {
  //   this.notifyService.showWarning("This is warning", "ItSolutionStuff.com")
  // }
  getUSerList() {
    this.userapiService.getUserList().subscribe(
      data => {
        this.rerender();
        this.userList = data;
        // this.userList.forEach(element => {
        //   if (element.isDeleted == true) {
        //     return this.userList[0].isDeleted = "Active";
        //   }
        //   else {
        //    return this.userList[0].isDeleted = "De Active";
        //   }
        // });

        // if(this.userList.isDeleted==true){
        //   this.userList.status==true;
        // }
        // else{
        //   this.userList.status==false;
        // }
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
            // this.alertService.successAlert("Success", res.message);
            this.getUSerList();
          },
          err => {
            // this.alertService.errorAlert("Oops!", "User Not Deleted");
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
    // this.value = entry;
  }
}
