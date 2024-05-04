import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Contract } from 'src/app/Models/contract';
import { Project } from 'src/app/Models/project';
import { ContractService } from 'src/app/Services/contract.service';
import { ProjectService } from 'src/app/Services/project.service';

@Component({
  selector: 'app-addcontract',
  templateUrl: './addcontract.component.html',
  styleUrls: ['./addcontract.component.css']
})
export class AddcontractComponent {
  @ViewChild('taskForm') taskForm!: NgForm;  newTask: Contract = {} as Contract; 
  projects: Project[] = [];
  Pstatus :string[] =[ 'confirmed', 'inprogress','canceled']
  selectedProject!: Project; 

  constructor(private contractservice: ContractService,private projectservice: ProjectService,private dialogRef: MatDialogRef<AddcontractComponent>) { }

  ngOnInit(): void {
    this.projectservice.getAllProjects().subscribe(
      managers => {
        this.projects = managers;
        console.log('Projects:', this.projects); // Check if data is correctly fetched
      },
      error => {
        console.error('Error fetching project managers:', error); // Log any errors
      }
    );
  }
  onSubmit(): void {
    this.newTask.projetContract = this.selectedProject;

    this.contractservice.AddInvoice(this.newTask).subscribe(
      response => {
        console.log('Contract added successfully:', response);
        // Reset the form
        this.taskForm.resetForm();
      },
      error => {
        console.error('Error adding contract:', error);
      }
    );
  }
  isValidStartDate(): boolean {
    const today = new Date();
    return new Date(this.newTask.startDateContract) >= today;
  }
  
  isValidPositiveValue(value: number): boolean {
    return value > 0;
}
isValidEndDate(): boolean {
  return new Date(this.newTask.endDateContract) > new Date(this.newTask.endDateContract);
}
onClose(): void {
  this.dialogRef.close(); 
}
}
