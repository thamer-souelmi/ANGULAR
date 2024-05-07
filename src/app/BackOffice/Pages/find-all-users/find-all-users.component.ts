import {ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import { User } from 'src/app/Models/User';


import { UserService } from 'src/app/Services/user.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Observable } from 'rxjs';
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import * as XLSX from 'xlsx'
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AddUserComponent } from '../add-user/add-user.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-find-all-users',
  templateUrl: './find-all-users.component.html',
  styleUrls: ['./find-all-users.component.css']
})
export class FindAllUsersComponent {
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
  roleOptions = [
    {label: 'Project_manager' ,value: 'pm'},
    {label:'admin'  ,value :'admin'},
    {label:'hr' ,value :'hr'},
    {label:'consultant' ,value : 'consultant'},
    {label:'Employee' , value: 'Employee'}
  ];

  users : User[] = [];
  @ViewChild('locationSelect') locationSelect: ElementRef | undefined;
  searchtext:any;
  users1: User[] = [];
  currentPage: number = 1; // Current page
  itemsPerPage: number = 6; // Items per page
  userForm: FormGroup;
  @ViewChild('myModal') myModal!: ElementRef;
  @ViewChild('warningSuccessModal') warningSuccessModal!: ElementRef;
  warningMessage: string = '';
  @ViewChild('addUserModal') addUserModal!: ElementRef;
  i:number=0;
  ExcelData : any ;
  constructor(private userService: UserService, private router: Router,private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private userauth : AuthService,
              private ngZone: NgZone,private route: ActivatedRoute,
              private dialog: MatDialog,private toastr: ToastrService) {
    this.userForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(8)]],
      adresse: ['', Validators.required],
      birthdate:['', Validators.required],
      phonenumber:['', [Validators.required]],
      gender: ['', Validators.required],
    role: ['', Validators.required], });
    recaptcha: ['', Validators.required]

  }
  getProfilePictureIndex(userIndex: number): number {
    return userIndex % this.imageSrcs.length;
  }


  ngOnInit(){
    this.loadUsers();
    


  }
  loadUsers(){
    this.userService.findAllUsers().subscribe(
      users => {
        this.users = users;
        this.users.forEach(user => {
          // Load the user's image
          this.getImage(user.image);
        });
      },
      error => {
        console.error('Error loading users:', error);
      }
    );
  }
  editUser(userId: number) {
    // Navigate to the Edit User route with the user ID as a parameter
    this.router.navigate(['/back/updateuser', userId]);
  }
  details(userId: number) {
    // Navigate to the Edit User route with the user ID as a parameter
    this.router.navigate(['/back/userdetails', userId]);
  }
  delete(userId: number) {
    if (confirm('Are you sure you want to delete this User?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          console.log('User deleted successfully.');
          alert('User deleted successfully.');
          this.loadUsers();
        },
        error => {
          console.error('Error deleting User:', error);
        }
      );
    }
  }
  onUserSubmit() {


    const newuser: User = this.userForm.value as User;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      newuser.image = this.selectedFiles[0].name;
    }
    this.userService.addUser(newuser).subscribe(
      response => {
        // Handle success, if needed
        console.log('User added successfully:', response);
        this.userForm.reset();

      },
      error => {
        // Handle error
        console.error('Error adding user:', error);
      }
    );
    this.uploadFiles();

  }
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }
  getPaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.users.slice(startIndex, startIndex + this.itemsPerPage);
  }
  getTotalPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
  }
  getPaginationNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pagesArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
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
  getImage(filename: string): void {
    if (!filename) return; // Skip if filename is not provided

    this.userService.getFile(filename).subscribe(
      (response: HttpResponse<Blob>) => {
        if (response && response.body) {
          this.createImageFromBlob(response.body);
        } else {
          console.error('Error: Response body is null.');
        }
      },
      error => {
        console.error('Error fetching image:', error);
      }
    );
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
    this.toastr.success('Hello world!', 'Toastr fun!');
  
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
  createNewTask(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '500px'
    });
  
    dialogRef.afterClosed().subscribe(result   => {
      if (result) {
      }
    });
  }
}