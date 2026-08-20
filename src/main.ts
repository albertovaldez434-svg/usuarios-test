/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { timeoutInterceptor } from './app/interceptors/timeout-interceptor';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { AuthInterceptor } from './app/interceptors/auth-interceptor';
import { LoadingInterceptor } from './app/interceptors/loading-interceptor';
import { ErrorsInterceptor } from './app/interceptors/errors-interceptor';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, IonicModule.forRoot({
            swipeBackEnabled: false
        }), AppRoutingModule, ReactiveFormsModule, CdkDragPlaceholder),
        provideHttpClient(withInterceptors([timeoutInterceptor]), withInterceptorsFromDi()),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true }
    ]
}).catch(err => console.log(err));
