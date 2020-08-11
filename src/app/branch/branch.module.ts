import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchlistComponent } from './branchlist/branchlist.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../theme/shared/shared.module';


@NgModule({
  declarations: [BranchlistComponent],
  imports: [
    DataTablesModule,
    FormsModule,
    SharedModule,
    CommonModule,
    BranchRoutingModule
  ]
})
export class BranchModule { }
