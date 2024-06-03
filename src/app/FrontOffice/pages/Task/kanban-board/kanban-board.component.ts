import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/Models/task';
import { TaskService } from 'src/app/Services/task.service';
import { TaskStatus } from 'src/app/Models/task-status';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Priority } from 'src/app/Models/priority';
import { UpdateTaskComponent } from 'src/app/FrontOffice/pages/Task/update-task/update-task.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
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
  todoTasks: Task[] = [];
  doneTasks: Task[] = [];
  taskstat!:TaskStatus;

  /// chat4
  //todo!: Task[];
  inProgress!: Task[];
  completed!: Task[];
  cancelled!: Task[];
  TaskStatus = TaskStatus;
  constructor(private taskService: TaskService) {

  }
  ngOnInit() {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
      console.log('All Tasks:', this.tasks);
      this.tasks.forEach(task => console.log(task.taskStatus));  // Vérifier les valeurs de taskStatus
    });
  }
  /*
}
filterTasks() {
 this.todo = this.tasks.filter(t => t.taskStatus === TaskStatus.TODO);
 console.log('TODO Tasks:', this.todo);
 this.inProgress = this.tasks.filter(t => t.taskStatus === TaskStatus.INPROGRESS);
 console.log('InProgress Tasks:', this.inProgress);
 this.completed = this.tasks.filter(t => t.taskStatus === TaskStatus.COMPLETED);
 console.log('Completed Tasks:', this.completed);
 this.cancelled = this.tasks.filter(t => t.taskStatus === TaskStatus.CANCELLED);
 console.log('Cancelled Tasks:', this.cancelled);
}

drop(event: CdkDragDrop<Task[]>) {
 if (event.previousContainer === event.container) {
   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
 } else {
   transferArrayItem(
     event.previousContainer.data,
     event.container.data,
     event.previousIndex,
     event.currentIndex
   );
   this.updateTaskStatus(event.container.data[event.currentIndex]);
 }
}

updateTaskStatus(task: Task) {
 this.taskService.UpdateTask(task).subscribe({
   error: (err) => console.error('Failed to update task', err),
   complete: () => console.log('Task updated successfully')
 });
}
///
*/
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


}


/////////////

/*
filterTasks() {
  this.todo = this.tasks.filter(t => t.taskStatus === TaskStatus.TODO);
  this.inProgress = this.tasks.filter(t => t.taskStatus === TaskStatus.INPROGRESS);
  this.completed = this.tasks.filter(t => t.taskStatus === TaskStatus.COMPLETED);
  this.cancelled = this.tasks.filter(t => t.taskStatus === TaskStatus.CANCELLED);
}

loadTasks() {
  this.taskService.getAllTasks().subscribe(tasks => {
    this.todoTasks = tasks.filter(task => task.taskStatus === TaskStatus.TODO);
    this.doneTasks = tasks.filter(task => task.taskStatus === TaskStatus.COMPLETED);
  });
}

handleDrop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus) {
  const task = event.item.data;
  task.taskStatus = newStatus;
  this.taskService.UpdateTask(task).subscribe(() => {
    console.log('Task status updated successfully.');
  }, error => {
    console.error('Failed to update task status:', error);
  });
}


 */










