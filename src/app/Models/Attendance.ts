import  {User} from './User';


export class Attendance {
  attendenceId?: number;
  presence!: boolean;

  start?: Date;
  end?: Date;
  employee?: User;
  admin?: User;
  workedHours!: number;
}

