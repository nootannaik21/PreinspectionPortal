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
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.component.html',
  styleUrls: ['./inspection-list.component.scss'],
})
export class InspectionListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  inspectionList: any = [];
  image: string | ArrayBuffer;
  base64textString: string;
  ngAfterViewInit(): void {
    this.inspectionList = [];
    this.rerender();
  }
  dtOptions: any = {};
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
      processing: true,
      dom: 'Bfrtip',
      buttons: ['excel'],
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
    this.router.navigateByUrl('inspection/viewInspection');
  }

  editInspectionRow(item) {
    localStorage.setItem('inspectionId', item.id);
    localStorage.setItem('view', 'Edit');
    this.router.navigateByUrl('inspection/editInspection');
  }
  downloadDoc(evt) {
    // var firstSpaceIndex = evt.indexOf("\\");
    // var firstString = evt.substring(0, firstSpaceIndex); // INAGX4
    // var secondString = evt.substring(firstSpaceIndex + 1);
    debugger;
    //var FileSaver = require('file-saver');
    var fileStr = evt.split(',');
    fileStr.forEach((element) => {
      this.inspectionService.downloadDocument(element).subscribe(
        (data) => {
          debugger;
          var res: any = data;

          //var blob = new Blob([res]);
          var blob = new Blob([data], { type: res.type });

          const element = document.createElement('a');
          element.href = URL.createObjectURL(blob);
          element.download = 'downloaded_file.pdf';
          document.body.appendChild(element);

          if (res.type == 'application/pdf')
            window.open(element.href, '_blank');
          else {
            //element.click();
            saveAs(blob);
          }
        },
        (err) => {}
      );
    });
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
