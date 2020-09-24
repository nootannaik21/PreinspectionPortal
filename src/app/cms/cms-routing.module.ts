import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductTypeActionComponent } from './product-type-action/product-type-action.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { RiskTypeActionComponent } from './risk-type-action/risk-type-action.component';
import { RiskTypeComponent } from './risk-type/risk-type.component';


const routes: Routes = [
  {
    path:'',
    component:RiskTypeComponent
  },
  {
  path:'risktype',
  component:RiskTypeComponent
},
{
  path:'risktypeaction',
  component:RiskTypeActionComponent
},
{
  path:'producttype',
  component:ProductTypeComponent
},
{
  path:'producttypeaction',
  component:ProductTypeActionComponent
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
