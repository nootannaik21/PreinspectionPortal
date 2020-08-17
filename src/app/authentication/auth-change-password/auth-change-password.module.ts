import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthChangePasswordRoutingModule } from './auth-change-password-routing.module';
import { AuthChangePasswordComponent } from './auth-change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthChangePasswordComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AuthChangePasswordRoutingModule
  ]
})
export class AuthChangePasswordModule { }
