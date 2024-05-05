import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contract } from 'src/app/Models/contract';
import { Project } from 'src/app/Models/project';
import { ContractService } from 'src/app/Services/contract.service';

@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.css']
})
export class EditContractComponent implements OnInit{

  contract!: Contract;
  projects: Project[] = [];
  selectedProject!: Project; 

  constructor(
    private dialogRef: MatDialogRef<EditContractComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contractservice: ContractService
  ) {
    this.contract = { ...data.contract };
    this.contract.projetContract = this.selectedProject;


  }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }
  onSubmit(): void {
    

    this.contractservice.UpdateInvoice(this.contract).subscribe(updatedTask => {
      this.dialogRef.close(updatedTask);
    });
  }

  isValidStartDate(): boolean {
    const today = new Date();
    return new Date(this.contract.startDateContract) >= today;
  }
  
  isValidPositiveValue(value: number): boolean {
    return value > 0;
}
isValidEndDate(): boolean {
  return new Date(this.contract.endDateContract) > new Date(this.contract.endDateContract);
}


}
