import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosPageRoutingModule } from './usuarios-routing.module';

import { UsuariosPage } from './usuarios.page';

import { SearchPipe } from '../../search-pipe'
import { CustomButtonComponent } from "src/app/components/custom-button/custom-button.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosPageRoutingModule,
    ReactiveFormsModule,
    SearchPipe,
    CustomButtonComponent
],
  declarations: [UsuariosPage]
})
export class UsuariosPageModule {}
