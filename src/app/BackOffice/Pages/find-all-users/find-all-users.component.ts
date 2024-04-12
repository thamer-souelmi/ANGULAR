import {ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import { User } from 'src/app/Models/User';


import { UserService } from 'src/app/Services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AuthService } from 'src/app/Services/auth.service';
import { Observable } from 'rxjs';
import {HttpEventType, HttpResponse} from "@angular/common/http";

import * as XLSX from 'xlsx'

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
  itemsPerPage: number = 1; // Items per page
  userForm: FormGroup;
  @ViewChild('myModal') myModal!: ElementRef;
  @ViewChild('warningSuccessModal') warningSuccessModal!: ElementRef;
  warningMessage: string = '';
  @ViewChild('addUserModal') addUserModal!: ElementRef;
  ExcelData : any ;
  constructor(private userService: UserService, private router: Router,private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private userauth : AuthService,
              private ngZone: NgZone,private route: ActivatedRoute) {
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

  }


  ngOnInit(){
    this.loadUsers();

  }
  loadUsers(){
    this.userService.findAllUsers().subscribe(
      users => {
        this.users = users;
        this.users.forEach(user => {
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
    this.router.navigate(['/admin/updateuser', userId]);
  }
  details(userId: number) {
    // Navigate to the Edit User route with the user ID as a parameter
    this.router.navigate(['/admin/userdetails', userId]);
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
    return this.users1.slice(startIndex, startIndex + this.itemsPerPage);
  }
  getTotalPages(): number {
    return Math.ceil(this.users1.length / this.itemsPerPage);
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
    let file = event.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      console.log(this.ExcelData);

      // Send Excel data to backend to save users
      this.userService.saveUsers(this.ExcelData).subscribe(
        response => {
          console.log('Users saved successfully:', response);
        },
        error => {
          console.error('Error saving users:', error);
        }
      );
    };

    fileReader.readAsBinaryString(file);
  }
}
