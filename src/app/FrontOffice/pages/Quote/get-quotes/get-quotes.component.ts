import { ChangeDetectorRef, Component } from '@angular/core';
import {QuoteService} from "../../../../Services/quote.service";
import {Quote} from "../../../../Models/quote";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddQuoteComponent } from '../add-quote/add-quote.component';
import { UpdateQuoteComponent } from '../update-quote/update-quote.component';
import { FilterPipe } from '../../ProjectOffer/get-projectoffer/app-filter.pipe'; // Adjust the import path as necessary


@Component({
  selector: 'app-get-quotes',
  templateUrl: './get-quotes.component.html',
  styleUrls: ['./get-quotes.component.css'],
  providers: [FilterPipe] // Add the pipe to the providers array

})
export class GetQuotesComponent {
  quotes: Quote[] = [];
  searchText: string = '';

  constructor(    private cdr: ChangeDetectorRef,private dialog: MatDialog,private qs:QuoteService,private  router : Router,private appFilterPipe: FilterPipe) {
  }
  updateQuote(quoteid: number,) {
    // this.router.navigate(['/home/updatequote', quoteid]);
      const dialogRef = this.dialog.open(UpdateQuoteComponent, {
        width: '400px', // Adjust dialog width as needed
        height: "750px",
        data: { quoteid: quoteid } // Pass clicked date to dialog if needed
      });
      dialogRef.afterClosed().subscribe(result => {
        // Met à jour la liste des citations après la fermeture de la boîte de dialogue
        this.getallquotes();
      });
    
      // this.router.navigate(['/home/update-project-offer', projectofferid]);
    
  }
  getallquotes(){
    this.qs.getQuotes().subscribe(obsquotes => this.quotes=obsquotes);
    this.cdr.detectChanges();
  }
  filterQuotes(): void {
    if (!this.searchText || this.searchText.trim().length === 0) {
      // If searchText is empty or only contains whitespace, reset projectoffers to its original state
      // Assuming you have a method or property to get the original list of project offers
      this.getallquotes();
    } else {
      // If searchText is not empty, apply the filter
      this.quotes = this.appFilterPipe.transform(this.quotes, this.searchText);
    }
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
    this.router.navigate(['/home/addquote']);
  }
  ngOnInit(){
    this.getallquotes();
  }


  


  openAddQuoteDialog(): void {
    const dialogRef = this.dialog.open(AddQuoteComponent, {
      width: '500px', // Adjust width as needed
    });
    dialogRef.afterClosed().subscribe(result => {
      // Met à jour la liste des citations après la fermeture de la boîte de dialogue
      this.getallquotes();
    });
    

}}
