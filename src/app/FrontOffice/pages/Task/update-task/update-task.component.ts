import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/Models/task';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent implements OnInit {
  
  priorityOptions: string[] = ['HIGH', 'MEDIUM', 'LOW'];
    statuses: string[] = ['TODO', 'INPROGRESS', 'COMPLETED', 'CANCELED'];
  task: Task;

  constructor(
    private dialogRef: MatDialogRef<UpdateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService
  ) {
    this.task = { ...data.task };
    

  }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    

    // this.taskService.UpdateTask(this.task).subscribe(updatedTask => {
    //   this.dialogRef.close(updatedTask);
    // });
  }

  isValidStartDate(): boolean {
    const today = new Date();
    return new Date(this.task.startDateTask) >= today;
  }

  isValidEndDate(): boolean {
    return new Date(this.task.dueDateTask) > new Date(this.task.startDateTask);
  }
}


