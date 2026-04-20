import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios';
import { Login } from 'src/app/models/login';
import { ModalController } from '@ionic/angular';
import { IonModalComponent } from 'src/app/components/ion-modal/ion-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  valid: boolean = true;

  constructor(
    private builder: FormBuilder,
    private UserService: UsuariosService,
    private route: Router,
    private modalCtrl: ModalController
  ) {
    this.loginForm = this.builder.group({
      Usuario: [''],
      Password: ['']
    });
  }

  ngOnInit() {
  }

  get f() { return this.loginForm.controls; }

  async openModalFunc(mensaje: string) {
    const modal = this.modalCtrl.create({
      component: IonModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.5,
      componentProps: {
        mensaje: mensaje
      }
      
    });

    (await modal).present();
  }

  async loginFunction() {
    const userName = this.loginForm.value.Usuario;
    const Password = this.loginForm.value.Password;

    if (userName == null || userName == '' || Password == null || Password == '') {
      this.openModalFunc('Datos incorrectos, por favor ingrese un usuario y contraseña válidos');
      return;
    }

    const loginRrquest: Login = {
      Usuario: userName,
      Password: Password
    };

    try {
      const userInfo = await this.UserService.Login(loginRrquest);
      if (userInfo != null) {
        this.UserService.setLogin(userInfo);
        this.openModalFunc('Sesion iniciada');
        this.route.navigate(['/usuarios']);
      }
    } catch (error) {
      this.openModalFunc('Ha ocurrido un error al iniciar sesión, por favor intente nuevamente');
      console.log(error);
    }
  }

  registerFunction() {
    this.openModalFunc('Función de registro aún no implementada');
    return;
  }

}
