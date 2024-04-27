import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Project } from 'src/app/Models/project';

@Component({
  selector: 'app-detailprojectback',
  templateUrl: './detailprojectback.component.html',
  styleUrls: ['./detailprojectback.component.css']
})
export class DetailprojectbackComponent implements OnInit{
  project: Project; 


  constructor(private dialogRef: MatDialogRef<DetailprojectbackComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private router: Router) {
    this.project = data.project; 
  }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }
  
  gotostat(projectId: number): void {
    this.router.navigate(['/Projectback/taskpiechart', projectId]); 
  }
  


}
