import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthChangePasswordRoutingModule } from './auth-change-password-routing.module';
import { AuthChangePasswordComponent } from './auth-change-password.component';

@NgModule({
  declarations: [AuthChangePasswordComponent],
  imports: [
    CommonModule,
    AuthChangePasswordRoutingModule
  ]
})
export class AuthChangePasswordModule { }
