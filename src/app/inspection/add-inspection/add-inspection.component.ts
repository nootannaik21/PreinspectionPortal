import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-inspection',
  templateUrl: './add-inspection.component.html',
  styleUrls: ['./add-inspection.component.scss']
})
export class AddInspectionComponent implements OnInit {
  inspectionData:any={};
  branches:any=[];
  branchCode:any=[];
  constructor() { }

  ngOnInit() {
  }

}
