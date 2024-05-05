import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateTaskComponent } from 'src/app/FrontOffice/pages/Task/update-task/update-task.component';
import { Priority } from 'src/app/Models/priority';
import { Project } from 'src/app/Models/project';
import { Task } from 'src/app/Models/task';
import { ProjectService } from 'src/app/Services/project.service';
import { TaskService } from 'src/app/Services/task.service';
import {Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { TaskStatus } from 'src/app/Models/task-status';

@Component({
  selector: 'app-taskback',
  templateUrl: './taskback.component.html',
  styleUrls: ['./taskback.component.css']
})
export class TaskbackComponent implements OnInit ,AfterViewInit{
  //table
  searchtext: string = '';
  dataSource = new MatTableDataSource<Task>();
selection = new SelectionModel<Task>(true, []);
sortedData: Task[] = [];
tasks: Task[] = [];
@ViewChild(MatPaginator) paginator!: MatPaginator; // ViewChild pour la pagination
pageSize = 3;
pageIndex = 0;
projectId: number | null = null;
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
   // ajouter ca sorttt
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
filteredTasks(): Task[] {
  if (!this.searchQuery) {
    return this.tasks.slice(this.sliceFrom, this.sliceTo);
  }

  const filteredData = this.tasks.filter(task => {
    const searchTerm = this.searchQuery.toLowerCase();
    return (
      task.taskname?.toLowerCase().includes(searchTerm) ||
      task.taskDescription?.toLowerCase().includes(searchTerm) ||
      task.employeeTask?.firstname?.toLowerCase().includes(searchTerm) ||
      task.employeeTask?.lastname?.toLowerCase().includes(searchTerm)
    );
  });

  return filteredData; // Return filtered tasks
}*/
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
/*
search(event: any): void {
  const query: string = event.target.value;
  if (!query.trim()) {
    if (this.projectId !== null) { // Vérifiez si projectId n'est pas null
      this.getTasksByProjectId(this.projectId);
    }
    return;
  }
  this.tasks = this.tasks.filter(task =>
    task.taskDescription.toLowerCase().includes(query.toLowerCase())
  );
}
*/

}
