import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Contract } from 'src/app/Models/contract';
import { ContractService } from 'src/app/Services/contract.service';
import { EditContractComponent } from '../edit-contract/edit-contract.component';
import { MatDialog } from '@angular/material/dialog';
import { AddcontractComponent } from '../addcontract/addcontract.component';

@Component({
  selector: 'app-getallcontracts',
  templateUrl: './getallcontracts.component.html',
  styleUrls: ['./getallcontracts.component.css']
})
export class GetallcontractsComponent implements OnInit,AfterViewInit {
  contracts: Contract[] = [];
  sortedData: Contract[] = [];
  dataSource = new MatTableDataSource<Contract>([]); 
  selection = new SelectionModel<Contract>(true, []);// checkbox
  selectedInvoice: Contract | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 3;
  pageIndex = 0;

sliceFrom = 0; 
  sliceTo = this.pageSize;
  projectId!: number; 
  searchtext:any;


  constructor(private contractService: ContractService, private route: ActivatedRoute,private elementRef: ElementRef, public dialog: MatDialog) { }

  ngOnInit(): void {
    
    
      
      this.getContracts();
    }
    getContracts(): void {
      this.contractService.getAllcontracts()
        .subscribe(contracts => {
          
          this.sortedData = contracts; // ajouter ca sorttt
          this.contracts = contracts;
          this.sliceProjects();
        this.sortedData = this.contracts.slice(); // //sort
        this.dataSource = new MatTableDataSource<Contract>(this.contracts); // Initialisez votre source de données ici
        this.dataSource.paginator = this.paginator; 
          console.log(contracts);
        });
    }
    onPageChange(event: PageEvent): void {
      this.pageIndex = event.pageIndex;
      this.sliceProjects();
    }
    sliceProjects(): void {
      this.sliceFrom = this.pageIndex * this.pageSize;
      this.sliceTo = Math.min(this.sliceFrom + this.pageSize, this.contracts.length); 
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
    
    getDisplayedProjects(): Contract[] {
      return this.sortedData.slice(this.sliceFrom, this.sliceTo);
      
    }
    sortData(sort: Sort) {
      const data = this.contracts.slice();
    
      if (!sort.active || sort.direction === '') {
        this.sortedData = data;
        return;
      }
      this.sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'startDateContract':
            return this.compare(new Date(a.startDateContract), new Date(b.startDateContract), isAsc);
          case 'endDateContract':
            return this.compare(new Date(a.endDateContract), new Date(b.endDateContract), isAsc);
            case 'signatureDate':
              return this.compare(new Date(a.signatureDate), new Date(b.signatureDate), isAsc);
          case 'projetContract':
            const firstnameA = a.projetContract ? a.projetContract.projectName : '';
            const firstnameB = b.projetContract ? b.projetContract.projectName : '';
            return this.comparestring(firstnameA, firstnameB, isAsc);
          default:
            return 0;
        }
      });
      
    }
    
    compare(a: Date, b: Date, isAsc: boolean): number {
      if (a < b) {
        return isAsc ? -1 : 1;
      } else if (a > b) {
        return isAsc ? 1 : -1;
      } else {
        return 0;
      }
    }
    comparestring(a: String, b: String, isAsc: boolean): number {
      if (a < b) {
        return isAsc ? -1 : 1;
      } else if (a > b) {
        return isAsc ? 1 : -1;
      } else {
        return 0;
      }
    }
    showEditIcon(invoice: Contract): boolean {
      console.log('Selected contract:', this.selectedInvoice);
      console.log('contract ID:', invoice.contract_id);
      return this.selectedInvoice === invoice; // Afficher l'icône d'édition uniquement si la ligne est sélectionnée
    }
    
    onRowClick(invoice: Contract): void {
      console.log('Contract clicked:', invoice);
      if (this.selectedInvoice === invoice) {
        // Si l'invoice sélectionné est déjà celui sur lequel nous avons cliqué, le désélectionner
        this.selectedInvoice = null;
      } else {
        // Sinon, sélectionner l'invoice sur lequel nous avons cliqué
        this.selectedInvoice = invoice;
      }
      console.log('Selected Contract after click:', this.selectedInvoice);
    }
    showDeleteIcon(row: Contract): boolean {
      return this.selectedInvoice === row; // Afficher l'icône d'édition uniquement si la ligne est sélectionnée
    }
    editcontract(): void {
      if (this.selectedInvoice) {
        const dialogRef = this.dialog.open(EditContractComponent, {
          width: '500px',
          data: { contract: this.selectedInvoice } // Pass the selected invoice data
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Handle the result if needed
          }
        });
      } else {
        console.error('Selected Contract is null.');
      }
    }
    deleteTask(contract_id: number) {
      if (confirm('Are you sure you want to delete this Contract?')) {
      this.contractService.deletecontract(contract_id).subscribe(() => {
      });
    }
    }

    createNewItem(): void {
      const dialogRef = this.dialog.open(AddcontractComponent, {
        width: '500px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      });
    }

}
