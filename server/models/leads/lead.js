import { aggregate, aggregationWithPegination, bulkWriteOperations, create, getMany, getOne, updateOne } from '../../helper/mongo.js'
import { logger } from '../../helper/logger.js';
import { ObjectId } from 'mongodb';
import { getCurrentDateTime } from '../../helper/formatting.js';
import { QueryBuilder } from "../../helper/filter.js";

const collection_name = 'leads'
export const isLeadExist = async (body) => {
    try {
        let query = [{
            $match: {
                orgId: new ObjectId(body?.user?.orgId),
                $or: [
                    { email: body?.email },
                    { mobile: body?.mobile }
                ]
            }
        }];
        return await aggregate(query, collection_name);

    } catch (error) {
        logger.error("Error while checking lead existance in lead module");
        throw error;
    }
};

export const add = async (body) => {
    try {
        const params = {}
        if (body.address) {
            params.address = body.address;
        }
        if (body.geoJson) {
            params.geoJson = body.geoJson;
        }
        if (body.geoLocation) {
            params.geoLocation = body.geoLocation;
        }
        if (body?.assignedToId) {
            params.assignedToId = new ObjectId(body?.assignedToId)
        }
        else {
            params.assignedToId = new ObjectId(body.userId)
        }

        let query = {
            companyName: body?.companyName,
            companyAddress: body?.companayAddress,
            person: body?.contactPerson,
            mobile: body?.mobile,
            designation: body?.contactPersonDesignation,
            email: body?.contactPersonEmail,
            // name: body.name,
            // orgType: body.orgType,
            // ownerName: body.ownerName,
            // mobile: body.mobile,
            // ...(body.email && { email: body.email }),
            ...params,
            orgId: new ObjectId(body.user.orgId),

            status: "pending",
            // isKYC: false,
            createdBy: new ObjectId(body.userId),
            isActive: true,
            createdDate: getCurrentDateTime(),
        };

        if (body?.userAssigmentDetails?.subOrgId || body?.subOrgId) {
            query.subOrgId = new ObjectId(body?.userAssigmentDetails?.subOrgId || body?.subOrgId)
        }
        if (body?.userAssigmentDetails?.branchId || body?.branchId) {
            query.branchId = new ObjectId(body?.userAssigmentDetails?.branchId ||  body?.branchId)
        }
        return await create(query, collection_name);
    }
    catch (error) {
        logger.error("Error while creating lead in lead module");
        throw error;
    }
};

export const getList = async (body) => {
    try {
        let params = {}
        if (body?.subOrgId) {
            params.subOrgId = new ObjectId(body?.subOrgId)

        }
        if (body?.branchId) {
            params.branchId = new ObjectId(body?.branchId)

        }

        let query = [
            {
                $match: {
                    orgId: new ObjectId(body?.user?.orgId),
                    ...params
                }
            },
            {
                $lookup: {
                    from: "user", // make sure collection name is correct
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $addFields: {
                    createdByName: "$user.name",
                    modifiedDate: {
                        $cond: {
                            if: { $ne: [{ $ifNull: ["$modifiedDate", null] }, null] },
                            then: "$modifiedDate",
                            else: "$createdDate"
                        }
                    }
                    // you can uncomment assigned if needed
                    // assigned: { $cond: { if: { $in: ["$_id", assignmentIds] }, then: true, else: false } }
                }
            },
            {
                $project: {
                    user: 0
                }
            }
        ];
        let paginationQuery = {
            page: body.page,
            limit: body.limit,
            sortOrder: -1,
            sortBy: "_id"
        }
        return await aggregationWithPegination(query, paginationQuery, collection_name);
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

        let fields = ['entity', 'panNo', 'gstinNo', 'address', 'modifiedDate', 'modifiedBy']
        let updateObj = {}

        fields.forEach(f => {
            if (body[f]) {
                if (f == 'address') {
                    // updateObj[f] = {}
                    let addressFields = ["houseNo", "street", "city", "taluk", "district", "landmark", "pincode"]

                    addressFields.forEach(af => {
                        if (body[f][af]) {
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
            $set: updateObj
        }

        return await updateOne(query, update, "leadKYC");
    }
    catch (error) {
        logger.error("Error while updating lead kyc status in lead module");
        throw error;
    }
};

//get by Feild Officer Id
export const getLeadsCreatedBy = async (body) => {
    try {
        let query = [
            {
                $match: {
                    orgId: new ObjectId(body?.user?.orgId),
                    assignedToId: new ObjectId(body?.user?._id)
                    // isActive: true // only active leads
                }
            },
            {
                $lookup: {
                    from: "quotations",
                    let: { leadId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$leadId", "$$leadId"]
                                },
                                isActive: true // only active quotations
                            }
                        },
                        { $sort: { createdAt: -1 } }, // latest first
                        { $limit: 1 },
                        {
                            $project: {
                                quotationId: 1,
                                createdAt: 1
                            }
                        } // only needed fields
                    ],
                    as: "latestQuotation"
                }
            },
            {
                $unwind: {
                    path: "$latestQuotation",
                    preserveNullAndEmptyArrays: true // in case no active quotation exists
                }
            }
        ]
        return await getMany(query, collection_name);
    }
    catch (error) {
        logger.error("Error while listing leads in lead module");
        throw error;
    }
};

export const updateLeadStatus = async (body) => {
    try {
        if (!body?.user?.orgId || !body?.leadId || !body?.quotationStatus) {
            throw new Error("Missing required fields: orgId, leadId, or quotationStatus");
        }

        const query = {
            orgId: new ObjectId(body.user.orgId),
            _id: new ObjectId(body.leadId)
        };

        const update = {
            $set: { status: body.quotationStatus }
        };
        console.log(query, 'ds')
        return await updateOne(query, update, collection_name);
    } catch (error) {
        logger.error("Error while updating lead status in lead module", error);
        throw error;
    }
};
