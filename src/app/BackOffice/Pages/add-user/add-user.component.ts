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
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx'


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  user: User[] = []; 
  role!: Role; 
  roles: Role[] = []; 
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  imageSrcs: (string | ArrayBuffer | null)[] = [];

  genderOptions = [
    { value: '1', label: 'Female' },
    { value: '0', label: 'Male' }
  ];


  newUser: User = new User(); 
 


  constructor(private roleservice: RoleService, private dialogRef: MatDialogRef<AddUserComponent>,private userService: UserService,private toastr: ToastrService) { }

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

  readExcel(event: any): void {
    const file = event.target.files[0];
    
    // Check if a file is selected
    if (!file) {
      console.error('No file selected.');
      return;
    }
  
    // Check if the selected file is an Excel file
    const allowedFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!allowedFileTypes.includes(file.type)) {
      console.error('Invalid file type. Please select an Excel file.');
      return;
    }
  
    // Proceed with reading the Excel file
    const fileReader = new FileReader();
    this.toastr.success('Users saved successfully');
  
    fileReader.onload = (e) => {
      const workBook = XLSX.read(fileReader.result, { type: 'binary' });
      const sheetNames = workBook.SheetNames;
      const excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      console.log(excelData);
  
      // Check if the Excel data contains user objects
      if (this.isUserDataValid(excelData)) {
        // Send Excel data to backend to save users
        this.userService.saveUsers(excelData).subscribe(
          response => {
            console.log('Users saved successfully:', response);
          },
          error => {
            console.error('Error saving users:', error);
          }
        );
      } else {
        console.error('Invalid data format. Please make sure the Excel file contains user objects.');
      }
    };
  
    fileReader.readAsBinaryString(file);
  }
  
  isUserDataValid(data: any[]): boolean {
    // Check if the data array contains at least one object with properties expected for a user object
    if (data.length === 0) {
      return false;
    }
    
    const firstItem = data[0];
    // Assuming a user object has properties like 'name', 'email', 'username', etc.
    return Object.keys(firstItem).includes('email') && 
         Object.keys(firstItem).includes('firstname') && 
         Object.keys(firstItem).includes('lastname') && 
         Object.keys(firstItem).includes('password') && 
         Object.keys(firstItem).includes('adresse') && 
         Object.keys(firstItem).includes('birthdate') && 
         Object.keys(firstItem).includes('phonenumber') && 
         Object.keys(firstItem).includes('gender')   /* Add more properties as needed */;
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }

  }
  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.userService.upload(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.imageInfos = this.userService.getFiles();
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }});
    }
  }
  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageSrcs.push(reader.result);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
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