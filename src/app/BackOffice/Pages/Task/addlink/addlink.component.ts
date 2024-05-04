import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Link } from 'src/app/Models/link';
import { LinkService } from 'src/app/Services/link.service';

@Component({
  selector: 'app-addlink',
  templateUrl: './addlink.component.html',
  styleUrls: ['./addlink.component.css']
})
export class AddlinkComponent implements OnInit {
  links: Link[] = []; 

  newTask: Link = new Link(); 
  
  constructor(private linkservice:LinkService, private dialogRef: MatDialogRef<AddlinkComponent>) { }

  ngOnInit(): void {
    
    
  }
 
  onSubmit(): void {


    this.linkservice.AddLink(this.newTask).subscribe(() => {
      this.dialogRef.close(true); 
      console.log("item added",this.newTask)
    });
  }

  onClose(): void {
    this.dialogRef.close(); 
  }

  
  
  isValidPositiveValue(value: number): boolean {
    return value > 0;
}
}
