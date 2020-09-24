import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionRoutingModule } from './inspection-routing.module';
import { AddInspectionComponent } from './add-inspection/add-inspection.component';
import { InspectionListComponent } from './inspection-list/inspection-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [AddInspectionComponent, InspectionListComponent],
  imports: [
    SharedModule,
    FormsModule,
    DataTablesModule,
    CommonModule,
    InspectionRoutingModule,
    
  ]
})
export class InspectionModule { }
