import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InspectionDetailComponent } from './inspection-detail/inspection-detail.component';
import { CreateInspectionComponent } from './create-inspection/create-inspection.component';


const routes: Routes = [
  {
    path:'',
    component:InspectionDetailComponent
  },
  {
    path:'createInspection',
    component:CreateInspectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule { }
