import { Component, effect, OnInit } from '@angular/core';
import { UsuariosService } from './services/usuarios';
import { NavigationEnd, Router } from '@angular/router';
import { Localstorage } from './services/localstorage';
import { AuthUser } from './models/users';
import { filter } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  isLogged: boolean = false;

  jwtHelper = new JwtHelperService;

  constructor(
    private userService: UsuariosService,
    private route: Router,
    private secureStorage: Localstorage
  ) {
    effect(() => {
      const user = this.userService.loggedData$();
      if (user) {
        this.isLogged = true;
      } else {
        this.isLogged = false;
      }
    });

    this.checkUserdata();
  }

  ngOnInit() {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      localStorage.setItem('lastVisitedPage', event.urlAfterRedirects);
    });

    this.restoreLastPage();
  }

  async checkUserdata() {
    if (!this.isLogged) {
      const dataLogin = await this.secureStorage.getItem<AuthUser>('authUser');
      if (dataLogin) {
        if (this.jwtHelper.isTokenExpired(dataLogin?.access_token)) {
          this.secureStorage.clear();
          this.isLogged = false;
          this.route.navigate(['/login']);
          return;
        }
        const storedLogin = dataLogin;
        this.userService.setLoginData(storedLogin);
        this.isLogged = true;
        this.route.navigate(['/profile']);
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


}
