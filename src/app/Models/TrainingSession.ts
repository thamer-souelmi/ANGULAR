import {TypeTS} from "./TypeTS";
import {User} from "./User";
import {RegistrationTS} from "./RegistrationTS";
import {FeedBack} from "./FeedBack";
import {TS_Status} from "./TS_Status";
import {Room} from "./Room";
import {PlaceType} from "./placeType";

export interface TrainingSession {
  ts_id?: number;
  title: string;
  start_date: Date;
  finish_date: Date;
  topic: string;
  place: string;
  capacity: number;
  typeTS: TypeTS;
  tsStatus: TS_Status;
  user?: User;
  registrationtss?: RegistrationTS[];
  feedbacks?: FeedBack[];
  room?: Room;
  placeType: PlaceType;
}
