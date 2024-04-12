import { Component, OnInit } from '@angular/core';
import { CandidacyService } from 'src/app/Services/candidacy.service';
import { LegendPosition } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-statistics-candidacies',
  templateUrl: './statistics-candidacies.component.html',
  styleUrls: ['./statistics-candidacies.component.css']
})
export class StatisticsCandidaciesComponent implements OnInit{
  chartDataCandidacy: { name: string, value: number }[] = [];
  legendPosition = LegendPosition;
  constructor(private candidacyService: CandidacyService) { }
  ngOnInit(): void {
    this.loadCandidacyChartData();
  }
  loadCandidacyChartData(): void {
    this.candidacyService.getCandidateStatisticsByCountry().subscribe(
      (data: any[]) => {
        console.log('Received candidacy data:', data); // Log the received data
        this.chartDataCandidacy = data
          .filter(item => item[0] !== null && item[1] !== null) // Filter out null values
          .map(item => ({ name: item[0], value: item[1] }));
      },
      (error) => {
        console.error('Error loading candidacy chart data:', error);
      }
    );
  }
  onSelect(event: any): void {
    console.log(event);
  }
}
