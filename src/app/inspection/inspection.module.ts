import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionRoutingModule } from './inspection-routing.module';
import { InspectionDetailComponent } from './inspection-detail/inspection-detail.component';
import { SharedModule } from '../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { CreateInspectionComponent } from './create-inspection/create-inspection.component';


@NgModule({
  declarations: [InspectionDetailComponent, CreateInspectionComponent],
  imports: [
    DataTablesModule,
    SharedModule,
    CommonModule,
    InspectionRoutingModule
  ]
})
export class InspectionModule { }
