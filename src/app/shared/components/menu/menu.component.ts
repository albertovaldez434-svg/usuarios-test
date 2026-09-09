import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { PermisoPagina } from '@core/models/pages';
import { loginResponseDTO } from '@features/auth/models/loginDTO';
import { Confirmation } from '@core/services/helpers/confirmation';
import { IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular';
import { AuthService } from '@features/auth/services/auth-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, RouterLinkActive, RouterLink]
})
export class MenuComponent implements OnInit {
  private authService = inject(AuthService);

  user!: loginResponseDTO | null;
  pages!: PermisoPagina[];

  private ConfirmationService = inject(Confirmation);

  constructor(

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
    this.user = this.authService.loggedData$();
  }

  canView(page: PermisoPagina) {
    return page.roles.includes(this.user!.idRol);
  }

  async openActionSheet() {
    this.ConfirmationService.openConfirmationSheet('cerrar sesion', '¿desea continuar?');
  }

  async logout() {
    this.authService.closeSesion();
    this.ConfirmationService.setConfirmed(false);
    this.route.navigate(['/login']);
  }

}
