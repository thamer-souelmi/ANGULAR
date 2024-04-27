import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { User } from 'src/app/Models/User';
import { UserService } from 'src/app/Services/user.service';
import {Router} from "@angular/router";
import { MatDialogRef } from '@angular/material/dialog';
import { Role } from 'src/app/Models/role';
import { RoleService } from 'src/app/Services/role.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  user: User[] = []; 
  role!: Role; 
  roles: Role[] = []; 

  genderOptions = [
    { value: '1', label: 'Female' },
    { value: '0', label: 'Male' }
  ];


  newUser: User = new User(); 
 


  constructor(private roleservice: RoleService, private dialogRef: MatDialogRef<AddUserComponent>,private userService: UserService) { }

  ngOnInit(): void {
   
    this.loadRole();
    
  }
  


  
  loadRole(): void {
    
    this.roleservice.findAllRoles().subscribe(roles => {
      this.roles = roles;
    });
  }
  onSubmit(): void {
 /*   this.newTask.projetT = this.selectedProject;
    this.newTask.taskStatus = this.selectedTaskStatus;
    this.newTask.priority = this.selectedPriority;
    this.newTask.projetT = this.selectedProject;
    this.newTask.employeeTask=this.selectedEmployee;*/


    this.userService.addUser(this.newUser).subscribe(() => {
      this.dialogRef.close(true); 
    });
  }

  onClose(): void {
    this.dialogRef.close(); 
  }

  

  

}


/*
 OnInit {
  userForm : FormGroup ;
  submitted = false;
  genderOptions = [
    { value: '1', label: 'Female' },
    { value: '0', label: 'Male' }
  ];
  constructor(private  formbulder:FormBuilder, private dialogRef: MatDialogRef<AddUserComponent>,private router: Router,private userService: UserService) {
    this.userForm = this.formbulder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(8)]],
      adresse: ['', Validators.required],
      birthdate:['', Validators.required],
      phonenumber:['', [Validators.required,this.positiveNumberValidator()]],
      gender: ['', Validators.required],
    });

  }




  ngOnInit(): void {

      }
  addUser() {
    this.submitted = true;
    if (this.userForm.valid) {
      const newuser: User = this.userForm.value as User;
      this.userService.addUser(newuser).subscribe(
        response => {
          // Handle success, if needed
          console.log('User added successfully:', response);
          this.router.navigate(['/back/findall']);
          this.userForm.reset();

        },
        error => {
          // Handle error
          console.error('Error adding user:', error);
        }
      );}
  }
    positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (Validators.required(control) !== null || isNaN(value) || value < 0) {
        return { 'positiveNumber': { value } };
      }
      return null;
    };
  }

}
*/