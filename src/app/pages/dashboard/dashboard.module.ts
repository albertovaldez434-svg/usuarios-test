import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonRippleEffect } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { CdkDrag, CdkDropList, CdkDropListGroup, DragDropModule } from '@angular/cdk/drag-drop';
import { SearchPipe } from 'src/app/search-pipe';
import { CustomButtonComponent } from "src/app/components/custom-button/custom-button.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    SearchPipe,
    CustomButtonComponent
],
  declarations: [DashboardPage],
})
export class DashboardPageModule { }
