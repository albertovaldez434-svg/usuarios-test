import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UsuariosService } from '../../services/usuarios';
import { Router } from '@angular/router';
import { AuthUser } from 'src/app/models/users';
import { PermisoPagina } from 'src/app/models/pages';
import { loginResponseDTO } from 'src/app/models/loginDTO';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit {
  user!: loginResponseDTO | null;

  pages!: PermisoPagina[];

  constructor(
    private usuarioService: UsuariosService,
    private route: Router
  ) {
    this.pages = [
      { title: 'Dashboard', url: '/dashboard', icon: 'document-text-outline', roles: [1, 2, 999] },
      { title: 'Usuarios', url: '/usuarios', icon: 'list-circle-outline', roles: [1, 999] },
      { title: 'Perfil', url: '/profile', icon: 'person-outline', roles: [1, 2, 999] }
    ];
  }

  ngOnInit() {
    this.user = this.usuarioService.loggedData$();
  }

  canView(page: PermisoPagina) {
    return page.roles.includes(this.user!.idRol);
  }

  logout() {
    this.usuarioService.closeSesion();
    //localStorage.clear();
    this.route.navigate(['/login']);
  }

}
