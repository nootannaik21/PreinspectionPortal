import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportComponent } from './report/report.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    SharedModule,
    DataTablesModule,
  ]
})
export class ReportsModule { }
