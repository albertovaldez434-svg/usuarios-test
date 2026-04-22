import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit {

  pages = [
    { title: 'Usuarios', url: '/usuarios' },
    { title: 'Perfil', url: '/profile' }
  ];
  
  constructor(
    private menuCtrl: MenuController
  ) { }

  ngOnInit() { }

  close() {
    this.menuCtrl.close();
  }

}
