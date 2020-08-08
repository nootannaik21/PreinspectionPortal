import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthResetPasswordRoutingModule } from './auth-reset-password-routing.module';
import { AuthResetPasswordComponent } from './auth-reset-password.component';

@NgModule({
  declarations: [AuthResetPasswordComponent],
  imports: [
    CommonModule,
    AuthResetPasswordRoutingModule
  ]
})
export class AuthResetPasswordModule { }
