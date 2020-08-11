import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-tbl-datatable',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dtRouterLinkOptions: any = {};

  constructor() { }

  ngOnInit() {
    this.dtRouterLinkOptions = {
      ajax: 'fake-data/datatable-data.json',
      columns: [{
        title: 'Username',
        data: 'name'
      }, {
        title: 'First Name',
        data: 'position'
      }, {
        title: 'Last Name',
        data: 'office'
      }, {
        title: 'Email ID',
        data: 'age'
      }, {
        title: 'Company',
        data: 'date'
      }, {
        title: 'Phone Number',
        data: 'salary'
      }, {
        title: 'Action',
        render: function (data: any, type: any, full: any) {
          return '<i _ngcontent-fuw-c94="" classname="tooltipstext" title="Edit User" class="feather icon-edit pr-3" style="cursor: pointer;"></i> &nbsp; <i _ngcontent-fuw-c94="" classname="tooltipstext" title="Delete User" class="feather icon-trash-2 pr-3" style="cursor: pointer;"></i>';
        }
      }],
      dom: 'Bfrtip',
      buttons: [
        'print',
        'excel',
        'csv'
      ],
      responsive: true,
    };
  }

}
