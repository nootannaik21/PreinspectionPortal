import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnquiryRoutingModule } from './enquiry-routing.module';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../theme/shared/shared.module';


@NgModule({
  declarations: [EnquiryListComponent],
  imports: [
    DataTablesModule,
    FormsModule,
    SharedModule,
    CommonModule,
    EnquiryRoutingModule
  ]
})
export class EnquiryModule { }
