import { aggregate, aggregationWithPegination, bulkWriteOperations, create, getMany, getOne, updateOne, updateOneWithupsert } from '../../helper/mongo.js'
import { logger } from '../../helper/logger.js';
import { ObjectId } from 'mongodb';
import { getCurrentDateTime, getUTCDateRange } from '../../helper/formatting.js';
import { QueryBuilder } from "../../helper/filter.js";

const collection_name = 'leadMeetings'

export const createMeeting = async (body) => {
    try {
        let { startDate, endDate } = getUTCDateRange(body.scheduledDate, 0)

        let query = { _id: new ObjectId(body.meetingId) };

        let updateObj = {}
        let updateLogs = {}
        if (body.meetingDetails) {
            let fields = ['summary', 'meetingStatus', 'startTime', 'endTime', 'scheduledDate', "modifiedDate", "modifiedBy"]
            fields.forEach(f => {
                if (body[f]) {
                    updateLogs[f] = body.meetingDetails[f]
                    if (f == 'scheduledDate') updateObj[f] = new Date(startDate)
                    else updateObj[f] = body[f]
                }
                else {
                    // f == 'modifiedBy' ? updateLogs[f] = new ObjectId(body.userId) : 'modifiedDate' ? updateLogs[f] = getCurrentDateTime() : undefined
                    f == 'modifiedBy' ? updateObj[f] = new ObjectId(body.userId) : 'modifiedDate' ? updateObj[f] = getCurrentDateTime() : undefined
                }
            })
            updateLogs = { ...updateLogs, modifiedDate: getCurrentDateTime(), modifiedBy: new ObjectId(body.userId) }
        }
        else {
            updateObj = {
                orgId: body.user.orgId,
                summary: body.summary,
                leadId: new ObjectId(body.leadId),
                meetingStatus: body.meetingStatus,
                startTime: body.startTime,
                endTime: body.endTime,
                scheduledDate: new Date(startDate),
                createdDate: getCurrentDateTime(),
                createdBy: new ObjectId(body.userId),
                logs: []
            }
            if (body.meetingStatus == 'Interested') updateObj['action'] = 'Follow Up'
        }

        let update = {
            $set: updateObj
        }

        if (Object.keys(updateLogs).length > 0) update['$push'] = { logs: updateLogs }

        return await updateOneWithupsert(query, update, collection_name, { upsert: true });
    }
    catch (error) {
        logger.error("Error while creating lead meetings in lead meeting module");
        throw error;
    }
};
export const get = async (body) => {
    try {
        let query = { orgId: body.user.orgId, _id: new ObjectId(body.meetingId) }
        return await getOne(query, collection_name, { logs: 0 });
    }
    catch (error) {
        logger.error("Error while getting lead meeting  details in lead meeting module");
        throw error;
    }
};

export const getList = async (body) => {
    try {
        let query = { orgId: body.user.orgId };
        return await getMany(query, collection_name, { logs: 0 });
    }
    catch (error) {
        logger.error("Error while creating lead meetings list in lead meeting module");
        throw error;
    }
};