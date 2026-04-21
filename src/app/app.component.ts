import { Component } from '@angular/core';
import { UsuariosService } from './services/usuarios';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  isLogged: boolean = false;

  constructor(
    private userService: UsuariosService,
    private route: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.checkUserdata();
  }

  checkUserdata() {
    this.userService.LoginData$.subscribe(data => {
      if (data) {
        this.isLogged = true;
        // const returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl')';
        // this.route.navigateByUrl(returnUrl);

        // console.log('si hay datos guardados');
      } else {
        this.isLogged = false;
        this.route.navigate(['/login']);
        // console.log('no hay datos guardados');
      };
    });
  }
}
