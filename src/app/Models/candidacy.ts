
export class Candidacy {
  candidacy_id!: number;
  candidateName!: string;
  link!: string;
  linkedin!: string;
  github!: string;
  cv!:string;
  email!:string;
  coverLetter!:string;
  submissionDate!:Date;
  candidacystatus!:number;
  linkedinData!:string;
  skills!:string;
  country!:string;
  educationHistory!:string;
  jobOfferId!: number; // Add jobOfferId property if it exists
  archived?: boolean;


}
