import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from "@angular/core";
import { Router } from "@angular/router";
import * as Sentry from "@sentry/angular";
import { APP_INITIALIZER } from "@angular/core";

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './theme/shared/shared.module';

import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavTitleComponent } from './theme/layout/admin/nav-bar/nav-left/nav-title/nav-title.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';

/* Menu Items */
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { NgbButtonsModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AddbranchComponent } from './branch/addbranch/addbranch.component';
import { FormsModule } from '@angular/forms';
// import { PermissionDirective } from './helper/permission.directive';
// import { OnlystringDirective } from './helper/onlystring.directive';
// import { PermissionDirective } from './helper/permission.directive';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    NavigationComponent,
    NavContentComponent,
    NavGroupComponent,
    NavCollapseComponent,
    NavItemComponent,
    NavBarComponent,
    NavTitleComponent,
    NavLeftComponent,
    NavRightComponent,
    ConfigurationComponent,
    AddbranchComponent,
    // PermissionDirective,
    // OnlystringDirective,
    // OnlystringDirective,
  ],
  imports: [
    ToastrModule.forRoot(),
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    NavigationItem],
  bootstrap: [AppComponent]
})
export class AppModule { }
