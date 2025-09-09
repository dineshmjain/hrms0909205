import { aggregate, aggregationWithPegination, bulkWriteOperations, create, getMany, getOne, updateOne } from '../../helper/mongo.js'
import { logger } from '../../helper/logger.js';
import { ObjectId } from 'mongodb';
import { getCurrentDateTime } from '../../helper/formatting.js';
import { QueryBuilder } from "../../helper/filter.js";

const collection_name = 'leads'

export const add = async (body) => {
    try {
        let query = {
            name: body.name,
            orgType: body.orgType,
            ownerName: body.ownerName,
            mobile: body.mobile,
            ...(body.email && { email: body.email }),
            orgId: body.user.orgId,
            status: "pending",
            isKYC: false,
            createdBy: new ObjectId(body.userId),
            isActive: true,
            createdDate: getCurrentDateTime(),
        };
        return await create(query, collection_name);
    }
    catch (error) {
        logger.error("Error while creating lead in lead module");
        throw error;
    }
};

export const getList = async (body) => {
    try {
        let query = { orgId: body.user.orgId };
        return await getMany(query, collection_name);
    }
    catch (error) {
        logger.error("Error while listing leads in lead module");
        throw error;
    }
};

export const getDetails = async (body) => {
    try {
        let query = { orgId: body.user.orgId, _id: new ObjectId(body.leadId) };
        return await getOne(query, collection_name);
    }
    catch (error) {
        logger.error("Error while listing details of lead in org module");
        throw error;
    }
};

export const update = async (body) => {
    try {
        let query = { _id: new ObjectId(body.leadId) };

        let fields = ['name', 'orgType', 'ownerName', 'mobile', 'email', 'modifiedBy', 'modifiedDate']

        let updateObj = {}
        fields.forEach(f => {
            if (body[f]) {
                updateObj[f] = body[f]
            }
            else {
                f == 'modifiedBy' ? updateObj[f] = new ObjectId(body.userId) : f == 'modifiedDate' ? updateObj[f] = getCurrentDateTime() : undefined
            }
        })

        let update = {
            $set: updateObj
        }
        return await updateOne(query, update, collection_name);
    }
    catch (error) {
        logger.error("Error while updating lead in lead module");
        throw error;
    }
};

export const addLeadKyc = async (body) => {
    try {
        let query = {
            entity: body.entity,
            panNo: body.panNo,
            gstinNo: body.gstinNo,
            address: body.address,
            gpsl: body.gpsl || {},
            leadId: new ObjectId(body.leadId),
            createdDate: getCurrentDateTime(),
            createdBy: new ObjectId(body.userId)
        };
        return await create(query, "leadKYC");
    }
    catch (error) {
        logger.error("Error while creating lead KYC in lead module");
        throw error;
    }
};

export const updateLeadKycStatus = async (body) => {
    try {
        let query = { _id: new ObjectId(body.leadId) };

        let update = {
            $set: { isKYC: true }
        }

        return await updateOne(query, update, collection_name);
    }
    catch (error) {
        logger.error("Error while updating lead kyc status in lead module");
        throw error;
    }
};

export const updateStatus = async (body) => {
    try {
        let query = { _id: new ObjectId(body.leadId) };

        let update = {
            $set: { status: "Follow Up" }
        }

        return await updateOne(query, update, collection_name);
    }
    catch (error) {
        logger.error("Error while updating lead kyc status in lead module");
        throw error;
    }
};

export const isKycDataValid = async (body) => {
    try {
        let query = { _id: new ObjectId(body.leadKycId) };

        return await getOne(query, "leadKYC");
    }
    catch (error) {
        logger.error("Error while updating lead kyc status in lead module");
        throw error;
    }
};

export const updateKycDetails = async (body) => {
    try {
        let query = { _id: new ObjectId(body.leadKycId) };

        let fields = ['entity','panNo','gstinNo','address', 'modifiedDate', 'modifiedBy']
        let updateObj = {}
    
        fields.forEach(f => {
            if(body[f]) {
                if(f == 'address') {
                    // updateObj[f] = {}
                    let addressFields = ["houseNo","street","city","taluk","district","landmark","pincode"]

                    addressFields.forEach(af => {
                        if(body[f][af]) {
                            let mergeObjKey = `${f}.${af}`
                            updateObj[mergeObjKey] = body[f][af]
                        }
                    })
                }
                else {
                    updateObj[f] = body[f]
                }
            }
            else {
                f == 'modifiedBy' ? updateObj[f] = new ObjectId(body.userId) : f == 'modifiedDate' ? updateObj[f] = getCurrentDateTime() : undefined
            }
        })

        let update = {
            $set : updateObj
        }
        
        return await updateOne(query, update, "leadKYC");
    }
    catch (error) {
        logger.error("Error while updating lead kyc status in lead module");
        throw error;
    }
};