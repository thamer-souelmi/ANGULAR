import { User } from "./User";


export class Message {
  messageId!: number;
  msg: string | null = null; 
  t_stamp!: string;
  sender!: User;

}
