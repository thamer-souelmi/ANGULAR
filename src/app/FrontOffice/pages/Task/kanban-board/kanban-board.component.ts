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
 priority: string[] = ['HIGH', 'MEDUIM', 'LOW'];
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
  
  
  handleDrop(event: CdkDragDrop<Task[]>, dropSection: string): void {
    console.log('Drop Event:', event);
    const movedTask: Task = event.item.data;
  
    console.log('Moved Task:', movedTask);
    if (movedTask) {
      const previousStatus: TaskStatus = movedTask.taskStatus;
      const newStatus: TaskStatus = this.convertToTaskStatus(dropSection);
      console.log('Previous Status:', previousStatus);
      console.log('New Status:', newStatus);
      if (previousStatus !== newStatus) {
        movedTask.taskStatus = newStatus;
        console.log('Task after status update:', movedTask);
        this.taskService.UpdateTask(movedTask).subscribe(updatedTask => {
          console.log('Task updated:', updatedTask);
          this.loadTasks(); 
        },
        error => {
          console.error('Error updating task:', error);
        });
      }
    } else {
      console.error('No task data available to move');
    }
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

