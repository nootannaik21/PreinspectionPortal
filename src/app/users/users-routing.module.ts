import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsersComponent} from './users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent
  },
  {
    path: 'addUser',
    component: AddUserComponent
  },
  { 
    path: 'changePassword',
    component: ChangepasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
