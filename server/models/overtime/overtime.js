import { logger } from "../../helper/logger.js";
import { ObjectId } from "mongodb";
import { create, getOne, findWithPegination, findOneAndUpdate, getMany, updateOne, createMany } from "../../helper/mongo.js";
// import { QueryBuilder } from "../../helper/filter.js";
import MongoDBService from "../../helper/mongoDbService.js";
import { QueryBuilder } from "../../helper/filter.js";
import { getCurrentDateTime } from "../../helper/formatting.js";
import * as constants from "../../helper/constants.js";

const collection_name = "overtime";

export const addOvertime = async (body) => {
    try {
        let query = {
            name: body.name,
            orgId: new ObjectId(body.user.orgId),
            category: body.category,
            amount: body.amount,
            type: body.type,
            minHours: body.minHours,
            maxHours: body.maxHours,
            createdDate: getCurrentDateTime(),
            createdBy: new ObjectId(body.userId),
            isActive: true,
        }

        if(body.branchId){
            query["branchId"]=new ObjectId(body.branchId)
        }

        return await create(query, collection_name);
    }
    catch (error) {
        logger.error(`overtimeModel - addOvertime - error: ${error}`);
        return { status: false, error: "Failed to add Overtime" };
    }
}

export const getList = async (body) => {
    try {
        let query = {
            orgId: new ObjectId(body.user.orgId),
            isActive:true
        }
        if(body.branchId){
            query['branchId']=new ObjectId(body.branchId)
        }

        return await getMany(query, collection_name);
    }
    catch (error) {
        logger.error(`overtimeModel - getList - Overtime - error: ${error}`);
        return { status: false, error: "Failed to get Overtime list" };
    }
}

export const get = async (body) => {
    try {
        let query = {
            _id: new ObjectId(body.overtimeId),
            orgId: new ObjectId(body.user.orgId),
        }

        return await getOne(query, collection_name);
    }
    catch (error) {
        logger.error(`overtimeModel - get - Overtime - error: ${error}`);
        return { status: false, error: "Failed to get Overtime" };
    }
}

export const update = async (body) => {
    try {

        let query = {
            _id: new ObjectId(body.overtimeId),
        }

        let fields = ['name', "category", "amount", "type", "minHours", "maxHours", "isActive", "modifiedDate", "modifiedBy"]

        let updateObj = {}

        fields.forEach(f => {
            if (body[f]) {
                updateObj[f] = body[f]
            }
            else {
                if (f == 'modifiedDate') {
                    updateObj[f] = getCurrentDateTime()
                }
                else if (f == 'modifiedBy') {
                    updateObj[f] = new ObjectId(body.userId)
                }
            }
        })

        let update = { $set: updateObj }

        return await updateOne(query, update, collection_name);
    }
    catch (error) {
        logger.error(`overtimeModel - update - Overtime - error: ${error}`);
        return { status: false, error: "Failed to update Overtime" };
    }
}