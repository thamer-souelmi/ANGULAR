import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackStatsChartD3Component } from './feedback-stats-chart-d3.component';

describe('FeedbackStatsChartD3Component', () => {
  let component: FeedbackStatsChartD3Component;
  let fixture: ComponentFixture<FeedbackStatsChartD3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackStatsChartD3Component]
    });
    fixture = TestBed.createComponent(FeedbackStatsChartD3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
