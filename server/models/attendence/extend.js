import { create, getOne, removeOne, findOneAndUpdate, aggregationWithPegination, updateOne, findWithPegination, getMany, bulkWriteOperations, aggregate, updateMany } from '../../helper/mongo.js';
import { ObjectId } from 'mongodb';
import { logger } from '../../helper/logger.js';
import moment from 'moment-timezone';
import { QueryBuilder } from "../../helper/filter.js";
import { attendanceApprovalStatus } from '../../helper/constants.js';
import { getUTCDateRange, getCurrentDateTime } from '../../helper/formatting.js';
import { query } from 'express';

const collection_name = 'attendanceExtensions';

const statusObj = {approve : true, reject : false, pending : null}

export const add = async (body) => {
    try {
        let query = {
            orgId: new ObjectId(body.user.orgId),
            branchId: new ObjectId(body.branchId),
            shiftId: new ObjectId(body.shiftId),
            date: new Date(body.date),
            userId: new ObjectId(body.userId),
            isApproved: null, //pending
            createdDate: getCurrentDateTime(),
            createdBy: new ObjectId(body.user._id),
        };

        if (body.clientMappedId) query["clientMappedId"] = new ObjectId(body.clientMappedId);

        return await create(query, collection_name);
    }
    catch (error) {
        logger.error(`attendance : extend : add : ${error}`);
        throw error;
    }
}

export const getByDate = async (body) => {
    try {
        let { startDate, endDate } = getUTCDateRange(body.date || body.transactionDate || new Date(), 0);

        let query = {
            orgId: new ObjectId(body.user.orgId),
            userId: new ObjectId(body.userId),
            $and: [
                {
                    date: {
                        $lt: new Date(endDate)
                    }
                },
                {
                    date: {
                        $gte: new Date(startDate)
                    }
                }
            ],
        }
        if(body.branchId) query['branchId'] = new ObjectId(body.branchId);
        // console.log(JSON.stringify(query));
        return await getOne(query, collection_name);
    }
    catch (error) {
        logger.error(`attendance : extend : getByDate : ${error}`);
        throw error;
    }
}

export const list = async (body) => {
    try {

        let queryFilter = {
            orgId: new ObjectId(body.user.orgId),
            isApproved: statusObj[body.status.toLowerCase()]
        };

        // if (body.userBranchIds && body.userBranchIds.length) queryFilter['branchId'] = { $in: body.userBranchIds };

        let diffDays = 0
        if (body.startDate && body.endDate) {
            diffDays = new Date(body.endDate).getDate() - new Date(body.startDate).getDate() + 1
            let { startDate, endDate } = getUTCDateRange(body.date || body.startDate, diffDays);
            queryFilter['$and'] = [
                {
                    date: {
                        $lt: new Date(endDate)
                    }
                },
                {
                    date: {
                        $gte: new Date(startDate)
                    }
                }
            ]
        }

        let aggrigationPipeline = [
            {
                $match: queryFilter
            }
        ];
        return await aggregationWithPegination(aggrigationPipeline, { limit: body.limit, page: body.page }, collection_name);
    }
    catch (error) {
        logger.error(`attendance : extend : list : ${error}`);
        throw error;
    }
}

export const getById = async (body) => {
    try {

        let query = {
            _id: new ObjectId(body.extensionId)
        }
        return await getOne(query, collection_name);
    }
    catch (error) {
        logger.error(`attendance : extend : getById : ${error}`);
        throw error;
    }
}

export const updateStatus = async (body) => {
    try {
        let query = {
            _id: new ObjectId(body.extensionId)
        }

        let update = {
            $set: {
                isApproved: statusObj[body.status],
                modifiedDate: getCurrentDateTime(),
                modifiedBy: new ObjectId(body.userId),
                remarks: body.remarks || ''
            }
        }
        return await updateOne(query, update, collection_name);
    }
    catch (error) {
        logger.error(`attendance : extend : update status : ${error}`);
        throw error;
    }
}

export const updateShiftAndBranch = async (body) => {
    try {

        let query = {_id : new ObjectId(body.extensionId)}

        let update = {
            $set: {
                branchId: new ObjectId(body.branchId),
                shiftId: new ObjectId(body.shiftId),
                modifiedDate: getCurrentDateTime(),
                modifiedBy: new ObjectId(body.userId),
                remarks: body.remarks || ''
            }
        }
        return await updateOne(query, update, collection_name);
    }
    catch (error) {
        logger.error(`attendance : extend : update status : ${error}`);
        throw error;
    }
}

export const updateDateBased = async (body) => {
    try {

        let { startDate, endDate } = getUTCDateRange(body.transactionDate || new Date(), 0);
        let query = {
            orgId: new ObjectId(body.user.orgId),
            userId: new ObjectId(body.userId),
            $and: [
                {
                    date: {
                        $lt: new Date(endDate)
                    }
                },
                {
                    date: {
                        $gte: new Date(startDate)
                    }
                }
            ],
        }

        let update = {
            $set: {
                branchId: new ObjectId(body.branchId),
                shiftId: new ObjectId(body.shiftId),
                modifiedDate: getCurrentDateTime(),
                modifiedBy: new ObjectId(body.userId),
                remarks: body.remarks || ''
            }
        }
        return await updateOne(query, update, collection_name);
    }
    catch (error) {
        logger.error(`attendance : extend : update status : ${error}`);
        throw error;
    }
}