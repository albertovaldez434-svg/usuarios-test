import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { RegisterFormComponent } from "src/app/components/register-form/register-form.component";
import { CustomButtonComponent } from "src/app/components/custom-button/custom-button.component";
import { ThemeToggleComponent } from 'src/app/components/theme-toggle/theme-toggle.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    RegisterFormComponent,
    CustomButtonComponent,
    ThemeToggleComponent
],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
