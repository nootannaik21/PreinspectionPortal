import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor/vendor.component';
import { SharedModule } from '../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [VendorComponent],
  imports: [
    DataTablesModule,
    SharedModule,
    CommonModule,
    VendorRoutingModule
  ]
})
export class VendorModule { }
