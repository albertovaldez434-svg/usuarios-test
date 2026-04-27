import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MenuComponent } from './components/menu/menu.component';
import { IonModalComponent } from './components/ion-modal/ion-modal.component';
import { LoadingInterceptor } from './interceptors/loading-interceptor';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    IonModalComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({
      swipeBackEnabled: false
    }), 
    AppRoutingModule, 
    ReactiveFormsModule,
    RegisterFormComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
