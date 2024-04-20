import { ContractStatus } from "./contract-status";

export class Contract {
    contract_id!: number;
    numContract!: number;
    signatureDate!: Date;
    startDateContract!: Date;
    endDateContract!: Date;
    contractStatus!: ContractStatus;

}
