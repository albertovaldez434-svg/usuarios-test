/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';

import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';


import { AppComponent } from './app/app.component';
import { routes } from './app.routes';

import { timeoutInterceptor } from './app/interceptors/timeout-interceptor';
import { AuthInterceptor } from './app/interceptors/auth-interceptor';
import { LoadingInterceptor } from './app/interceptors/loading-interceptor';
import { ErrorsInterceptor } from './app/interceptors/errors-interceptor';


bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        importProvidersFrom(
            IonicModule.forRoot({ swipeBackEnabled: false })
        ),
        provideHttpClient(withInterceptors([timeoutInterceptor]), withInterceptorsFromDi()),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true }
    ]
}).catch(err => console.log(err));
