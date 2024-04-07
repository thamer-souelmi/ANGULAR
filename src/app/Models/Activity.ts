import { Event} from "./Event";

export class Activity {
  activity_id!: number;
  activity_name!: string;
  description!: string;
  startTime!: Date;
  finishTime!: Date;
  event!: Event;
}
