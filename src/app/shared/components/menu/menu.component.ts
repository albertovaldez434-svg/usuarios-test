import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { UsuariosService } from '../../../core/services/usuarios';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { PermisoPagina } from 'src/app/core/models/pages';
import { loginResponseDTO } from 'src/app/core/models/loginDTO';
import { Confirmation } from 'src/app/core/services/helpers/confirmation';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [IonicModule, RouterLinkActive, RouterLink]
})
export class MenuComponent implements OnInit {
  user!: loginResponseDTO | null;
  pages!: PermisoPagina[];

  private ConfirmationService = inject(Confirmation);

  constructor(
    private usuarioService: UsuariosService,
    private route: Router,
  ) {
    this.pages = [
      { title: 'Dashboard', url: '/dashboard', icon: 'document-text-outline', roles: [1, 2, 999] },
      { title: 'Usuarios', url: '/users', icon: 'list-circle-outline', roles: [1, 999] },
      { title: 'Perfil', url: '/profile', icon: 'person-outline', roles: [1, 2, 999] }
    ];

    effect(() => {
      const result = this.ConfirmationService.confirmed();
      
      if (result === true) {
        this.logout();
      }
    });
  }

  ngOnInit() {
    this.user = this.usuarioService.loggedData$();
  }

  canView(page: PermisoPagina) {
    return page.roles.includes(this.user!.idRol);
  }

  async openActionSheet() {
    this.ConfirmationService.openConfirmationSheet('cerrar sesion', '¿desea continuar?');
  }

  async logout() {
    this.usuarioService.closeSesion();
    this.ConfirmationService.setConfirmed(false);
    this.route.navigate(['/login']);
  }

}
