import { PaymentStatus } from "./payment-status";
import { Project } from "./project";

export class Invoice {
    invoice_id !: number;
    item!:string;
    invoiceDescription!: string;
     issueDateinvoice!: Date;
     quantity!: number;
      unitPrice!: number;
     totalAmount!: number;
     projetInvoice!:Project;    
    paymentMethods!: string;
    paymentStatus!:PaymentStatus;
    
}
