import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddUserRoutingModule } from './add-user-routing.module';
import { AddUserComponent } from './add-user.component';
import {SharedModule} from '../../theme/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [AddUserComponent],
  imports: [
    NgMultiSelectDropDownModule,
    CommonModule,
    AddUserRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class AddUserModule { }
