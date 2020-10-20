import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/service/alert.service';
import { InspectionSeriveService } from 'src/app/service/inspection-serive.service';

@Component({
  selector: 'app-risk-type',
  templateUrl: './risk-type.component.html',
  styleUrls: ['./risk-type.component.scss'],
})
export class RiskTypeComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  riskTypeList: any;
  constructor(
    private inspectionService: InspectionSeriveService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      pageLength: 10,
      processing: true,
      dom: 'Blfrtip',
      buttons: ['excel'],
    };
    this.getAllRiskType();
  }
  getAllRiskType() {
    this.inspectionService.getAllRiskType().subscribe(
      (data) => {
        this.riskTypeList = data;
        this.rerender();
      },
      (err) => {}
    );
  }
  gotoAddRiskTypeScreen() {
    localStorage.removeItem('risktypeid');
    this.router.navigateByUrl('cms/addrisktype');
  }
  editRiskType(item) {
    localStorage.setItem('risktypeid', item.id);
    this.router.navigateByUrl('cms/editrisktype');
  }
  deleteRiskType(item) {
    this.alertService.confirmAlert(() => {
      this.inspectionService.deleteRiskType(item.id).subscribe(
        (data) => {
          this.alertService.successAlert(
            'Success',
            'Risk Type Deleted Successfully'
          );
          this.getAllRiskType();
        },
        (err) => {}
      );
    });
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
