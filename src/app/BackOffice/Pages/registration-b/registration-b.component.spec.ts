import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationBComponent } from './registration-b.component';

describe('RegistrationBComponent', () => {
  let component: RegistrationBComponent;
  let fixture: ComponentFixture<RegistrationBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationBComponent]
    });
    fixture = TestBed.createComponent(RegistrationBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
