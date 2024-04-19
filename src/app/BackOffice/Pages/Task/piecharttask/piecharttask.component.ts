import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { Task } from 'src/app/Models/task';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-piecharttask',
  templateUrl: './piecharttask.component.html',
  styleUrls: ['./piecharttask.component.css']
})
export class PiecharttaskComponent implements OnInit {
  tasks: Task[] = [];
  chart!: Chart;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du projet depuis la route
    this.route.params.subscribe(params => {
      const projectId = params['projectId'];

      // Récupérer les tâches pour le projet spécifique
      this.taskService.getTasksByProjectId(projectId).subscribe(tasks => {
        this.tasks = tasks;
        this.generateChart();
      });
    });
  }

  generateChart(): void {
    const statusCounts: Record<string, number> = {
      TODO: 0,
      INPROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0
    };

    // Compter le nombre de tâches dans chaque état
    this.tasks.forEach(task => {
      statusCounts[task.taskStatus] += 1;
    });

    // Calculer les pourcentages
    const totalTasks = this.tasks.length;
    const statusPercentages = Object.keys(statusCounts).map(status => ({
      name: status,
      y: (statusCounts[status] / totalTasks) * 100
    }));

    // Configurer le pie chart
    this.chart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Task Distribution by Status'
      },
      series: [{
        type: 'pie',
        name: 'Percentage',
        data: statusPercentages
      }]
    });
  }
}
