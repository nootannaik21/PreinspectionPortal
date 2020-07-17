import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchDetailComponent } from './branch-detail/branch-detail.component';


@NgModule({
  declarations: [BranchDetailComponent],
  imports: [
    CommonModule,
    BranchRoutingModule
  ]
})
export class BranchModule { }
