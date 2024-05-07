import {User} from "./User";
import {Event} from "./Event";
import {TrainingSession} from "./TrainingSession";
export class FeedBack {
  feedback_id!: number ;
  description!: string;
  FeedBack_date!: Date;
  note!: number;
  sentiment!: string;  // 'positive', 'neutral', 'negative'
  user!: User;
  event!: Event;
  trainingsession!: TrainingSession;

}
