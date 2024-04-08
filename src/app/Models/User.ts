import { Gender } from "./gender";
import {Role} from "./role";

export class User {
    userId!: number ;
    email!: string;
    firstname!: string;
    lastname!: string;
    password!: string;
    adresse!: string;
   birthdate!: Date;
  phonenumber!:number;
    gender!:Gender;
    role!: Role
}
