import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthResetPasswordRoutingModule } from './auth-reset-password-routing.module';
import { AuthResetPasswordComponent } from './auth-reset-password.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthResetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    AuthResetPasswordRoutingModule
  ]
})
export class AuthResetPasswordModule { }
