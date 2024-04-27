import {TrainingSession} from "./TrainingSession";

export enum Equipment {
  Projector = "Projector",
  Whiteboard = "Whiteboard",
  VideoConference = "Video Conference",
  Computer = "Computer",
  SpeakerSystem = "Speaker System"
}

export class Room {
  id?: number;
  nameRoom!: string;
  capacityRoom!: number;
  available!: boolean;
  equipmentR!: Equipment[];
  trainingSessions?: TrainingSession[];


}
