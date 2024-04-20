import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/Models/task';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import HighchartsGantt from 'highcharts/modules/gantt';
@Component({
  selector: 'app-app-gantt-chart',
  templateUrl: './app-gantt-chart.component.html',
  styleUrls: ['./app-gantt-chart.component.css']
})

export class AppGanttChartComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.createGanttChart();
  }

  private createGanttChart(): void {
   
  }
  }
      
      
    

