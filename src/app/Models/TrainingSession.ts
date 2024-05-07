import {TypeTS} from "./TypeTS";
import {User} from "./User";
import {RegistrationTS} from "./RegistrationTS";
import {FeedBack} from "./FeedBack";
import {TS_Status} from "./TS_Status";
import {Room} from "./Room";
import {PlaceType} from "./placeType";

export interface TrainingSession {
  ts_id?: number;               // Make sure this is optional if it's auto-generated on the server
  title: string;
  target_audience: string;
  session_outline: string;
  expected_outcomes: string;
  start_date: string;           // Dates as strings to match the 'yyyy-MM-dd'T'HH:mm' format
  finish_date: string;
  topic: string;
  place: string;               // Make nullable if it can be empty
  capacity: number;
  typeTS: TypeTS;               // Ensure enum names match and are used consistently
  tsStatus: TS_Status;          // This needs to match the Java enum name, if exposed as tsStatus in JSON
  users?: User[];
  trainerId?: User;
  registrationtss?: RegistrationTS[];
  feedbacks?: FeedBack[];       // Adjust naming to be consistent in pluralization
  room?: Room;
  placeType: PlaceType;
  registeredCount : number ;
}
