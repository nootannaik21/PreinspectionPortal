import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsRoutingModule } from './cms-routing.module';
import { RiskTypeComponent } from './risk-type/risk-type.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { InspectionStatusComponent } from './inspection-status/inspection-status.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../theme/shared/shared.module';
import { RiskTypeActionComponent } from './risk-type-action/risk-type-action.component';
import { ProductTypeActionComponent } from './product-type-action/product-type-action.component';

@NgModule({
  declarations: [RiskTypeComponent, ProductTypeComponent, InspectionStatusComponent,RiskTypeActionComponent, ProductTypeActionComponent],
  imports: [
    CommonModule,
    CmsRoutingModule,
    FormsModule,
    SharedModule,
    DataTablesModule,
  ]
})
export class CmsModule { }
