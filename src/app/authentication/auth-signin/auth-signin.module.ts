import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthSigninRoutingModule } from './auth-signin-routing.module';
import { AuthSigninComponent } from './auth-signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthSigninComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AuthSigninRoutingModule
  ]
})
export class AuthSigninModule { }
