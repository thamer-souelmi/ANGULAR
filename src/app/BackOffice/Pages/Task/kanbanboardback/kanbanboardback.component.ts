import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from 'src/app/FrontOffice/pages/Task/add-task/add-task.component';
import { UpdateTaskComponent } from 'src/app/FrontOffice/pages/Task/update-task/update-task.component';
import { Task } from 'src/app/Models/task';
import { TaskStatus } from 'src/app/Models/task-status';
import { TaskService } from 'src/app/Services/task.service';
import { Priority } from 'src/app/Models/priority';

@Component({
  selector: 'app-kanbanboardback',
  templateUrl: './kanbanboardback.component.html',
  styleUrls: ['./kanbanboardback.component.css']
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
    let movedTask: Task = event.item.data;
  
    console.log('Moved Task:', movedTask);
    if (movedTask) {
      let previousStatus: TaskStatus = movedTask.taskStatus;
      let newStatus: TaskStatus = this.convertToTaskStatus(dropSection);
      console.log('Previous Status:', previousStatus);
     /*if (movedTask.taskStatus == 1){
      newStatus= TaskStatus.CANCELLED

     }
     */
     
     newStatus= TaskStatus.INPROGRESS
     newStatus= TaskStatus.CANCELLED

      
      
      console.log('New Status:', newStatus);

      if (previousStatus !== newStatus) {
        movedTask.taskStatus = newStatus;
        console.log('Task after status update:', movedTask);
        this.taskService.UpdateTask(movedTask).subscribe(updatedTask => {
          console.log('Task updated:', updatedTask);
          this.loadTasks(); 
        },
        error => {
          console.error('Error updating task:', error.message);
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
