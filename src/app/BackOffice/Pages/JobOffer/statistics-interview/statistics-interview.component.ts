import { Component } from '@angular/core';
import {InterviewService} from "../../../../Services/interview.service";
import {LegendPosition} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-statistics-interview',
  templateUrl: './statistics-interview.component.html',
  styleUrls: ['./statistics-interview.component.css']
})
export class StatisticsInterviewComponent {
  chartDataInterview: { name: string, value: number }[] = [];
  legendPosition = LegendPosition;
  constructor(private interviewService: InterviewService) { }

  ngOnInit(): void {
    this.loadInterviewChartData();
  }
  loadInterviewChartData(): void {
    this.interviewService.getSuccessRate().subscribe(
      (successRates: any) => {
        console.log('Received interview data:', successRates);

        const successfulInterviews = successRates['successful Interviews'] || 0;
        const unsuccessfulInterviews = successRates['unsuccessful Interviews'] || 0;
        this.chartDataInterview = [
          { name: 'Successful Interviews', value: successfulInterviews },
          { name: 'Unsuccessful Interviews', value: unsuccessfulInterviews }
        ];
      },
      (error) => {
        console.error('Error loading interview chart data:', error);
      }
    );
  }

  onSelect(event: any): void {
    console.log(event);
  }
}
