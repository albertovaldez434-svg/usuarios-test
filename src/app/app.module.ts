import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, IonRippleEffect } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { MenuComponent } from './shared/menu/menu.component';
import { IonModalComponent } from './shared/ion-modal/ion-modal.component';
import { LoadingInterceptor } from './interceptors/loading-interceptor';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormComponent } from './shared/register-form/register-form.component';
import { ThemeToggleComponent } from './shared/theme-toggle/theme-toggle.component';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";
import { ActionModalComponent } from "./shared/action-modal/action-modal.component";
import { ErrorsInterceptor } from './interceptors/errors-interceptor';
import { timeoutInterceptor } from './interceptors/timeout-interceptor';


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
    
    RegisterFormComponent,
    ThemeToggleComponent,
    CdkDragPlaceholder,
    ActionModalComponent
],
  providers: [
    provideHttpClient(withInterceptors([timeoutInterceptor]), withInterceptorsFromDi()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true}
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
