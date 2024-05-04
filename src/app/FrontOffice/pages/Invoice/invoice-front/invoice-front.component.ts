import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Invoice } from 'src/app/Models/invoice';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { CurrencyConversionService } from 'src/app/Services/currency-conversion.service';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Sort } from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddInvoiceItemComponent } from '../add-invoice-item/add-invoice-item.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { EditInvoiceItemComponent } from '../edit-invoice-item/edit-invoice-item.component';
import { EmailinvoiceService } from 'src/app/Services/emailinvoice.service';

@Component({
  selector: 'app-invoice-front',
  templateUrl: './invoice-front.component.html',
  styleUrls: ['./invoice-front.component.css'], 
  

})
export class InvoiceFrontComponent implements OnInit,AfterViewInit{
  invoices: Invoice[] = [];
  subtotal: number = 0;
  vat: number = 0;
  total: number = 0;
  isExporting = false;
  subtotalConverted: number = 0;
  vatConverted: number = 0;
  totalConverted: number = 0;
  @ViewChild('addEventModal') addEventModal!: ElementRef;
  @ViewChild('warningSuccessModal') warningSuccessModal!: ElementRef;
  warningMessage: string = '';
  sortedData: Invoice[] = [];
  dataSource = new MatTableDataSource<Invoice>([]); 
  selection = new SelectionModel<Invoice>(true, []);// checkbox
  selectedInvoice: Invoice | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['select','#', 'item', 'invoiceDescription', 'quantity', 'unitPrice', 'totalAmount'];
  pageSize = 3;
  pageIndex = 0;

sliceFrom = 0; 
  sliceTo = this.pageSize;
  projectId!: number; 
  constructor(private invoiceService: InvoiceService, private route: ActivatedRoute,private elementRef: ElementRef,private currencyService: CurrencyConversionService,private toaster:ToastrService,public dialog: MatDialog,private emailService: EmailinvoiceService) { }

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
        
