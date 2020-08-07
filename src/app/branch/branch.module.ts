import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchDetailComponent } from './branch-detail/branch-detail.component';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [BranchDetailComponent],
  imports: [
    DataTablesModule,
    CommonModule,
    BranchRoutingModule
  ]
})
export class BranchModule { }
