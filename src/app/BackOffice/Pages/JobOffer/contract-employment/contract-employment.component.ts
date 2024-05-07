import {Component, OnInit} from '@angular/core';
import {ContractEmployment} from "../../../../Models/contract-employment";
import {ContractEmploymentService} from "../../../../Services/contract-employment.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs =pdfFonts.pdfMake.vfs;
import {ToastrService} from "ngx-toastr"; // Adjust the path as needed

@Component({
  selector: 'app-contract-employment',
  templateUrl: './contract-employment.component.html',
  styleUrls: ['./contract-employment.component.css']
})
export class ContractEmploymentComponent implements OnInit{
  contracts: ContractEmployment[] = [];
  searchtext:any;
  currentPage: number = 1; // Current page
  itemsPerPage: number = 2; // Items per page
  cvFile: File | null = null;
  currentDate: Date = new Date(); // Property to hold the current date
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  cvSrcs: (string | ArrayBuffer | null)[] = [];
  previews: string[] = [];
  cv?: Observable<any>;
  constructor(private contractService: ContractEmploymentService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.contractService.getAllContractEmployments()
      .subscribe(
        contracts => {
          this.contracts = contracts;
        },
        error => {
          console.error('Error fetching contracts:', error);
        }
      );
  }
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  getPaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.contracts.slice(startIndex, startIndex + this.itemsPerPage);
  }
  getTotalPages(): number {
    return Math.ceil(this.contracts.length / this.itemsPerPage);
  }
  getPaginationNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pagesArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
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
      this.contractService.upload(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.cv = this.contractService.getFiles();
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }});
    }
  }
  generatePDF(contract: ContractEmployment) {
    const docDefinition = {
      content: [
        {
          text: 'EMPLOYMENT CONTRACT',
          style: 'header'
        },
        {
          text: [
            'THIS EMPLOYMENT CONTRACT is made and entered into this ______ day of ____________, ________, by and between Consult ',
            ' hereinafter referred to as the "Employer", and ',
            { text: contract.candidateName, bold: true },
            ' hereinafter referred to as the "Employee".'
          ],
          style: 'bodyText'
        },
        {
          text: [
            'The Employer hereby employs the Employee and the Employee hereby accepts employment with the Employer, on the terms and conditions set forth in this Agreement.',
            'The Employee shall commence employment with the Employer on ',
            { text: contract.startDate, bold: true },
            ' and shall continue in such employment until ',
            { text: contract.endDate? contract.endDate : ' termination by either party with or without cause', bold: true },
            '.'
          ],
          style: 'bodyText'
        },
        {
          text: [
            'The Employee shall perform such duties as shall be assigned to the Employee by the Employer, and the Employee shall devote the Employee\'s full time and attention to the business of the Employer.',
            'The Employer shall pay the Employee a salary of ',
            { text: contract.salary, bold: true },
            ' per annum, payable in accordance with the Employer\'s regular payroll practices.'
          ],
          style: 'bodyText'
        },
        {
          text: [
            'This Agreement shall be governed by and construed in accordance with the laws of the state of Tunisia',
            '.'
          ],
          style: 'bodyText'
        },
        {
          text: [
            'IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.',
            'Employer:',
            '[Signature] __________________________',
            '[Print Name] [Employer Name]',
            'Employee:',
            '[Signature] __________________________'
          ],
          style: 'footer'
        }
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          margin: [0, 0, 0, 20] as [number, number, number, number] // Top margin
        },
        bodyText: {
          fontSize: 12,
          margin: [0, 5, 0, 5] as [number, number, number, number] // Top and bottom margin
        },
        footer: {
          fontSize: 10,
          margin: [0, 0, 0, 10] as [number, number, number, number] // Bottom margin
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }
  startBatchProcess() {
    this.contractService.startBatch().subscribe(

      response => {
        this.uploadFiles();
        this.toastr.success('Batch process started successfully!', 'Success');
        console.log('Batch process started successfully:', response);
        // Handle success, e.g., show a message to the user
      },
      error => {
        console.error('Error starting batch process:', error);
        // Handle error, e.g., show an error message to the user
      }
    );
  }
}
