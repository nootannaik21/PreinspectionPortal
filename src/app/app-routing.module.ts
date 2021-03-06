import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { BranchlistComponent } from './branch/branchlist/branchlist.component';
import { AuthGuard } from '../app/helper/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AuthComponent,
        loadChildren: () => import('./authentication/authentication.module').then(module => module.AuthenticationModule),
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(module => module.UsersModule),
      },
      {
        path: 'users/add-user',
        loadChildren: () => import('./users/add-user/add-user.module').then(module => module.AddUserModule)
      },
      {
        path: 'location',
        loadChildren: () => import('./branch/branch.module').then(module => module.BranchModule)
      },
      {
        path: 'vendor',
        loadChildren: () => import('./vendor/vendor.module').then(module => module.VendorModule)
      },
      {
        path: 'enquiry',
        loadChildren: () => import('./enquiry/enquiry.module').then(module => module.EnquiryModule)
      },
      {
        path: 'inspection',
        loadChildren: () => import('./inspection/inspection.module').then(module => module.InspectionModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./reports/reports.module').then(module => module.ReportsModule)
      },
      {
        path: 'cms',
        loadChildren: () => import('./cms/cms.module').then(module => module.CmsModule)
      },
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./authentication/authentication.module').then(module => module.AuthenticationModule)
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
