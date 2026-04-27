import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UsuariosService } from '../../services/usuarios';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit {

  pages = [
    { title: 'Dashboard', url: '/dashboard' },
    { title: 'Usuarios', url: '/usuarios' },
    { title: 'Perfil', url: '/profile' }
  ];
  
  constructor(
    private menuCtrl: MenuController,
    private usuarioService: UsuariosService
  ) { }

  ngOnInit() { }

  close() {
    this.menuCtrl.close();
  }

  logout() {
    this.usuarioService.closeSesion();
    localStorage.clear();
  }

}
