import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';

const routes: Routes = [
  {
    path:'',
    component:EnquiryListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnquiryRoutingModule { }
