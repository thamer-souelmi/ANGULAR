import { Component, Input, OnInit } from '@angular/core';

import { Task } from 'src/app/Models/task';
import { TaskService } from 'src/app/Services/task.service';
import { TaskStatus } from 'src/app/Models/task-status';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Priority } from 'src/app/Models/priority';
import { UpdateTaskComponent } from 'src/app/FrontOffice/pages/Task/update-task/update-task.component';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
 selectedSection: string = '';
 Priority = Priority;
   selectedStory: any;

  constructor(private taskService: TaskService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks.map(task => ({
        ...task,
        taskStatus: task.taskStatus as TaskStatus 
      }));
    });
  }
  handleRelease(task: Task): void {
    this.selectedTask = task;
  }
  convertToTaskStatus(section: string): TaskStatus {
    switch(section) {
      case 'TODO':
        return TaskStatus.TODO;
      case 'INPROGRESS':
        return TaskStatus.INPROGRESS;
      case 'COMPLETED':
        return TaskStatus.COMPLETED;
      case 'CANCELLED':
        return TaskStatus.CANCELLED;
      default:
        console.error('Unknown section:', section);
        
        throw new Error('Unknown section: ' + section);
        
    }
  }
  
  
  handleDrop(event: any, section: string) {
    const droppedTask: Task = event.item.data;
    const previousSection: string = event.previousContainer.id;

    // Mapper la chaîne de caractères de la section à TaskStatus
    let newStatus: TaskStatus;

    switch (section) {
      case 'TODO':
        newStatus = TaskStatus.TODO;
        break;
      case 'INPROGRESS':
        newStatus = TaskStatus.INPROGRESS;
        break;
      case 'COMPLETED':
        newStatus = TaskStatus.COMPLETED;
        break;
      case 'CANCELLED':
        newStatus = TaskStatus.CANCELLED;
        break;
      default:
        throw new Error('Section non reconnue');
    }

    // Mettre à jour la tâche avec la nouvelle section
    droppedTask.taskStatus = newStatus;

    // Mettre à jour la tâche dans la base de données
    // this.taskService.UpdateTask(droppedTask).subscribe(updatedTask => {
    //   console.log('Tâche déplacée avec succès :', updatedTask);
    //   // Rafraîchir les données après le déplacement de la carte
    //   this.loadTasks();
    // }, error => {
    //   console.error('Erreur lors du déplacement de la tâche :', error);
    //   // Gérer les erreurs éventuelles
    // });
  }
  
  
  filterTasksBySection(section: string): Task[] {
  
    return this.tasks.filter(task => task.taskStatus === section as unknown as TaskStatus);
   
  }

  openAddTaskModal(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '400px', 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.loadTasks();
    });
  }
  openEditTaskModal(task: Task): void {
    const dialogRef = this.dialog.open(UpdateTaskComponent, {
      width: '400px',
      data: { task: task }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
 

}

