import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionRoutingModule } from './inspection-routing.module';
import { InspectionDetailComponent } from './inspection-detail/inspection-detail.component';


@NgModule({
  declarations: [InspectionDetailComponent],
  imports: [
    CommonModule,
    InspectionRoutingModule
  ]
})
export class InspectionModule { }
