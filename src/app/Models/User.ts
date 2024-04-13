import { Gender } from "./gender";
import { Project } from "./project";
import {Role} from "./role";
import { Task } from "./task";

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

    //malekk
    projects!:Project[];
    employeeTasks!:Task[];



    role!: Role[];
    image!: string;

}
