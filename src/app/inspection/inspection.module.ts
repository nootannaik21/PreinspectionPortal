import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionRoutingModule } from './inspection-routing.module';
import { AddInspectionComponent } from './add-inspection/add-inspection.component';
import { InspectionListComponent } from './inspection-list/inspection-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import {NgxImageCompressService} from 'ngx-image-compress';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [AddInspectionComponent, InspectionListComponent],
  imports: [
    SharedModule,
    FormsModule,
    DataTablesModule,
    CommonModule,
    InspectionRoutingModule,
    PdfViewerModule
  ],
  providers:[
    NgxImageCompressService
  ]
})
export class InspectionModule { }
