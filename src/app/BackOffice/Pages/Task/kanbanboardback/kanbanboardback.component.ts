import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from 'src/app/FrontOffice/pages/Task/add-task/add-task.component';
import { UpdateTaskComponent } from 'src/app/FrontOffice/pages/Task/update-task/update-task.component';
import { Task } from 'src/app/Models/task';
import { TaskStatus } from 'src/app/Models/task-status';
import { TaskService } from 'src/app/Services/task.service';
import { Priority } from 'src/app/Models/priority';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
@Component({
  selector: 'app-kanbanboardback',
  templateUrl: './kanbanboardback.component.html',
  styleUrls: ['./kanbanboardback.component.css'],
  
})
export class KanbanboardbackComponent implements OnInit {
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
      console.log(tasks); // Vérifiez les données reçues
      this.tasks = tasks;
    });
  }
  
/*
  getTasksByStatus(status: number): Task[] {
    return this.tasks.filter(task => task.taskStatus === status);
  }
  
  */

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log("*********************",event.previousIndex, event.currentIndex)
    } else {
      const previousTaskStatus = +event.previousContainer.id; // Assuming you set the ID of cdkDropList as the task status
      const currentTaskStatus = +event.container.id;

      const taskToMove = event.previousContainer.data[event.previousIndex];
      taskToMove.taskStatus = currentTaskStatus;
      
      this.taskService.UpdateTask(taskToMove.taskid,taskToMove).subscribe(() => {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      });
    }
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


  // handleDrop(event: CdkDragDrop<Task[]>, dropSection: string): void {
  //   console.log('Drop Event:', event);

  //   let movedTask: Task = event.item.data;
  //   console.log('section:', dropSection);

  //   console.log('Previous Status: ', movedTask );
  
  //   console.log('Moved Task:', movedTask);
  //   if (movedTask) {
     
  //     let previousStatus: TaskStatus = movedTask.taskStatus;
  //     let newStatus: TaskStatus = this.convertToTaskStatus(dropSection);
  //     console.log('Previous Status: ', previousStatus );
  //     console.log('new Status: ', newStatus+1 );
      
  //     movedTask.taskStatus = newStatus+1;
     
        
  //       console.log('Task after status update:', movedTask);
  //       this.taskService.UpdateTask(movedTask.taskid,movedTask).subscribe(updatedTask => {
  //         console.log('Task updated:', updatedTask);
  //         this.loadTasks(); 
  //       },
  //       error => {
  //         console.error('Error updating task:', error.message);
  //       });
      
  //   } else {
  //     console.error('No task data available to move');
  //   }
  // }

  handleDrop(event: CdkDragDrop<Task[]>, dropSection: string): void {
    console.log('Drop Event:', event);
  
    let movedTask: Task = event.item.data;
    console.log('section:', dropSection);
  
    console.log('Previous Status: ', movedTask);
  
    console.log('Moved Task:', movedTask);
    if (movedTask) {
      const dialogRef = this.dialog.open(DialogContentComponent, {
        data: {
          message: 'Are you sure you want to move this task?'
        }
      });
  
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          let previousStatus: TaskStatus = movedTask.taskStatus;
          let newStatus: TaskStatus = this.convertToTaskStatus(dropSection);
          console.log('Previous Status: ', previousStatus);
          console.log('new Status: ', newStatus);
  
          movedTask.taskStatus = newStatus+1;
  
          console.log('Task after status update:', movedTask);
          this.taskService.UpdateTask(movedTask.taskid, movedTask).subscribe(
            (updatedTask) => {
              console.log('Task updated:', updatedTask);
              this.loadTasks();
            },
            (error) => {
              console.error('Error updating task:', error.message);
            }
          );
        } else {
          console.log('Task movement canceled by user');
        }
      });
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
  //
  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this project?')) {
    this.taskService.deleteTask(taskId).subscribe(() => {
    });
  }
  }



  

  
}
