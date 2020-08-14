import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthResetPasswordRoutingModule } from './auth-reset-password-routing.module';
import { AuthResetPasswordComponent } from './auth-reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthResetPasswordComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AuthResetPasswordRoutingModule
  ]
})
export class AuthResetPasswordModule { }
