import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RestorePswComponent } from 'src/app/shared/restore-psw/restore-psw.component';

describe('RestorePswComponent', () => {
  let component: RestorePswComponent;
  let fixture: ComponentFixture<RestorePswComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), RestorePswComponent]
}).compileComponents();

    fixture = TestBed.createComponent(RestorePswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
