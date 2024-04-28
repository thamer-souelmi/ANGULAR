
export enum ProjectOfferStatus {
    ACCEPTED,
    REJECTED,
    PENDING
  }
  export class ProjectOffer {
[x: string]: any;
      offerId!: number;
      projectTitle!: string;
      description!: string;
      postedDate!: Date
      companyname!:String; // New attribute
      companyemail!:String; // New attribute
      status!: ProjectOfferStatus;
  
      constructor() {
        this.status = ProjectOfferStatus.PENDING;
      }
  }
  