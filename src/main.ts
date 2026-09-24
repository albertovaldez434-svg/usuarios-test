/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';

import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HTTP_INTERCEPTORS, withXhr } from '@angular/common/http';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from '@angular/router';
import { provideIonicAngular } from "@ionic/angular";

import { AppComponent } from './app/app.component';
import { routes } from './app.routes';

import { timeoutInterceptor } from './app/core/interceptors/timeout-interceptor';
import { AuthInterceptor } from './app/core/interceptors/auth-interceptor';
import { LoadingInterceptor } from './app/core/interceptors/loading-interceptor';
import { ErrorsInterceptor } from './app/core/interceptors/errors-interceptor';


bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(), provideRouter(routes, withPreloading(PreloadAllModules)),
        provideIonicAngular({ mode: 'md' }),
        provideHttpClient(withXhr(), withInterceptors([timeoutInterceptor]), withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true }
    ]
}).catch(err => console.log(err));
