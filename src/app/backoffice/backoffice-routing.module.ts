import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { BackofficeComponent } from './backoffice.component';
import { UserComponent } from './user/user.component';
import { ProductAdminComponent } from '../productadmin/productadmin.component';
const routes: Routes = [
 // { path: 'dashboard', component: DashboardComponent },

  { path: '', component: BackofficeComponent, children: [
    { path: 'dashboard', component: DashboardComponent },
    {path: 'user', component: UserComponent },
    {path: 'productA', component: ProductAdminComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ] 
}

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
