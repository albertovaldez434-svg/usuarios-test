import { Component, effect, OnInit } from '@angular/core';
import { UsuariosService } from './services/usuarios';
import { NavigationEnd, Router } from '@angular/router';
import { SecureStorageService } from './services/securestorage-service';
import { filter } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { loginResponseDTO } from './models/loginDTO';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './shared/menu/menu.component';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    imports: [IonicModule, MenuComponent],
})
export class AppComponent implements OnInit {
  isLogged: boolean = false;

  jwtHelper = new JwtHelperService;

  constructor(
    private userService: UsuariosService,
    private route: Router,
    private secureStorage: SecureStorageService
  ) {
    effect(() => {
      const user = this.userService.loggedData$();
      if (user) {
        this.isLogged = true;
      } else {
        this.isLogged = false;
      }
    });
  }

  ngOnInit() {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      localStorage.setItem('lastVisitedPage', event.urlAfterRedirects);
    });

    //this.loadTheme();

    //this.restoreLastPage();

    this.checkUserdata();
  }

  async checkUserdata() {
    if (!this.isLogged) {
      const dataLogin = await this.secureStorage.getItem<loginResponseDTO>('authUser');

      if (dataLogin) {

        if (dataLogin.idUser === 999) {
          const storedLogin = dataLogin;
          this.userService.setLoginData(storedLogin);
          this.isLogged = true;
          this.route.navigate(['/dashboard']);
          return;
        }

        if (this.jwtHelper.isTokenExpired(dataLogin?.accessToken)) {
          this.secureStorage.clear();
          this.isLogged = false;
          this.route.navigate(['/login']);
          return;
        }
        const storedLogin = dataLogin;
        this.userService.setLoginData(storedLogin);
        this.isLogged = true;
        //this.route.navigate(['/dashboard']);
        this.restoreLastPage();
      } else {
        this.isLogged = false;
        this.route.navigate(['/login']);
      }
    }
  }

  restoreLastPage() {
    const lastPage = localStorage.getItem('lastVisitedPage');
    if (lastPage && this.route.url === '/') {
      this.route.navigate([lastPage]);
    }
  }

  loadTheme() {
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }


}
