import { logger } from "../../helper/logger.js";
import {ObjectId} from "mongodb";
import MongoDBService from "../../helper/mongoDbService.js";

export class UserLogs extends MongoDBService{
    constructor(){
        super("userLogs");
    }

    async writeData(body) {
        try{
            const {token, user,userId, employeeId,orgDetails, ...userdetails} = body
            const logsObj = {
                orgId: new ObjectId(orgDetails._id),
                userId: new ObjectId(employeeId),
                createdAt: new Date(),
                createdBy: new ObjectId(userId),
                ...userdetails
            }
            logger.debug("Creating user log")
            return await this.create(logsObj);
        }catch(error){
            logger.error("Error while creating logs for user changes in user model in userlogs");
            throw error;
        }
    };

    async getData(query){
        try{
            return await this.aggrigationPipeline(query);
        }catch(error){
            logger.error("Error while getting logs for user changes in user model in userlogs");
            throw error;
        }
    }
}