


import {TrainingSession} from "./TrainingSession";
import {Event} from "./Event";

export interface LeaveRequestDTO {
  firstname: string;
  lastname: string;
  leaveCredit: number;
  trainingSession: TrainingSession[];
  thisMonth: number;
  thisYear: number;
  event: Event[];
}
