import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../service/alert.service';
import { InspectionSeriveService } from '../../service/inspection-serive.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.component.html',
  styleUrls: ['./inspection-list.component.scss'],
})
export class InspectionListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  inspectionList: any = [];
  ngAfterViewInit(): void {
    this.inspectionList = [];
    this.rerender();
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  constructor(
    private notifyService: NotificationService,
    private router: Router,
    private inspectionService: InspectionSeriveService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      pageLength: 10,
    };
    this.getInspectionList();
  }
  downloadInspectionDetails(item) {
    localStorage.setItem('inspectionId', item.id);
    this.router.navigateByUrl('inspection/addInspection');
  }
  viewInspection(item) {
    localStorage.setItem('inspectionId', item.id);
    localStorage.setItem('view', 'View');
    this.router.navigateByUrl('inspection/addInspection');
  }

  editInspectionRow(item) {
    localStorage.setItem('inspectionId', item.id);
    localStorage.setItem('view', 'Edit');
    this.router.navigateByUrl('inspection/addInspection');
  }
  getInspectionList() {
    this.inspectionService.getInspectionList().subscribe(
      (data) => {
        var res: any = data;
        this.inspectionList = res.data;
        this.rerender();
      },
      (err) => {}
    );
  }
  gotoAddInspectionScreen() {
    localStorage.removeItem('inspectionId');
    this.router.navigateByUrl('inspection/addInspection');
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
