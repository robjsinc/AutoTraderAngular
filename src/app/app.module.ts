import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HttpClientModule } from '@angular/common/http';
import { BottomNavbarComponent } from './bottom-navbar/bottom-navbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SearchPageComponent } from './search-page/search-page.component';
import { MatSidenavModule, MatDialogModule, MatCardModule, MatInputModule } from '@angular/material';
import { DataServiceComponent } from './data-service/data-service.component';
import { VehicleModel } from './models/vehicle.model';
import { DialogComponent } from './dialog/dialog.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { VehiclePageComponent } from './vehicle-page/vehicle-page.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule  } from '@angular/forms';
import { ConstantsServiceComponent } from './constants-service/constants-service.component'

@NgModule({
  declarations: [
    AppComponent,
    BottomNavbarComponent,
    TopNavbarComponent,
    MainPageComponent,
    SearchPageComponent,
    DataServiceComponent,
    DialogComponent,
    VehiclePageComponent
  ],
  entryComponents: [
    DialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    NoopAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [
    DataServiceComponent,
    VehicleModel,
    ConstantsServiceComponent,
    { provide: LocationStrategy,
    useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
