import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchlistComponent } from './branchlist/branchlist.component';
import { AddUserComponent } from '../users/add-user/add-user.component';
import { AddbranchComponent } from './addbranch/addbranch.component';

const routes: Routes = [
  {
    path: '',
    component: BranchlistComponent
  },
  {
    path: 'addBranch',
    component: AddbranchComponent
  },
  {
    path: 'editBranch',
    component: AddbranchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
