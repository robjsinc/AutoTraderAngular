import { NgModule } from '@angular/core';
import { MainPageComponent } from './main-page/main-page.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './search-page/search-page.component';
import { VehiclePageComponent } from './vehicle-page/vehicle-page.component';

const appRoutes: Routes = [
  { path: 'vehicle/:vehicleID', component: VehiclePageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'main', component: MainPageComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

