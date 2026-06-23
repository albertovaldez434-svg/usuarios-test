import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { RegisterFormComponent } from "src/app/components/register-form/register-form.component";
import { CustomButtonComponent } from "src/app/components/custom-button/custom-button.component";
import { ThemeToggleComponent } from "src/app/components/theme-toggle/theme-toggle.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginPageRoutingModule,
    RegisterFormComponent,
    CustomButtonComponent,
    ThemeToggleComponent
],
  declarations: [LoginPage]
})
export class LoginPageModule {}
