export class JobOffer {
  jobOffer_id!: number;
  titleJobOffer!: string;
  postedDate!: Date;
  description!: string;
  jobLocation!:string;
  applicationDeadLine!: Date;
  experience!: string;
  requiredSkills!: string;
  vacancy!: number;
  minsalary!: number;
  maxsalary!: number;
  jobNature!:JobNature;
  jobCategory!:JobCategory;
}
//Enums
export enum JobNature {
  FULL_TIME=0,PART_TIME=1,INTERN=2
}
export enum JobCategory {
  SoftwareDevelopment=0,DataScience=1,Security=2,InfrastructureNetworking=3,WebDevelopment=4,Design=5,ProjectManagement=6,BusinessAnalysis=7,ConsultingAndSales=8
}
