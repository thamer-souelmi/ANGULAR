import { Status } from "./Status";
import { User } from "./User";
import { Event } from "./Event";

export class RegistrationEvent {
  registrationE_id!: number;
  registration_date!: Date;
  registrationEvent_status!: Status;
  locked!: boolean;
  user!: User;
  event!: Event;

  constructor() {
    this.registration_date = new Date();
  }
}
