import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorlistComponent } from './vendorlist/vendorlist.component';
import { AddvendorComponent } from './addvendor/addvendor.component';

const routes: Routes = [
  {
    path: '',
    component: VendorlistComponent
  },
  {
    path: 'addVendor',
    component: AddvendorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
