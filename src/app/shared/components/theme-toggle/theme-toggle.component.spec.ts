import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe alternar el tema y guardar la preferencia en localStorage', () => {
    component.toggleTheme();

    expect(component.isDark).toBeTrue();
    expect(document.body.classList.contains('dark')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('dark');

    component.toggleTheme();

    expect(component.isDark).toBeFalse();
    expect(document.body.classList.contains('dark')).toBeFalse();
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
