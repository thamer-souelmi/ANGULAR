import {TypeTS} from "./TypeTS";
import {User} from "./User";
import {RegistrationTS} from "./RegistrationTS";
import {FeedBack} from "./FeedBack";
import {TS_Status} from "./TS_Status";

export class TrainingSession {
  TS_id!: number;
  title!: string;
  start_Date!: Date;
  Finish_Date!: Date;
  Topic!: string;
  Capacity!: number;
  Place!: string;
  typeTS!: TypeTS;
  tsStatus!: TS_Status ;
  user!:User;
  registationtss!:RegistrationTS[];
  FeedBacks!: FeedBack[];


}
