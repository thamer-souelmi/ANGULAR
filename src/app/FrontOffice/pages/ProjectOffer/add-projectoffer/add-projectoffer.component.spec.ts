import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectofferComponent } from './add-projectoffer.component';

describe('AddProjectofferComponent', () => {
  let component: AddProjectofferComponent;
  let fixture: ComponentFixture<AddProjectofferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProjectofferComponent]
    });
    fixture = TestBed.createComponent(AddProjectofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
