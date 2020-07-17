import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchDetailComponent } from './branch-detail/branch-detail.component';


const routes: Routes = [
  {
    path:'',
    component:BranchDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
