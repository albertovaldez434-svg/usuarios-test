import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { IonItem } from "@ionic/angular/standalone";
import { FormsModule } from "@angular/forms";
import { CustomButtonComponent } from "../custom-button/custom-button.component";

@Component({
  selector: 'app-restore-psw',
  templateUrl: './restore-psw.component.html',
  styleUrls: ['./restore-psw.component.scss'],
  imports: [IonicModule, FormsModule, CustomButtonComponent]
})
export class RestorePswComponent implements OnInit {
  verPsw: boolean;
  verPswConf: boolean;
  pswMatch!: boolean;

  password1: string;
  password2: string;


  @Output() validatedPsw = new EventEmitter<string>();

  constructor() {
    this.verPsw = false;
    this.verPswConf = false;
    this.pswMatch = true;

    this.password1 = '';
    this.password2 = '';
  }

  ngOnInit() { }

  validatePswMatch() {
    if (this.password1 === this.password2) {
      this.pswMatch = true;
    } else {
      this.pswMatch = false;
    }
  }

  sendPswData() {
    this.validatedPsw.emit(this.password2);
  }

  clean() {
    this.password1 = '';
    this.password2 = '';
    this.pswMatch = true;
    this.verPsw = false;
    this.verPswConf = false;
  }

}
