import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicSlides } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { CdkDrag, CdkDropList, CdkDropListGroup, DragDropModule } from '@angular/cdk/drag-drop';
import { SearchPipe } from 'src/app/search-pipe';

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
    SearchPipe
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule { }
