import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Invoice } from 'src/app/Models/invoice';
import { Project } from 'src/app/Models/project';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { ProjectService } from 'src/app/Services/project.service';

@Component({
  selector: 'app-add-invoice-item',
  templateUrl: './add-invoice-item.component.html',
  styleUrls: ['./add-invoice-item.component.css']
})
export class AddInvoiceItemComponent implements OnInit{
  invoices: Invoice[] = []; 
  projects: Project[] = []; 
  selectedProject!: Project; 

  newTask: Invoice = new Invoice(); 
  
  constructor(private invoiceservice:InvoiceService,private projectService: ProjectService, private dialogRef: MatDialogRef<AddInvoiceItemComponent>) { }

  ngOnInit(): void {
    this.loadProjects();
    
  }
  loadProjects(): void {
    
    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
    });
  }
  onSubmit(): void {
    console.log("New Task before submission:", this.newTask);
    this.newTask.projetInvoice = this.selectedProject;


    this.invoiceservice.AddInvoice(this.newTask).subscribe(() => {
      this.dialogRef.close(true); 
      console.log("item added",this.newTask)
    });
  }

  onClose(): void {
    this.dialogRef.close(); 
  }

  isValidStartDate(): boolean {
    const today = new Date();
    return new Date(this.newTask.issueDateinvoice) >= today;
  }
  
  isValidPositiveValue(value: number): boolean {
    return value > 0;
}

}
