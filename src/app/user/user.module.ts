import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { SharedModule } from '../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [UserListComponent, AddUserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    DataTablesModule
  ]
})
export class UserModule { }
