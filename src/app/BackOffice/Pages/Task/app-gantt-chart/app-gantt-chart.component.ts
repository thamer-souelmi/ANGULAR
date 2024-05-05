
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { gantt } from 'dhtmlx-gantt';
import { Link } from 'src/app/Models/link';
import { Task } from 'src/app/Models/task';
import { LinkService } from 'src/app/Services/link.service';
import { TaskService } from 'src/app/Services/task.service';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from 'src/app/FrontOffice/pages/Task/add-task/add-task.component';
import { AddlinkComponent } from '../addlink/addlink.component';

@Component({
  providers: [  LinkService],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-app-gantt-chart',
 // templateUrl: './app-gantt-chart.component.html',
  template: `<nav class="navbar">
   
  <li><h3>Tasks</h3></li>
  <ul class="pos">
    
  <li ><a  href="/Projectback/taskback">List</a></li>
  <li><a href="/Projectback/kanbanback">Kanban Board</a></li>
  <li><a href="Projectback/gantt">Gantt</a></li>
  <li><a href="/Projectback/Todolist">To-Do-List</a></li>
  
</ul>
</nav>
<br><div style="display: flex; align-items: center; margin-bottom: 20px;">
  <button mat-raised-button
          matTooltip="Add Task" class="btn btn-secondary" style="height: 40px; font-size: 16px; margin-left: 900px; background-color: #fb6d1c; border-color: #fb6d1c; border-radius: 10px;" >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" fill="currentColor" class="bi bi-list-task" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"/>
          <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/>
          <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"/>
        </svg> Add Task
  </button>
  <button mat-raised-button
          matTooltip="Add Link" class="btn btn-secondary" style="height: 40px; font-size: 16px; margin-left: 20px; background-color: #fb6d1c; border-color: #fb6d1c; border-radius: 10px;"(click)="createLink()" >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
          <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
          <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
        </svg> Add Link
  </button>
</div><div #gantt_here class='gantt-chart'></div>`,
  styleUrls: ['./app-gantt-chart.component.css']
})

export class AppGanttChartComponent implements OnInit {
  constructor( private linkService: LinkService,private ts : TaskService,private dialog: MatDialog){}

  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;

  async ngOnInit() {
    gantt.config.date_format = '%Y-%m-%d';
    gantt.init(this.ganttContainer.nativeElement);

    // Récupérer les données de tâches et de liens depuis les services
    const [tasks, links] = await Promise.all([
      this.ts.getAllTasks().toPromise(),
      this.linkService.getAllLinks().toPromise()
    ]);

    // Formater les dates des tâches
    if (tasks && links) {
      // Formater les dates des tâches
      tasks.forEach(task => {
        task.startDateTask = new Date(task.startDateTask);
       
      });

      // Parser les données dans le format attendu par la bibliothèque Gantt
      const ganttData = {
        data: tasks.map(task => ({
          id: task.taskid,
          text: task.taskname,
          start_date: task.startDateTask,
          duration: task.duration,
          progress: task.progress,
          parent: task.parent
        })),
        links: links.map(link => ({
          id: link.id,
          source: link.source,
          target: link.target,
          type: link.type
        }))
      };

      // Afficher les données dans le Gantt
      gantt.parse(ganttData);
    }
    
    /*gantt.attachEvent('onTaskCreated', (task) => {
      // Appeler la méthode addTask lorsque la tâche est créée
      this.addTask(task);
    });
    */
    
  
  }

  async updateTask(task: Task): Promise<void> {
    await this.ts.UpdateTask(task).toPromise();
  }
  
  async addTask(task: Task): Promise<void> {
    try {
      // Ajout de la tâche dans la base de données
      const addedTask = await this.ts.AddTask(task).toPromise();
      console.log('Tâche ajoutée avec succès à la base de données', addedTask); // Ajoutez ce log pour vérifier si la tâche est ajoutée à la base de données
      // Vérifier si addedTask est défini
      if (addedTask) {
        // Mettre à jour le Gantt avec la tâche ajoutée
        gantt.addTask({
          id: addedTask.taskid,
          text: addedTask.taskname,
          start_date: addedTask.startDateTask,
          duration: addedTask.duration,
          progress: addedTask.progress,
          parent: addedTask.parent
        });
        console.log('Tâche ajoutée avec succès au Gantt'); // Ajoutez ce log pour vérifier si la tâche est ajoutée au Gantt
      } else {
        console.error("Error: Added task is undefined.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }
  
  async deleteTask(id: number): Promise<void> {
    await this.ts.deleteTask(id).toPromise();
    // Mettre à jour le Gantt après la suppression de la tâche
    gantt.deleteTask(id);
  }
  
  async updateLink(link: Link): Promise<void> {
    await this.linkService.UpdateLink(link).toPromise();
  }
  
  async addLink(link: Link): Promise<void> {
    await this.linkService.AddLink(link).toPromise();
    // Mettre à jour le Gantt après l'ajout du lien
    gantt.addLink(link);
  }
  
  async deleteLink(id: number): Promise<void> {
    await this.linkService.deleteLink(id).toPromise();
    // Mettre à jour le Gantt après la suppression du lien
    gantt.deleteLink(id);
  }
  createNewTask(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '500px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
  createLink(): void {
    const dialogRef = this.dialog.open(AddlinkComponent, {
      width: '500px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
}
      
    

