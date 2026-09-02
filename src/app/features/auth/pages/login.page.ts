import { Component, OnInit, inject, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { IonicModule, IonModal, ModalController } from "@ionic/angular";
import { switchMap, forkJoin } from "rxjs";
import { Users } from "src/app/features/users/models/users";
import { UsuariosService } from "src/app/features/users/services/usuarios";
import { CustomButtonComponent } from "src/app/shared/components/custom-button/custom-button.component";
import { CustomInputComponent } from "src/app/shared/components/custom-input/custom-input.component";
import { IonModalComponent } from "src/app/shared/components/ion-modal/ion-modal.component";
import { RegisterFormComponent } from "src/app/shared/components/register-form/register-form.component";
import { TasksService } from "../../dashboard/services/tasks-service";
import { Login } from "../models/login";
import { loginResponseDTO } from "../models/loginDTO";
import { AuthService } from "../services/auth-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CustomButtonComponent, CustomInputComponent]
})
export class LoginPage implements OnInit {
  private authService = inject(AuthService);
  private UserService = inject(UsuariosService);
  private TasksService = inject(TasksService);

  @ViewChild('restorePswMdl') restorePswMdl!: IonModal;
  loginForm: FormGroup;
  valid: boolean = true;

  constructor(
    private builder: FormBuilder,
    private route: Router,
    private modalCtrl: ModalController
  ) {
    this.loginForm = this.builder.group({
      Email: [''],
      Password: ['']
    });
  }

  ngOnInit() {
  }

  get f() { return this.loginForm.controls; }

  async openModalFunc(titulo: string, mensaje: string) {
    const modal = this.modalCtrl.create({
      component: IonModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.5,
      cssClass: 'custom-modal',
      componentProps: {
        titulo: titulo,
        mensaje: mensaje
      }

    });

    (await modal).present();
  }

  loginFunction() {
    //// console.log('Iniciando Login')
    const Mail = this.loginForm.value.Email;
    const Password = this.loginForm.value.Password;

    if (Mail == null || Mail == '' || Password == null || Password == '') {
      this.openModalFunc('Error', 'Datos incorrectos, por favor ingrese un usuario y contraseña válidos');
      return;
    }

    const loginRrquest: Login = {
      Email: Mail,
      Password: Password
    };

    this.authService.Login(loginRrquest).pipe(
      switchMap(user =>
        forkJoin({
          users: this.UserService.getUsers(),
          tasks: this.TasksService.cargarTareasUsuario(user.idUser)
        })
      )
    ).subscribe({
      next: () => {
        //// console.log(this.UserService.loggedData$());
        this.route.navigate(['/dashboard']);
      }
    });
  }

  async registerFunction() {
    const modal = this.modalCtrl.create({
      component: RegisterFormComponent,
      breakpoints: [0, 0.25, 0.5, 0.75, 0.85],
      initialBreakpoint: 0.85,
      cssClass: 'custom-modal',
      componentProps: {
        Title: 'Registrate'
      }
    });

    (await modal).present();
    return;
  }

  getDataEmitted(data: Users | null) {
    if (data) {
      this.UserService.signUpNewUser(data).subscribe({
        next: (response) => {
          this.modalCtrl.dismiss();
          this.openModalFunc('Error', 'Utilize sus credenciales para iniciar sesión');
        },
        error: (err) => {
          this.openModalFunc('Error', 'Error al Registrarse, por favor intente nuevamente');
        }
      });
      this.modalCtrl.dismiss();
    } else {
      return;
    }
  }

  logginInvitado() {
    const userData: Users = {
      idUser: 999,
      idRol: 999,
      nombre: 'Usuario',
      apellidos: 'Invitado',
      email: 'example@gmail.com',
      telefono: '6441747474',
    }
    const invitadoAuth: loginResponseDTO = {
      accessToken: 'my_token_123',
      tokenType: 'my_token_123',
      idUser: 999,
      idRol: 999,
      nombre: 'Test',
      apellidos: 'Admin',
      email: 'test@user.com',
      avatar: ''
    }

    this.authService.setLoginData(invitadoAuth);
    this.openModalFunc('Alerta', 'Sesion iniciada');
    this.route.navigate(['/profile']);
  }

  restorePsw(data: string) {
    this.UserService.UpdatePsw(data).subscribe({
      next: () => {
        this.modalCtrl.dismiss();
        this.openModalFunc('Alerta', 'Utilize sus nuevas credenciales para iniciar sesión');
      },
      error: (err) => {
        this.openModalFunc('Error', 'Error al restaurar su contraseña, por favor intente nuevamente');
      }
    });
  }


}
