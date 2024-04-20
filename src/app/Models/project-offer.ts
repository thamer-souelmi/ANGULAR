
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
      status!: ProjectOfferStatus;
  
      constructor() {
        this.status = ProjectOfferStatus.PENDING;
      }
  }
  