import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorlistComponent } from './vendorlist/vendorlist.component';
import { AddvendorComponent } from './addvendor/addvendor.component';
import { SharedModule } from '../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [VendorlistComponent, AddvendorComponent],
  imports: [
    NgMultiSelectDropDownModule,
    CommonModule,
    SharedModule,
    DataTablesModule,
    FormsModule,
    VendorRoutingModule
  ]
})
export class VendorModule { }
