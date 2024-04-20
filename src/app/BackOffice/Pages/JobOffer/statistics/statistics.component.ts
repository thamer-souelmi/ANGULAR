import { Component, OnInit } from '@angular/core';
import { JobOfferService } from '../../../../Services/job-offer.service';
import {LegendPosition} from "@swimlane/ngx-charts";


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit{
  chartData: { name: string, value: number }[] = [];
  legendPosition = LegendPosition;

  constructor(private jobOfferService: JobOfferService) { }

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.jobOfferService.getJobOfferStatistics().subscribe(
      (statistics: any[]) => {
        console.log('Received job offer statistics:', statistics);

        // Format data for the chart
        this.chartData = statistics.map(item => ({
          name: item.jobOfferTitle,
          value: item.numberOfCandidates
        }));
      },
      (error) => {
        console.error('Error loading job offer statistics:', error);
      }
    );
  }
  onSelect(event: any): void {
    console.log(event);
  }
}
