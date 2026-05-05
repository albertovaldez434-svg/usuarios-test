import { Component, OnInit } from '@angular/core';
import { UsuariosService } from './services/usuarios';
import { NavigationEnd, Router } from '@angular/router';
import { Localstorage } from './services/localstorage';
import { AuthUser } from './models/users';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  isLogged: boolean = false;

  loggedSubscription!: Subscription;

  constructor(
    private userService: UsuariosService,
    private route: Router,
    private secureStorage: Localstorage
  ) {
    this.checkUserdata();
  }

  ngOnInit() {
    this.loggedSubscription = this.userService.LoginData$.subscribe(
      logindata => {
        if (logindata) {
          this.isLogged = true;
        } else {
          this.isLogged = false;
        }
      }
    )

    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      localStorage.setItem('lastVisitedPage', event.urlAfterRedirects);
    });

    this.restoreLastPage();
  }

  ngOnDestroy() {
    if (this.loggedSubscription) {
      this.loggedSubscription.unsubscribe();
    }
  }

  async checkUserdata() {
    if (!this.isLogged) {
      const dataLogin = await this.secureStorage.getItem<AuthUser>('authUser');
      if (dataLogin) {
        const storedLogin = dataLogin;
        this.userService.setLogin(storedLogin);
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
      this.route.navigateByUrl(lastPage);
    }
  }


}
