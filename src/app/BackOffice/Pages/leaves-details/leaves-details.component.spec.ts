import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesDetailsComponent} from "./leaves-details.component";

describe('LeavesDetailsComponent', () => {
  let component: LeavesDetailsComponent;
  let fixture: ComponentFixture<LeavesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesDetailsComponent]
    });
    fixture = TestBed.createComponent(LeavesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
