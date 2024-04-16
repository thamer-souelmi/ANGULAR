import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateJobOfferComponent } from './update-job-offer.component';

describe('UpdateJobOfferComponent', () => {
  let component: UpdateJobOfferComponent;
  let fixture: ComponentFixture<UpdateJobOfferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateJobOfferComponent]
    });
    fixture = TestBed.createComponent(UpdateJobOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
