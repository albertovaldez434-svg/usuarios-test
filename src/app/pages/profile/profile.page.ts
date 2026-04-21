import { Component, OnInit } from '@angular/core';
import { AuthUser, Users } from 'src/app/models/users';
import { UsuariosService } from 'src/app/services/usuarios';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  users!: Users[] | null;
  loggedUser!: AuthUser | null;
  currentUser?: Users;

  constructor(
    private userService: UsuariosService
  ) { }

  ngOnInit() {
    console.log('inicia pagina');
    this.userService.LoginData$.subscribe(data => this.loggedUser = data);
    this.userService.user$.subscribe(data => this.users = data);
  }

  ngAfterViewInit():void {
    console.log('incia Vista');

  }


  // ionViewDidEnter() {
  //   this.userService.LoginData$.subscribe(data => this.loggedUser = data);
  //   this.userService.user$.subscribe(data => this.users = data);
  //   this.findLoggedUser();
  //   console.log('inicia pagina');
  // }

  findLoggedUser = () => {
    console.log('buscando usuario logeado');
    const logUser = this.users?.find(usr => usr.idUser == this.loggedUser?.idUser);
    console.log(logUser);
    if (logUser) {
      this.currentUser = logUser;
    }
  }


}
