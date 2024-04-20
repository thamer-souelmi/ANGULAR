import { Component } from '@angular/core';
import {QuoteService} from "../../../../Services/quote.service";
import {Quote} from "../../../../Models/quote";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddQuoteComponent } from '../add-quote/add-quote.component';


@Component({
  selector: 'app-get-quotes',
  templateUrl: './get-quotes.component.html',
  styleUrls: ['./get-quotes.component.css']
})
export class GetQuotesComponent {
  quotes: Quote[] = [];
  constructor(private dialog: MatDialog,private qs:QuoteService,private  router : Router) {
  }
  updateQuote(quoteid: number) {
    this.router.navigate(['/quote/updatequote', quoteid]);
  }
  getallquotes(){
    this.qs.getQuotes().subscribe(obsquotes => this.quotes=obsquotes);
  }

  deleteQuote(quoteid: number) {
    if (confirm('Are you sure you want to delete this Quote?')) {
      this.qs.deleteQuoteservice(quoteid).subscribe(
        () => {
          console.log('Quote deleted successfully.');
          alert('Quote deleted successfully.');
          this.getallquotes();
        },
        error => {
          console.error(' Quote id:', quoteid);

          console.error('Error deleting Quote:', error);
        }
      );
    }
  }

  navigateToAddQuote() {
    this.router.navigate(['/quote/addquote']);
  }
  ngOnInit(){
    this.getallquotes();
  }


  openAddQuoteDialog(): void {
    const dialogRef = this.dialog.open(AddQuoteComponent, {
      width: '500px', // Adjust width as needed
    });


}}
