import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
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


}
