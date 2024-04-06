export class Interview {
  interview_id!: number ;
  dateInterview!:Date;
  type!:TypeInterview;
  statusInterview!:StatusInterview;
  passed!:boolean;
}

//Enums
export enum StatusInterview {
  SCHEDULED=0,
  IN_PROGRESS=1,
  COMPLETED=2,
  CANCELED=3
}
export enum TypeInterview {
  HR=0,
  TECHNICAL=1
}

