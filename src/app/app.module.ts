import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { MenuComponent } from './components/menu/menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IonModalComponent } from './components/ion-modal/ion-modal.component';
import { LoadingInterceptor } from './interceptors/loading-interceptor';

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
    NgbModule
  ],
  providers: [
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
