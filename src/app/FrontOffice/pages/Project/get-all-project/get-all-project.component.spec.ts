import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllProjectComponent } from './get-all-project.component';

describe('GetAllProjectComponent', () => {
  let component: GetAllProjectComponent;
  let fixture: ComponentFixture<GetAllProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetAllProjectComponent]
    });
    fixture = TestBed.createComponent(GetAllProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
