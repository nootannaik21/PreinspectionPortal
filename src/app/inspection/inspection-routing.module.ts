import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InspectionListComponent } from './inspection-list/inspection-list.component';
import { AddInspectionComponent } from './add-inspection/add-inspection.component';

const routes: Routes = [
  {
    path: '',
    component: InspectionListComponent
  },
  {
    path: 'addInspection',
    component: AddInspectionComponent
  },
  {
    path: 'editInspection',
    component: AddInspectionComponent
  },
  {
    path: 'viewInspection',
    component: AddInspectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule { }
