import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import {ProjectOfferService} from "../../../../Services/project-offer.service";
import {Location} from "@angular/common";
import {ProjectOffer} from "../../../../Models/project-offer";
import { ProjectOfferStatus } from 'src/app/Models/project-offer-status';

@Component({
  selector: 'app-update-projectoffer',
  templateUrl: './update-projectoffer.component.html',
  styleUrls: ['./update-projectoffer.component.css']
})
export class UpdateProjectofferComponent implements  OnInit{
  protected aFormGroup: FormGroup | undefined;
  siteKey: string = '6LeCnZUpAAAAAMDRTsdCXxDoRlyGZoojn4E0JKUu';
  ProjectOfferForm: FormGroup;
  projectoffer: ProjectOffer = new ProjectOffer();
  etatValues = Object.values(ProjectOfferStatus);


  constructor( private route: ActivatedRoute,private router: Router,private formBuilder: FormBuilder, private po: ProjectOfferService, private location: Location) {
    this.ProjectOfferForm = this.formBuilder.group({
      projectTitle: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      postedDate: [new Date()],
    });
  }

  ngOnInit(){
    
    this.route.paramMap.subscribe(params => {
      const projectofferid = +params.get('id')!;
      this.getaprojectoffer(projectofferid);
    });
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }

  getaprojectoffer(projectofferid : number){
    this.po.getProjectOfferById(projectofferid).subscribe(
      (projectOffer: ProjectOffer) =>{
        this.projectoffer= projectOffer;
        this.ProjectOfferForm.patchValue(
          {
            projectTitle: projectOffer.projectTitle,
            description: projectOffer.description,
            status: projectOffer.status,
            postedDate: projectOffer.postedDate,
          }
        );
      },
      error => {
        console.error('Error loading Project offer:', error);

      }
    );
  }
  onSubmit() {
    if (this.ProjectOfferForm.valid) {
      const projectOffer: ProjectOffer = this.ProjectOfferForm.value
      projectOffer.offerId= this.projectoffer.offerId;
      this.po.updateProjectOffer(projectOffer).subscribe(
        () => {
          console.log('Project offer added successfully:');
          alert('Project offer added successfully!');
          this.router.navigate(['/projectoffer/getprojectoffers']);

        },
        error => {
          console.error('Error adding project offer:', error);
        }
      );
    }
  }

  cancel() {
    this.location.back();
  }

}
