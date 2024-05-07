import {TrainingSession} from "./TrainingSession";

export enum Equipment {
  Projector = "Projector",
  Whiteboard = "Whiteboard",
  VideoConference = "Video Conference",
  Computer = "Computers",
  SpeakerSystem = "Speaker System",
  Smartboard="Smartboard",
  highSpeedInternetAccess="High Speed Internet Access",
  AirConditioningorClimateControl ="Air Conditioning or Climate Control"
}

export class Room {
  id?: number;
  nameRoom!: string;
  capacityRoom!: number;
  available!: boolean;
  bookingDates!: Date[];
  equipmentR!: Equipment[];
  trainingSessions?: TrainingSession[];


}
