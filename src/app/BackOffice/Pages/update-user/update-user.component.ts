import { HttpEventType, HttpResponse } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import { Observable } from 'rxjs';
import { User } from 'src/app/Models/User';
import { StorageService } from 'src/app/Services/storage.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit{

  userForm: FormGroup;
  user: User = new User();
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

  constructor(private formbulder: FormBuilder, private userService: UserService,private router: Router,private route: ActivatedRoute , private s : StorageService) {
    this.userForm = this.formbulder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      adresse: ['', Validators.required],
      birthdate:['', Validators.required],
      phonenumber:['', [Validators.required]],
      gender: ['', Validators.required],
    })
  }

  updateuser() {
    if (this.userForm.valid) {
      const updateduser: User = this.userForm.value;
      updateduser.userId = this.user.userId;
      if (this.selectedFiles && this.selectedFiles.length > 0) {
        updateduser.image = this.selectedFiles[0].name;
      }
      this.userService.updateUser(updateduser).subscribe(
        () => {
          console.log('User updated successfully.');
          alert('User updated successfully.');
          this.router.navigate(['/back/findall']);
        },
        error => {
          console.error('Error updating job offer:', error);
        }
      );
    }
  }



  ngOnInit() {
    // Retrieve the user ID from the route parameters
   this.route.paramMap.subscribe(params =>{
     const userid= this.s.getUser().id;
     this.loadUser(userid);
   })
  }
  loadUser(userid: number) {
    console.log('User ID from route parameters:', userid);

    this.userService.getUserById(userid).subscribe(
      (user: User) => {
        console.log('User loaded successfully:', user);

        this.user = user;
        this.userForm.patchValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          adresse: user.adresse,
          birthdate : user.birthdate,
          phonenumber : user.phonenumber,
          gender: user.gender,
          
        });
      },
      error => {
        console.error('Error loading user:', error);
      }
    );
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
