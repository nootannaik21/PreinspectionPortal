import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddUserRoutingModule } from './add-user-routing.module';
import { AddUserComponent } from './add-user.component';
import {SharedModule} from '../../theme/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [AddUserComponent],
  imports: [
    NgMultiSelectDropDownModule,
    CommonModule,
    AddUserRoutingModule,
    SharedModule
  ]
})
export class AddUserModule { }
