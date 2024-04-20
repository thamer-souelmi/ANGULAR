import  {User} from './User';
export enum TypeAttendance {
  SICK_LEAVE = 'SICK_LEAVE',
  PAID_LEAVE = 'PAID_LEAVE',
  IMPAID_LEAVE = 'IMPAID_LEAVE',
  ANNUAL_LEAVE = 'ANNUAL_LEAVE',
  UNEXPLAINED_LEAVE = 'UNEXPLAINED_LEAVE'
}

export class Attendance {
  attendenceId?: number;
  presence: boolean;
  approved?: boolean;
  reason?: string;
  date?: Date;
  typeAttendance: TypeAttendance; // Change type to TypeAttendance enum
  employee?: User;
  admin?: User;

  constructor(presence: boolean, typeAttendance: TypeAttendance) {
      this.presence = presence;
      this.typeAttendance = typeAttendance;
  }
}
