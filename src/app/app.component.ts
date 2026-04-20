import { Component } from '@angular/core';
import { UsuariosService } from './services/usuarios';
import { Router } from '@angular/router';

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
    private route: Router
  ) {
    this.checkUserdata();
  }

  checkUserdata() {
    this.userService.LoginData$.subscribe(data => {
      if (data) {
        this.isLogged = true;
        this.route.navigate(['/usuarios']);
        // console.log('si hay datos guardados');
      } else {
        this.isLogged = false;
        this.route.navigate(['/login']);
        // console.log('no hay datos guardados');
      };
    });
  }
}
