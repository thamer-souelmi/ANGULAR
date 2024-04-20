export class ActionLog {
    id!: number;
    action!:String ; // Action performed (e.g., "CREATE", "UPDATE", "DELETE")
    entityName!:String; // Name of the entity affected
    entityId!:number; // ID of the entity affected
    userid!:number; // Username of the user performing the action (if applicable)
    ipAddress!:String; // IP address of the user
    httpMethod!:String; // HTTP method used for the action
    requestUri!:String; // Request URI
    timestamp!:Date; // Timestamp of when the action occurred
}
