import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Project } from 'src/app/Models/project';
import { ProjectService } from 'src/app/Services/project.service';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import xrange from 'highcharts/modules/xrange';
xrange(Highcharts); 
@Component({
  selector: 'app-project-chart',
  templateUrl: './project-chart.component.html',
  styleUrls: ['./project-chart.component.css']
})
export class ProjectChartComponent implements OnInit{
  Highcharts: typeof Highcharts = Highcharts; 
  chartOptions: Highcharts.Options = {}; 
  projects: Project[] = [];
  chart: Chart = new Chart();

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    xrange(Highcharts);

    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
      console.log("Projects fetched:", this.projects);
      this.renderChart();
    });
  }

  renderChart(): void {
    const projectsByYear = this.groupProjectsByYear();
    const years = Object.keys(projectsByYear);
    const distinctYears = Array.from(new Set(years.map(year => parseInt(year)))); 

    const data = distinctYears.map(year => {
      return {
        x: year, 
        x2: year + 1, 
        y: projectsByYear[year.toString()].length 
      };
    });
    console.log(data); 

    const categories = distinctYears.map(year => year.toString()); 
    this.chart = new Chart({
      chart: {
        type: 'line' 
      },
      title: {
        text: 'projects peer year'
      },
      xAxis: {
        type: 'category', 
        title: {
          text: 'Year'
        },
        categories: categories 
      },
      yAxis: {
        title: {
          text: 'Number of  projets'
        }
      },
      series: [{ 
        type: 'line',
        name: 'Finalised projects',
        data: data
      }],
      credits: {
        enabled: false
      }
    });
  }

  groupProjectsByYear(): { [year: string]: Project[] } {
    const projectsByYear: { [year: string]: Project[] } = {};
    for (const project of this.projects) {
      if (project.startdateProject) {
        const startDate = new Date(project.startdateProject);
        const year = startDate.getFullYear().toString();
        if (!projectsByYear[year]) {
          projectsByYear[year] = [];
        }
        projectsByYear[year].push(project);
      }
    }
    return projectsByYear;
}

}


