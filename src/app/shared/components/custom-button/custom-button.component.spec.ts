import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomButtonComponent } from '@shared/components/custom-button/custom-button.component';

describe('CustomButtonComponent', () => {
  let component: CustomButtonComponent;
  let fixture: ComponentFixture<CustomButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe emitir el evento clicked al ejecutarse onClick', () => {
    spyOn(component.clicked, 'emit');

    component.onClick();

    expect(component.clicked.emit).toHaveBeenCalled();
  });
});
