import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { RestorePswComponent } from '@shared/components/restore-psw/restore-psw.component';

describe('RestorePswComponent', () => {
  let component: RestorePswComponent;
  let fixture: ComponentFixture<RestorePswComponent>;
  let modalControllerMock = { ModalCtrl: jasmine.createSpy('modal')};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RestorePswComponent],
      providers: [ 
        { provide: ModalController, useValue: modalControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RestorePswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
