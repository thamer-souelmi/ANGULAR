import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Task } from 'src/app/Models/task';
import { Project } from 'src/app/Models/project';
import { TaskService } from 'src/app/Services/task.service';
import { ProjectService } from 'src/app/Services/project.service';
import { SeriesBarOptions } from 'highcharts';

@Component({
  selector: 'app-pmstatistic',
  templateUrl: './pmstatistic.component.html',
  styleUrls: ['./pmstatistic.component.css']
})
export class PMstatisticComponent implements OnInit {
  taskData: Task[] = [];
  projectData: Project[] = [];
  chart!: Chart;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService
  ) { }
  ngOnInit(): void {      // a effacerrrrrrr
    
  }
/*
  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.taskData = tasks;
      this.generateChart();
    });

    this.projectService.getAllProjects().subscribe(projects => {
      this.projectData = projects;
      this.generateChart();
    });
  }

  generateChart(): void {
    const totalTasks = this.taskData.length;
    const totalProjects = this.projectData.length;

    const employeeTasks = this.taskData.reduce((acc: Record<string, number>, task) => {
      const employeeName = task.employeeTask.firstname;
      acc[employeeName] = (acc[employeeName] || 0) + 1;
      return acc;
    }, {});

    const managerProjects = this.projectData.reduce((acc: Record<string, number>, project) => {
      const managerName = project.projectManager.firstname;
      acc[managerName] = (acc[managerName] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.keys(employeeTasks);
    const managers = Object.keys(managerProjects);

    const taskData = categories.map(category => (employeeTasks[category] / totalTasks) * 100); // Calcul du pourcentage de tâches
    const projectData = managers.map(manager => (managerProjects[manager] / totalProjects) * 100); // Calcul du pourcentage de projets

    this.chart = new Chart({
      chart: {
        type: 'bar' // Changer le type de graphique de 'xrange' à 'bar'
      },
      title: {
        text: 'Activity '
      },
      xAxis: [{
        categories: categories,
        title: {
          text: 'Developper'
        }
      }, {
        categories: managers,
        opposite: true,
        linkedTo: 0,
        title: {
          text: 'Project Manager'
        }
      }],
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      series: [{
        type: 'bar',
        name: 'Tasks',
        data: taskData as SeriesBarOptions['data']
      }, {
        type: 'bar',
        name: 'Projects',
        data: projectData as SeriesBarOptions['data'],
        color: '#28a745'
      }]
    });
  }
  */
}
