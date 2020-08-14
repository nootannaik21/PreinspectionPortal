import { Component, OnInit } from '@angular/core';
import { VendorServiceService } from 'src/app/service/vendor-service.service';
import { Router } from '@angular/router';
import { userService } from 'src/app/service/user.service';
import { UserapiserviceService } from 'src/app/service/userapiservice.service';

@Component({
  selector: 'app-addvendor',
  templateUrl: './addvendor.component.html',
  styleUrls: ['./addvendor.component.scss']
})
export class AddvendorComponent implements OnInit {
  vendordata:any={};
  branches: any = [];

  dropdownList: any = [];
  branch: any = [];
  selectedItems = [];
  dropdownSettings: any = [];
  branchCodes: any = [];
  constructor(private userapiService: UserapiserviceService ,private vendorService: VendorServiceService,) { }

  ngOnInit() {
    this.userapiService.getBranches().subscribe(
      data => {
        var res: any = data;
        this.branches = res.data;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'id',
          textField: 'branchCode',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          // allowSearchFilter: true
        };
      },
      err => {
      }
    )
  }
  onItemSelect(item: any) {
    console.log(item);
    this.branchCodes.push(item.id);
    // this.branchCodes.push(item.id);
    // this.userdata.branchlist = this.branchCodes.map(String);
  }
  onSelectAll(items: any) {
    console.log(items);
    items.forEach(element => {
      var temp: any = {};
      temp.branchlist = element.id
      this.branchCodes.push(temp);
    });
    // this.userdata.branchlist = this.branchCodes.map(String);
  }
}
