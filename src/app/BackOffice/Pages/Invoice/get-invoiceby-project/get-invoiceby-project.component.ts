import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from 'src/app/Models/invoice';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { CurrencyConversionService } from 'src/app/Services/currency-conversion.service';
@Component({
  selector: 'app-get-invoiceby-project',
  templateUrl: './get-invoiceby-project.component.html',
  styleUrls: ['./get-invoiceby-project.component.css']
})
export class GetInvoicebyProjectComponent implements OnInit{
  invoices: Invoice[] = [];
  subtotal: number = 0;
  vat: number = 0;
  total: number = 0;

  subtotalConverted: number = 0;
  vatConverted: number = 0;
  totalConverted: number = 0;
  @ViewChild('addEventModal') addEventModal!: ElementRef;

  projectId!: number; 
  constructor(private invoiceService: InvoiceService, private route: ActivatedRoute,private elementRef: ElementRef,private currencyService: CurrencyConversionService) { }

  ngOnInit(): void {
    
    const projectIdParam = this.route.snapshot.paramMap.get('projectId');
    if (projectIdParam !== null) {
      this.projectId = +projectIdParam;
      
      this.getInvoiceByProject(this.projectId);
    } else {
   
      console.error("Project ID is not provided in the URL.");
    }
    this.calculateValues(); ///// zidt hethi
  }

  getInvoiceByProject(projectId: number): void {
    this.invoiceService.getInvoiceParProject(projectId)
      .subscribe(invoices => {
        this.invoices = invoices;
        console.log(invoices);
      });
  }
  calculateSubtotal(): number {
    return this.invoices.reduce((acc, invoice) => acc + invoice.unitPrice * invoice.quantity, 0);
  }
  
  calculateVat(): number {
    return this.calculateSubtotal() * 0.1; // Assuming VAT is 10%
  }
  
  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateVat();
    
  }
  exportToPdf(): void {
    const element = this.elementRef.nativeElement.querySelector('#contentToExport'); // Sélectionnez l'élément à exporter
    if (element) {
      element.classList.add('pdf-content');
      html2canvas(element).then(canvas => {
       
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('invoice.pdf');
        element.classList.remove('pdf-content');
      });
    } else {
      console.error('Element with id "contentToExport" not found.');
    }
  }
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('dataTable'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'invoice.xlsx');
  }
  convertToCurrency(currency: string): void {
    this.currencyService.convertToCurrency(this.subtotal, currency).subscribe(subtotalConverted => {
      this.subtotalConverted = subtotalConverted;
    });

    this.currencyService.convertToCurrency(this.vat, currency).subscribe(vatConverted => {
      this.vatConverted = vatConverted;
    });

    this.currencyService.convertToCurrency(this.total, currency).subscribe(totalConverted => {
      this.totalConverted = totalConverted;
    });
  }
  ///// zidt hethi
  calculateValues(): void {
    // Logique pour calculer subtotal, VAT et total

    // Par exemple :
    this.subtotal = this.calculateSubtotal();
    this.vat = this.calculateVat();
    this.total = this.calculateTotal();

    // Mettre à jour les valeurs converties par défaut
    this.convertToCurrency('EUR');
  }
}
