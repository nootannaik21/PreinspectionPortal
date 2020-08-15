import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedModule } from '../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { TblSearchingComponent } from './tbl-searching/tbl-searching.component';


@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
  ],
  declarations: [UsersComponent, TblSearchingComponent]
})
export class UsersModule { }
