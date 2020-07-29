import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InspectionDetailComponent } from './inspection-detail/inspection-detail.component';


const routes: Routes = [
  {
    path:'',
    component:InspectionDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule { }
