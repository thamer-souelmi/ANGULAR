import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/Models/task';
import { TaskService } from 'src/app/Services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Priority } from 'src/app/Models/priority';
import { UpdateTaskComponent } from '../update-task/update-task.component';
import { FormsuggestComponent } from '../formsuggest/formsuggest.component';
import {MatTableDataSource, _MatTableDataSource} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-tasks-byproject',
  templateUrl: './tasks-byproject.component.html',
  styleUrls: ['./tasks-byproject.component.css']
})
export class TasksByprojectComponent implements OnInit,AfterViewInit {
  searchtext:any;
  //table
  searchQuery: string = '';
     dataSource = new MatTableDataSource<Task>();
  selection = new SelectionModel<Task>(true, []);
  sortedData: Task[] = [];
  tasks: Task[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator; // ViewChild pour la pagination
  pageSize = 3;
  pageIndex = 0;

sliceFrom = 0; 
  sliceTo = this.pageSize;
  displayedColumns: string[] = ['select', 'taskName', 'taskStatus','priority', 'assignedTo', 'startDateTask', 'endDateTask','delete'];
  selectedInvoice: Task | null = null;

  constructor(private ts:TaskService,private router: Router,private route: ActivatedRoute,private dialog: MatDialog){
    
  }
  
  
 
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
      this.sortedData = tasks; 
      this.tasks = tasks;
      this.sliceProjects();
      this.sortedData = this.tasks.slice(); // //sort
      this.dataSource = new MatTableDataSource<Task>(this.tasks); // Initialisez votre source de données ici
      this.dataSource.paginator = this.paginator;    // Initialisez sortedData ici
  
    });
  
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.sliceProjects();
  }
  sliceProjects(): void {
    this.sliceFrom = this.pageIndex * this.pageSize;
    this.sliceTo = Math.min(this.sliceFrom + this.pageSize, this.tasks.length); 
    console.log('sliceFrom:', this.sliceFrom, 'sliceTo:', this.sliceTo); 
  }
  ngAfterViewInit(): void {
    console.log('Paginator:', this.paginator);

    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
         
        this.pageIndex = event.pageIndex;
    
        this.sliceProjects();
      });
    }else {
      
    }
  }
  
  getDisplayedProjects(): Task[] {
    return this.sortedData.slice(this.sliceFrom, this.sliceTo);
    
  }
  /*
  onSearchChange(): void {
    this. getDisplayedProjects(); 
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.sliceProjects();
      });
    }
  }
  */
  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this project?')) {
    this.ts.deleteTask(taskId).subscribe(() => {
    });
  }
  }
  updateTask(task: Task): void  {
    if (this.selection) {
    const dialogRef = this.dialog.open(UpdateTaskComponent, {
      width: '400px',
      data: { task: task }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  } else {
    console.error('Selected task is null.');
  }
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
  return this.selectedInvoice === row; // Afficher l'icône d'édition uniquement si la ligne est sélectionnée
}

showEditIcon(invoice: Task): boolean {
  console.log('Selected invoice:', this.selectedInvoice);
  console.log('Invoice ID:', invoice.taskid);
  return this.selectedInvoice === invoice; // Afficher l'icône d'édition uniquement si la ligne est sélectionnée
}

onRowClick(invoice: Task): void {
  console.log('Invoice clicked:', invoice);
  if (this.selectedInvoice === invoice) {
    // Si l'invoice sélectionné est déjà celui sur lequel nous avons cliqué, le désélectionner
    this.selectedInvoice = null;
  } else {
    // Sinon, sélectionner l'invoice sur lequel nous avons cliqué
    this.selectedInvoice = invoice;
  }
  console.log('Selected invoice after click:', this.selectedInvoice);
}
sortData(sort: Sort) {
  const data = this.tasks.slice();

  if (!sort.active || sort.direction === '') {
    this.sortedData = data;
    return;
  }
  this.sortedData = data.sort((a, b) => {
    const isAsc = sort.direction === 'asc';
    switch (sort.active) {
      case 'startDateTask':
        return this.compare(new Date(a.startDateTask), new Date(b.startDateTask), isAsc);
      case 'dueDateTask':
        return this.compare(new Date(a.dueDateTask), new Date(b.dueDateTask), isAsc);
      case 'employeeTask':
        const firstnameA = a.employeeTask ? a.employeeTask.firstname : '';
        const firstnameB = b.employeeTask ? b.employeeTask.firstname : '';
        return this.comparestring(firstnameA, firstnameB, isAsc);
      default:
        return 0;
    }
  });
  
}

compare(a: Date, b: Date, isAsc: boolean): number {
  if (a < b) {
    return isAsc ? -1 : 1;
  } else if (a > b) {
    return isAsc ? 1 : -1;
  } else {
    return 0;
  }
}
comparestring(a: String, b: String, isAsc: boolean): number {
  if (a < b) {
    return isAsc ? -1 : 1;
  } else if (a > b) {
    return isAsc ? 1 : -1;
  } else {
    return 0;
  }
}
matBadgeClass(status: number) {
  switch (status) {
    case 0:
      return { 'badge bg-inverse-danger': true };
    case 1:
      return { 'badge bg-inverse-success': true };
    case 2:
      return { 'mat-badge-info': true };
    case 3:
      return { 'mat-badge-warn': true };
    default:
      return {};
  }
}

  }



