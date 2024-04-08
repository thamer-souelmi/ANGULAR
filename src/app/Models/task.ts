import { Priority } from "./priority";
import { Project } from "./project";
import { TaskStatus } from "./task-status";

export class Task {
    taskid!:number;
    taskname!:string;
    startDateTask!:Date;
    dueDateTask!:Date;
    taskDescription!:string;
    priority!:Priority;
    taskStatus!:TaskStatus;
    projetT!:Project;


}
