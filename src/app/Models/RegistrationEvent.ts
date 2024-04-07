import {Status} from "./Status";
import {User} from "./User";
import {Event} from "./Event";

export class RegistrationEvent {
  registrationE_id! : number;
  registration_date! : Date;
  RegistrationEvent_status!: Status;
  user!:User;
  event!:Event;

}
