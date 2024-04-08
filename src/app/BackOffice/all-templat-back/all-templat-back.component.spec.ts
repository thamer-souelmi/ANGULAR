import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplatBackComponent } from './all-templat-back.component';

describe('AllTemplatBackComponent', () => {
  let component: AllTemplatBackComponent;
  let fixture: ComponentFixture<AllTemplatBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllTemplatBackComponent]
    });
    fixture = TestBed.createComponent(AllTemplatBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
