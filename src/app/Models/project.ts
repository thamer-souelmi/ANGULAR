import { User } from "./User";
import { Contract } from "./contract";
import { Invoice } from "./invoice";
import { StatusProject } from "./status-project";
import { Task } from "./task";

export class Project {
    projectId!: number ;
    projectName!:string;
    projectDescription!:string;
    startdateProject!:Date;
    enddateProject!:Date;
    projectStatus!:StatusProject;
    tasks!:Task[];
    projectManager!:User;
    fileName!:String;
    invoices!:Invoice[];
    contracts!:Contract;

   
}
