import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal, MenuController, ModalController } from '@ionic/angular';
import { UsuariosService } from '../../services/usuarios';
import { Router } from '@angular/router';
import { AuthUser } from 'src/app/models/users';
import { PermisoPagina } from 'src/app/models/pages';
import { loginResponseDTO } from 'src/app/models/loginDTO';
import { ActionModalComponent } from '../action-modal/action-modal.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit {
  user!: loginResponseDTO | null;
  pages!: PermisoPagina[];

  private ModalCtrl = inject(ModalController);

  constructor(
    private usuarioService: UsuariosService,
    private route: Router,
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

  async openActionSheet() {
    const actionSheet = await this.ModalCtrl.create({
      component: ActionModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.5,
      componentProps: {
        title: 'Cerrar Sesion',
        msj: '¿Desea cerrar sesión?'
      },
    });

    await actionSheet.present();

    const { data } = await actionSheet.onDidDismiss();

    if (data == 'logoutConfirm') {
      this.logout();
    }
  }

  async logout() {
    this.usuarioService.closeSesion();
    this.route.navigate(['/login']);
  }

}