        this.sortedData = invoices; // ajouter ca sorttt
        this.invoices = invoices;
        this.sliceProjects();
      this.sortedData = this.invoices.slice(); // //sort
      this.dataSource = new MatTableDataSource<Invoice>(this.invoices); // Initialisez votre source de données ici
      this.dataSource.paginator = this.paginator; 
        console.log(invoices);
      });
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.sliceProjects();
  }
  sliceProjects(): void {
    this.sliceFrom = this.pageIndex * this.pageSize;
    this.sliceTo = Math.min(this.sliceFrom + this.pageSize, this.invoices.length); 
    console.log('sliceFrom:', this.sliceFrom, 'sliceTo:', this.sliceTo); 
  }
  ngAfterViewInit(): void {
    console.log('Paginator:', this.paginator);

    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
         
        this.pageIndex = event.pageIndex;
    
        this.sliceProjects();
      });
    }else {
      
    }
  }
  
  getDisplayedProjects(): Invoice[] {
    return this.sortedData.slice(this.sliceFrom, this.sliceTo);
    
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
    this.showSnackbar('upload success' , 'green');

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
  showSnackbar(message: string, color: string): void {
    // Create a snackbar element
    const snackbar = document.createElement('div');
    snackbar.textContent = message;

    // Apply styles for the specified color
    snackbar.style.backgroundColor = color;
    snackbar.style.color = 'white';
    snackbar.style.padding = '10px';
    snackbar.style.borderRadius = '5px';
    snackbar.style.position = 'fixed';
    snackbar.style.bottom = '20px';
    snackbar.style.left = '50%';
    snackbar.style.transform = 'translateX(-50%)';
    snackbar.style.zIndex = '9999';

    // Append snackbar to the body
    document.body.appendChild(snackbar);

    // Automatically hide the snackbar after 3 seconds
    setTimeout(() => {
      snackbar.remove();
    }, 3000);
  }
  exportToExcel(): void {
    this.showSnackbar('upload success' , 'green');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('dataTable'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'invoice.xlsx');
  }
  /*
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
  */
  ///// zidt hethi
  calculateValues(): void {
    // Logique pour calculer subtotal, VAT et total

    // Par exemple :
    this.subtotal = this.calculateSubtotal();
    this.vat = this.calculateVat();
    this.total = this.calculateTotal();

    // Mettre à jour les valeurs converties par défaut
   // this.convertToCurrency('EUR');
  }
  showModalWithMessage(message: string): void {
    this.warningMessage = message;
    const modalInstance = new bootstrap.Modal(this.warningSuccessModal.nativeElement);
    modalInstance.show();
  }


  //sorttt

  //sort
  sortData(sort: Sort) {
    const data = this.invoices.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'quantity':
          return this.compare((a.quantity), (b.quantity), isAsc);
        case 'unitPrice':
          return this.compare((a.unitPrice), (b.unitPrice), isAsc);
        case 'totalAmount':
          return this.compare((a.totalAmount), (b.totalAmount), isAsc);
        default:
          return 0;
      }
    });
  }
  
  compare(a: number, b: number, isAsc: boolean): number {
    if (a < b) {
      return isAsc ? -1 : 1;
    } else if (a > b) {
      return isAsc ? 1 : -1;
    } else {
      return 0;
    }
  }
  createNewItem(): void {
    const dialogRef = this.dialog.open(AddInvoiceItemComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }


showEditIcon(invoice: Invoice): boolean {
  console.log('Selected invoice:', this.selectedInvoice);
  console.log('Invoice ID:', invoice.invoice_id);
  return this.selectedInvoice === invoice; // Afficher l'icône d'édition uniquement si la ligne est sélectionnée
}

onRowClick(invoice: Invoice): void {
  console.log('Invoice clicked:', invoice);
  if (this.selectedInvoice === invoice) {
    // Si l'invoice sélectionné est déjà celui sur lequel nous avons cliqué, le désélectionner
    this.selectedInvoice = null;
  } else {
    // Sinon, sélectionner l'invoice sur lequel nous avons cliqué
    this.selectedInvoice = invoice;
  }
  console.log('Selected invoice after click:', this.selectedInvoice);
}
EditItem(): void {
  if (this.selectedInvoice) {
    const dialogRef = this.dialog.open(EditInvoiceItemComponent, {
      width: '500px',
      data: { invoice: this.selectedInvoice } // Pass the selected invoice data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result if needed
      }
    });
  } else {
    console.error('Selected invoice is null.');
  }
}
onSendEmail(): void {
  const element = document.getElementById('contentToExport');
  if (element) {
    html2canvas(element).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      
      // Générer le PDF et le sauvegarder
      const pdfDataUri = pdf.output('datauristring'); // Convertir le PDF en une chaîne de caractères représentant les données

      // Compter le nombre d'octets dans la chaîne de caractères
      const pdfDataLength = pdfDataUri.length;

      // Convertir la chaîne de caractères en tableau d'octets
      const byteArray = new Uint8Array(pdfDataLength);
      for (let i = 0; i < pdfDataLength; i++) {
        byteArray[i] = pdfDataUri.charCodeAt(i) & 0xff;
      }

      const attachmentData = byteArray.buffer; // Convertir le tableau d'octets en ArrayBuffer
      const recipientEmail = 'malek.frikhi@esprit.tn'; // Mettez ici l'adresse e-mail du destinataire

      // Convertir l'ArrayBuffer en Uint8Array
      const uint8Array = new Uint8Array(attachmentData);

      // Appeler le service d'e-mail avec les données de la pièce jointe et l'e-mail du destinataire
      this.emailService.sendEmailWithAttachment(uint8Array, recipientEmail).subscribe(response => {
        console.log('E-mail envoyé avec succès !', response);
        // Affichez un message de succès ou effectuez d'autres actions si nécessaire
      }, error => {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        // Gérez l'erreur de manière appropriée
      });
    });
  } else {
    console.error('Element with id "contentToExport" not found.');
  }
}





}
