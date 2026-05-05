import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UsuariosService } from '../../services/usuarios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit {

  pages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'document-text-outline' },
    { title: 'Usuarios', url: '/usuarios', icon: 'list-circle-outline' },
    { title: 'Perfil', url: '/profile', icon: 'person-outline' }
  ];
  
  constructor(
    private usuarioService: UsuariosService,
    private route: Router
  ) { }

  ngOnInit() { }

  logout() {
    this.usuarioService.closeSesion();
    localStorage.clear();
    this.route.navigate(['/login']);
  }

}
