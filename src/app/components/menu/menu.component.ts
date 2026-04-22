import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit {
  active = 'yes';
  pages = [
    { title: 'Home', url: '/home' },
    { title: 'Usuarios', url: '/usuarios' },
    { title: 'Perfil', url: '/profile' }
  ];
  constructor() { }

  ngOnInit() { }

}
