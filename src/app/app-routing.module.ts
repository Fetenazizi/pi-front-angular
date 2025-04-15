import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import {HomeComponent} from './home/home.component';
import {PregnancyTrackingComponent} from './pregnancy-tracking/pregnancy-tracking.component';
import {BabySittingComponent} from './baby-sitting/baby-sitting.component';
import {AlimentationComponent} from './alimentation/alimentation.component';
import {AppointmentComponent} from './appointment/appointment.component';
import {ShopComponent} from './shop/shop.component';
import { CoachingComponent } from './coaching/coaching.component';
import { CartComponent } from './cart/cart.component';
import { ProductAdminComponent } from './productadmin/productadmin.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirection au chargement
  {path: 'about', component: AboutComponent},
  { path: 'home', component: HomeComponent },
  { path: 'PregnancyTracking', component: PregnancyTrackingComponent  },
  { path: 'backoffice', loadChildren: () => import('./backoffice/backoffice.module').then(m => m.BackofficeModule) },
  { path: 'BabySitting', component:BabySittingComponent },
  {path: 'Alimentation', component:AlimentationComponent},
  {path: 'Appointment' , component:AppointmentComponent},
  {path: 'Shop' , component:ShopComponent},
  {path :'Coaching' , component:CoachingComponent},
  {path :'Cart' , component:CartComponent}
  ,{path :'Productadmin' , component:ProductAdminComponent}


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes),   RouterModule  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
