import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthChangePasswordRoutingModule } from './auth-change-password-routing.module';
import { AuthChangePasswordComponent } from './auth-change-password.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthChangePasswordComponent],
  imports: [
    FormsModule,
    CommonModule,
    AuthChangePasswordRoutingModule
  ]
})
export class AuthChangePasswordModule { }
