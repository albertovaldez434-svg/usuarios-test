import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosPageRoutingModule } from './usuarios-routing.module';

import { UsuariosPage } from './usuarios.page';

import { SearchPipe } from '../../search-pipe'
import { CustomButtonComponent } from "src/app/components/custom-button/custom-button.component";
import { RegisterFormComponent } from "src/app/components/register-form/register-form.component";
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosPageRoutingModule,
    ReactiveFormsModule,
    SearchPipe,
    CustomButtonComponent,
    RegisterFormComponent,
    CdkDragPlaceholder
],
  declarations: [UsuariosPage]
})
export class UsuariosPageModule {}
