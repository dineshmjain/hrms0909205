import { create, createMany, getOne, getMany, aggregate, removeOne,aggregationWithPegination,findWithPegination ,updateOne} from '../../helper/mongo.js'
import { ObjectId } from 'mongodb';
import { logger } from '../../helper/logger.js';

const collection_name = 'reportTimeSettings'

export const addClientReportTimeSettings = async (body) => {
    try {
        const { user} = body;

        // Build the query object
        const query = {
            orgId: new ObjectId(user.orgId),
            clientmappedId: new ObjectId(body.clientmappedId),
            clientId: new ObjectId(body.clientId),
            // reportTimeIn:body.reportTimeIn,
            // reportTimeOut:body.reportTimeOut,
            isReportTime:body.isReportTime,
            createdBy: new ObjectId(user._id),
            isActive: true,
            createdDate: new Date(),
        };
        // Insert into the database
        const result = await create(query, collection_name);
        if (result.status) {
            return { status: true, message: "Client report time settings added successfully", data: result.data };
        } else {
            return { status: false, message: "Failed to add client report time settings" };
        }
    } catch (error) {
        logger.error("Error while adding client report time settings in settings model", { stack: error.stack });
        throw error;
    }   
}


export const getClientReportTimeSettings = async (body) => {
    try {
        const { user, clientmappedId, clientId } = body;

        // Build the query object
        const query = {
            orgId: new ObjectId(user.orgId),
            ...(body.clientmappedId && {clientmappedId: new ObjectId(body.clientmappedId)}),
            ...(body.clientId && {clientId: new ObjectId(body.clientId)}),
            // ...(body.settingReportId && {_id: new ObjectId(body.settingReportId)}),
            isActive: true
        };

        // Fetch from the database
        const result = await getOne(query, collection_name);
        if (result.status && result.data) {
            return { status: true, message: "Client report time settings fetched successfully", data: result.data };
        } else {
            return { status: false, message: "No client report time settings found" };
        }
    } catch (error) {
        logger.error("Error while fetching client report time settings in settings model", { stack: error.stack });
        throw error;
    }   
}


export const updateClientReportTimeSettings = async (body) => {
    try {
        const { user } = body;

        // Build the query object
        const query = {
            orgId: new ObjectId(user.orgId),
            ...(body.clientmappedId && {clientmappedId: new ObjectId(body.clientmappedId)}),
            ...(body.clientId && {clientId: new ObjectId(body.clientId)}),
            ...(body.clientReportTimeSettings && {_id: new ObjectId(body.clientReportTimeSettings._id)}),
            isActive: true
        }; 

        let updateData = {
            // reportTimeIn: body.reportTimeIn,
            // reportTimeOut: body.reportTimeOut,
            isReportTime:body.isReportTime,
            modifiedBy: new ObjectId(user._id),
            modifiedDate: new Date()
        };

        let update = {
            $set: updateData
        };

        // Update in the database
        const result = await updateOne(query, update, collection_name);
        if (result.status) {
            return { status: true, message: "Client report time settings updated successfully"};
        } else {
            return { status: false, message: "Failed to update client report time settings" };
        }
    } catch (error) {
        logger.error("Error while updating client report time settings in settings model", { stack: error.stack });
        throw error;
    }   
}

