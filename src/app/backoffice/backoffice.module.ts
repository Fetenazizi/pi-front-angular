import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { UserComponent } from './user/user.component';
import { BackofficeComponent } from './backoffice.component';
import { UserFormComponent } from './user-form/user-form.component';
@NgModule({
  declarations: [
    BackofficeComponent,
    DashboardComponent,
    UserComponent,
    UserFormComponent,
    
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    
    
  ]
})
export class BackofficeModule { }
