import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import {QuoteService} from "../../../../Services/quote.service";
import {Location} from "@angular/common";
import {Quote} from "../../../../Models/quote";
import {ProjectOffer} from "../../../../Models/project-offer";

@Component({
  selector: 'app-update-quote',
  templateUrl: './update-quote.component.html',
  styleUrls: ['./update-quote.component.css']
})
export class UpdateQuoteComponent implements  OnInit{
  protected aFormGroup: FormGroup | undefined;
  siteKey: string = '6LeCnZUpAAAAAMDRTsdCXxDoRlyGZoojn4E0JKUu';
  QuoteForm: FormGroup;
  quote: Quote = new Quote();

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private quoteservice: QuoteService, private location: Location) {
    this.QuoteForm = this.formBuilder.group({
      totalamount: ['', Validators.required],
      unitprice: ['', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required],
      issuanceDate: [new Date()],

    });
  }
  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      const quoteid = +params.get('id')!;
      this.getquote(quoteid);
    });
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }
  getquote(quoteid : number){
    this.quoteservice.getQuoteById(quoteid).subscribe(
      (quote: Quote) =>{
        this.quote= quote;
        console.log("id project offer quote",this.quote.projectOfferId);

        this.QuoteForm.patchValue(
          {
            totalamount: quote.totalamount,
            unitprice: quote.unitprice,
            quantity: quote.quantity,
            description: quote.description,
            issuanceDate: quote.issuanceDate,
          }
        );
      },
      error => {
        console.error('Error loading Project offer:', error);

      }
    );
  }


 

  onSubmit() {
    if (this.QuoteForm.valid) {
      const quote: Quote = this.QuoteForm.value;
      quote.quote_id=this.quote.quote_id;
      this.quoteservice.updateQuote(quote,this.quote.projectOfferId).subscribe(
        () => {
          console.log('quote updated successfully:');
          alert('quote updated successfully!');

        },
        error => {
          console.error('Error updating quote:', error);
        }
      );
    }
  }

  cancel() {
    this.location.back();
  }
}
