import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { IonicModule, ModalController } from "@ionic/angular";
import { IonItem } from "@ionic/angular/standalone";
import { FormsModule } from "@angular/forms";
import { CustomButtonComponent } from "../custom-button/custom-button.component";

@Component({
  selector: 'app-restore-psw',
  templateUrl: './restore-psw.component.html',
  styleUrls: ['./restore-psw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FormsModule, CustomButtonComponent]
})
export class RestorePswComponent implements OnInit {
  @Input() title: string = '';
  @Input() warning: boolean = false;
  @Output() validatedPsw = new EventEmitter<string>();
  verPsw: boolean;
  verPswConf: boolean;
  pswMatch!: boolean;

  password1: string;
  password2: string;

  displayWarning = signal<boolean>(true);
  constructor(
    private modalCtrl: ModalController
  ) {
    this.verPsw = false;
    this.verPswConf = false;
    this.pswMatch = true;

    this.password1 = '';
    this.password2 = '';
  }

  ngOnInit() {
    setTimeout(() => {
      this.displayWarning.set(false);
    }, 3000)
  }

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
    this.modalCtrl.dismiss();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
