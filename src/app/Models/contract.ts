import { ContractStatus } from "./contract-status";
import { Project } from "./project";

export class Contract {
    contract_id!: number;
    numContract!: number;
    signatureDate!: Date;
    startDateContract!: Date;
    endDateContract!: Date;
    paymentMethods!:string;
    contractStatus!: ContractStatus;
    projetContract!:Project;

}
