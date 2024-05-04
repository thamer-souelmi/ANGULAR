import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Invoice } from 'src/app/Models/invoice';
import { InvoiceService } from 'src/app/Services/invoice.service';

@Component({
  selector: 'app-edit-invoice-item',
  templateUrl: './edit-invoice-item.component.html',
  styleUrls: ['./edit-invoice-item.component.css']
})
export class EditInvoiceItemComponent implements OnInit{
  invoice!: Invoice;

  constructor(
    private dialogRef: MatDialogRef<EditInvoiceItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private invoiceservice: InvoiceService
  ) {
    this.invoice = { ...data.invoice };
    

  }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }
  onSubmit(): void {
    

    this.invoiceservice.UpdateInvoice(this.invoice).subscribe(updatedTask => {
      this.dialogRef.close(updatedTask);
    });
  }

  isValidStartDate(): boolean {
    const today = new Date();
    return new Date(this.invoice.issueDateinvoice) >= today;
  }
  isValidPositiveValue(value: number): boolean {
    return value > 0;
}

}
