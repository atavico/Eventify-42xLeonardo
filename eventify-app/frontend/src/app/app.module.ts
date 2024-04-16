import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule} from '@angular/cdk/layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MyErrorStateMatcher } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuTrigger } from '@angular/material/menu';
import { Global } from './global';
import { AdminComponent } from './admin/admin.component';
import { RouterModule, Routes } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from 'ngx-cookie';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AccountComponent } from './account/account.component';
import { EventPageComponent } from './event-page/event-page.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatMenuModule } from '@angular/material/menu';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    EventPageComponent,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    LayoutModule,
    AdminComponent,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    CookieModule.forRoot(),
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    GoogleMapsModule,
  ],
  exports: [RouterModule],
  providers: [
    AuthService,
    Global,
    { provide: MyErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
