import {User} from "./User";
import {RegistrationEvent} from "./RegistrationEvent";
import {Activity} from "./Activity";
import {FeedBack} from "./FeedBack";

export class Event{
  eventId!: number;
  event_name!: string;
   latitude!:number;
   longitude!:number ;
  event_description!: string ;
  place !:string;
  event_date!: Date;
  finishevent_date!:Date;
  users!: User [];
  RegistationEvents!:RegistrationEvent[];
  Activitys!: Activity[];
  feedbacks!: FeedBack[];
  averageRating?: number;

}
