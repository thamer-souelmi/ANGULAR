import { User } from "./User";
import { Priority } from "./priority";
import { Project } from "./project";
import { TaskStatus } from "./task-status";

export class Task {
    taskid!:number;
    startDateTask!:Date;
    taskname!:string;
    progress!: number;
    duration!: number;
    parent!: number;
    dueDateTask!:Date;
    taskDescription!:string;
    priority!:Priority;
    taskStatus!:TaskStatus;
    projetT!:Project | null;
    employeeTask!:User | null;
   

}
