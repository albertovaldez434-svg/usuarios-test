import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios';
import { Router } from '@angular/router';
import { PermisoPagina } from 'src/app/models/pages';
import { loginResponseDTO } from 'src/app/models/loginDTO';
import { Confirmation } from 'src/app/services/helpers/confirmation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
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
      { title: 'Usuarios', url: '/usuarios', icon: 'list-circle-outline', roles: [1, 999] },
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
    this.route.navigate(['/login']);
  }

}
