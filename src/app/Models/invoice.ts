export class Invoice {
    invoice_id !: number;
    issueDateinvoice!: Date;
    dueDateinvoice!: Date;
    invoiceDescription!: string;
    quantity!: number;
    unitPrice!: number;
    totalAmount!: number;
    paymentMethods!: string;
}
