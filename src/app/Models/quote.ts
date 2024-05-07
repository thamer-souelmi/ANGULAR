
export enum ProjectOfferStatus {
    ACCEPTED,
    REJECTED,
    PENDING
  }
  export class ProjectOffer {
    offer_id!: number;
    projectTitle!: string;
    description!: string;
    postedDate!: Date;
    companyname!:String; // New attribute
    companyemail!:String; // New attribute
    status!: ProjectOfferStatus;
  
    constructor() {
      this.status = ProjectOfferStatus.PENDING;
    }
  }
  export class Quote {
    quote_id!: number;
    issuanceDate!: Date;
    description!: string;
    quantity!: number;
    unitprice!: number;
    totalamount!: number;
    projectofferquote!: ProjectOffer;
    projectOfferId!: number; // New property to store the associated project offer ID
  
  
  
  
  }
  
  