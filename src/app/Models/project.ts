import { User } from "./User";
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

   
}
