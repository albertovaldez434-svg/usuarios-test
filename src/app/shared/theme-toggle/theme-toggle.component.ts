import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  imports: [IonicModule],
})
export class ThemeToggleComponent implements OnInit {
  @ViewChild('themeButton', { read: ElementRef })
  button!: ElementRef;

  isDark = false;

  ngOnInit(): void {
    //
  }

  toggleTheme() {
    this.isDark = !this.isDark;

    document.body.classList.toggle('dark');

     localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }


}
