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
   /* const chartOptions: Highcharts.Options = {
      title: {
        text: 'Diagramme de Gantt'
      },
      chart: {
        type: 'grantt', // Définir explicitement le type de diagramme comme "xrange"
        renderTo: 'ganttChartContainer'
      },
      series: [
        {
          type: 'xrange', // Définir explicitement le type de série comme "xrange"
          name: 'Gestion des ventes',
          data: [
            {
              id: '1',
              name: 'Suivi',
              x: Date.UTC(2023, 11, 15),
              x2: Date.UTC(2023, 11, 21)
            },
            {
              id: '2',
              name: 'Présentation',
              x: Date.UTC(2023, 11, 22),
              x2: Date.UTC(2023, 11, 28)
            },
            // Ajoutez d'autres données de série ici
          ]
        }
      ]
    };

    Highcharts.chart('ganttChartContainer', chartOptions); // Utiliser Highcharts.chart pour créer le diagramme
    */
  }
  }
      
      
    

