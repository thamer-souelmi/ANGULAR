import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecharttaskComponent } from './piecharttask.component';

describe('PiecharttaskComponent', () => {
  let component: PiecharttaskComponent;
  let fixture: ComponentFixture<PiecharttaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiecharttaskComponent]
    });
    fixture = TestBed.createComponent(PiecharttaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
