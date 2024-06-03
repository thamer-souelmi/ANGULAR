import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesdetailsComponent } from './leavesdetails.component';

describe('LeavesdetailsComponent', () => {
  let component: LeavesdetailsComponent;
  let fixture: ComponentFixture<LeavesdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesdetailsComponent]
    });
    fixture = TestBed.createComponent(LeavesdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
