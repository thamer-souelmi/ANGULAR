import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/Models/task';
import { TaskService } from 'src/app/Services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Priority } from 'src/app/Models/priority';
import { UpdateTaskComponent } from '../update-task/update-task.component';
import { FormsuggestComponent } from '../formsuggest/formsuggest.component';
import {MatTableDataSource} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-tasks-byproject',
  templateUrl: './tasks-byproject.component.html',
  styleUrls: ['./tasks-byproject.component.css']
})
export class TasksByprojectComponent implements OnInit {

  //table
 
   dataSource = new MatTableDataSource<Task>();
  selection = new SelectionModel<Task>(true, []);

  displayedColumns: string[] = ['select', 'taskName', 'taskStatus', 'assignedTo', 'startDateTask', 'endDateTask','delete'];
 
  constructor(private ts:TaskService,private router: Router,private route: ActivatedRoute,private dialog: MatDialog){
    
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Task): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    console.log('Tâche sélectionnée :', row);

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.taskid + 1}`;
  }
  priorities = ['HIGH', 'MEDUIM', 'LOW'];
  
  Priority = Priority;
  tasks: Task[] = [];
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params !== null) {
        const projectIdParam = params.get('projectId');
        if (projectIdParam !== null) {
          const projectId = parseInt(projectIdParam, 10); 
          if (!isNaN(projectId)) {
            this.getTasksByProjectId(projectId);
          }
        }
      }
    });
  }
  

  getTasksByProjectId(projectId: number): void {
    this.ts.getTasksByProjectId(projectId).subscribe(tasks => {
      this.dataSource.data = tasks;
      console.log('Données de la source :', this.dataSource.data); 
    });
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this project?')) {
    this.ts.deleteTask(taskId).subscribe(() => {
    });
  }
  }
  updateTask(task: Task): void  {
    const dialogRef = this.dialog.open(UpdateTaskComponent, {
      width: '400px',
      data: { task: task }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'high-priority';
      case 'MEDUIM':
        return 'medium-priority';
      case 'LOW':
        return 'low-priority';
      default:
        return '';
    }
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
openFormsuggestModal(): void {
  const dialogRef = this.dialog.open(FormsuggestComponent, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
    }
  });
}
showDeleteIcon(row: Task): boolean {
  return this.selection.isSelected(row);
}

showEditIcon(row: Task): boolean {
  return this.selection.isSelected(row);
}

  }



