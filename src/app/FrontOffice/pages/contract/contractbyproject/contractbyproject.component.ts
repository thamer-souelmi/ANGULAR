import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import SignaturePad from 'signature_pad';
import { Contract } from 'src/app/Models/contract';
import { ContractService } from 'src/app/Services/contract.service';

@Component({
  selector: 'app-contractbyproject',
  templateUrl: './contractbyproject.component.html',
  styleUrls: ['./contractbyproject.component.css']
})
export class ContractbyprojectComponent implements OnInit {
  contracts: Contract[] = [];
  projectId!: number; 
  contract!:Contract;
  isExporting = false;

  ///
  signatureNeeded!: boolean;
  signaturePad!: SignaturePad;
  @ViewChild('canvas') canvasEl!: ElementRef;
  signatureImg!: string;
  ///
  constructor(private ts:ContractService,private router: Router,private route: ActivatedRoute,private datePipe: DatePipe,private elementRef: ElementRef){
    
  }
  
  ///
  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
  }

  startDrawing(event: Event) {
    // works in device not in browser
  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.signatureNeeded = this.signaturePad.isEmpty();
    if (!this.signatureNeeded) {
      this.signatureNeeded = false;
    }
  }
  getCurrentDate(): string {
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    return currentDate ? currentDate : 'N/A'; // Retourne 'N/A' si currentDate est null
  }
 

  ///
 
  ngOnInit(): void {
    
    const projectIdParam = this.route.snapshot.paramMap.get('projectId');
    if (projectIdParam !== null) {
      this.projectId = +projectIdParam;
      
      this.getInvoiceByProject(this.projectId);
    } else {
   
      console.error("Project ID is not provided in the URL.");
    }
    
  }

  getInvoiceByProject(projectId: number): void {
    this.ts.getInvoiceParProject(projectId)
      .subscribe(contract => {
        this.contract = contract;
        console.log(contract);
      });
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
        pdf.save('contract.pdf');
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
}
