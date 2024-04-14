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
  chartDataMostQualified: { name: string, value: number }[] = [];
  legendPosition = LegendPosition;
  constructor(private candidacyService: CandidacyService) { }
  ngOnInit(): void {
    this.loadCandidacyChartData();
    this.loadMostQualifiedChartData();

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
  loadMostQualifiedChartData(): void {
    this.candidacyService.getMostQualifiedCandidatesStatistics().subscribe(
      (data: any[]) => {
        console.log('Received most qualified data:', data); // Log the received data
        this.chartDataMostQualified = data.map(item => ({ name: item.candidateName, value: item.numberOfSkills }));
      },
      (error) => {
        console.error('Error loading most qualified chart data:', error);
      }
    );
  }
  onSelect(event: any): void {
    console.log(event);
  }
}
