import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizerComponent } from './customizer.component';

describe('CustomizerComponent', () => {
  let component: CustomizerComponent;
  let fixture: ComponentFixture<CustomizerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizerComponent]
    });
    fixture = TestBed.createComponent(CustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});