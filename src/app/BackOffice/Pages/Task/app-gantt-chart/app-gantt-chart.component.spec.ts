import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGanttChartComponent } from './app-gantt-chart.component';

describe('AppGanttChartComponent', () => {
  let component: AppGanttChartComponent;
  let fixture: ComponentFixture<AppGanttChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppGanttChartComponent]
    });
    fixture = TestBed.createComponent(AppGanttChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
