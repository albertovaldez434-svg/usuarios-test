import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RegisterFormComponent } from '../../shared/register-form/register-form.component';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.page.html',
    styleUrls: ['./registro.page.scss'],
    imports: [IonicModule, RegisterFormComponent]
})
export class RegistroPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
