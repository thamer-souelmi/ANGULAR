import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Quote } from 'src/app/Models/quote';
import { QuoteService } from 'src/app/Services/quote.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectOfferService } from 'src/app/Services/project-offer.service';
import { ProjectOffer } from 'src/app/Models/project-offer';
import { error } from 'console';



@Component({
  selector: 'app-add-quote',
  templateUrl: './add-quote.component.html',
  styleUrls: ['./add-quote.component.css']
})
export class AddQuoteComponent {
  protected aFormGroup: FormGroup | undefined;
  siteKey: string = '6LeCnZUpAAAAAMDRTsdCXxDoRlyGZoojn4E0JKUu';
  QuoteForm: FormGroup;
  projectOffers: any[] = []; // Array to hold the fetched ProjectOffers
  projectoffer: ProjectOffer = new ProjectOffer();
  

  constructor(private projectOfferService: ProjectOfferService,private router: Router, private formBuilder: FormBuilder, private quoteservice: QuoteService, private location: Location) {
    this.QuoteForm = this.formBuilder.group({
      totalamount: ['1212', Validators.required],
      unitprice: ['12', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required],
      issuanceDate: [new Date()],
      projectofferquoteOfferId: ['', Validators.required] // Ensure this control is for the ProjectOffer ID


    });
  }


  onSubmit() {
    if (this.QuoteForm.valid) {
       const quote: Quote = this.QuoteForm.value;
       this.quoteservice.addQuote(quote, this.QuoteForm.value.projectofferquoteOfferId).subscribe(
         (addedQuote: Quote) => {
           console.log('quote added successfully:', this.QuoteForm.value.projectofferquoteOfferId);
           alert('quote added successfully!');
           this.router.navigate(['/home/getquote']);
         },
         error => {
          console.error('Error adding quote:', error);
          if (error.status === 400) {
             if (error.error.includes('Quotes cannot be added to an accepted project offer')) {
               alert('Quotes cannot be added to an accepted project offer.');
             } else if (error.error.includes('Maximum number of quotes reached for this project offer')) {
               alert('Maximum number of quotes reached for this project offer.');
             } else {
               alert(error.error); // Display the error message from the backend
             }
          } else {
             alert('An unexpected error occurred.');
          }
         }
         
       );
    }
   }
   



  // onSubmit() {
  //   if (this.QuoteForm.valid) {
  //     console.log(this.QuoteForm.value); 
  //     console.log("add success")
  //     // Debug: Check if projectOfferId is captured

  //      const quote: Quote = this.QuoteForm.value;
  //     //  this.projectoffer=this.projectOfferService.getProjectOfferById( this.QuoteForm.value.projectofferquoteOfferId);

  //      this.quoteservice.addQuote(quote,this.QuoteForm.value.projectofferquoteOfferId).subscribe(
  //        (addedQuote: Quote) => {
  //          console.log('quote added successfully:', this.QuoteForm.value.projectofferquoteOfferId);
  //          alert('quote added successfully!'+this.QuoteForm.value.projectofferquoteOfferId);
  //          this.router.navigate(['/quote/getquote']);
  //        },
  //        error => {
  //          console.error('Error adding quote:', error);
  //        }
  //      );
  //   }
  //  }
   

  cancel() {
    this.location.back();
  }
  ngOnInit() {
    this.fetchProjectOffers();
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
 }

 fetchProjectOffers() {
    this.projectOfferService.getProjectOffers().subscribe(
      (projectOffers: any[]) => {
        this.projectOffers = projectOffers;
      },
      error => {
        console.error('Error fetching project offers:', error);
      }
    );
 }
}
