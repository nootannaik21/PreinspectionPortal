import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {
    path: '',
    component: AuthComponent,
    loadChildren: () => import('./authentication/authentication.module').then(module => module.AuthenticationModule)
}
]
  },
  {
    path: '',
    component: AdminComponent,
    // canActivate:AuthGuard
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(module => module.UserModule)
      },
      {
        path: 'inspection',
        loadChildren: () => import('./inspection/inspection.module').then(module => module.InspectionModule)
      },
      {
        path: 'enquiry',
        loadChildren: () => import('./enquiry/enquiry.module').then(module => module.EnquiryModule)
      },
      {
        path: 'vendor',
        loadChildren: () => import('./vendor/vendor.module').then(module => module.VendorModule)
      },
      {
        path: 'branch',
        loadChildren: () => import('./branch/branch.module').then(module => module.BranchModule)
      },
      {
        path: 'sample-page',
        loadChildren: () => import('./demo/pages/sample-page/sample-page.module').then(module => module.SamplePageModule)
      }
    ]
  },
  {
    path: 'login',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./authentication/authentication.module').then(module => module.AuthenticationModule)
      },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
