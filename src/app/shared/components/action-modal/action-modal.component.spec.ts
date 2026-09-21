import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { ActionModalComponent } from '@shared/components/action-modal/action-modal.component';

describe('ActionModalComponent', () => {
  let component: ActionModalComponent;
  let fixture: ComponentFixture<ActionModalComponent>;
  let modalControllerMock = { modalCtrl: jasmine.createSpy('modal') };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ActionModalComponent],
      providers: [
        { provide: ModalController, useValue: modalControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
