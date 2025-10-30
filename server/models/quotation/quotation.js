import { aggregate, aggregationWithPegination, bulkWriteOperations, create, getMany, getOne, updateOne } from '../../helper/mongo.js'
import { logger } from '../../helper/logger.js';
import { ObjectId } from 'mongodb';
import { getCurrentDateTime } from '../../helper/formatting.js';
import { QueryBuilder } from "../../helper/filter.js";

const collection_name = 'quotations';
function generateQuotationId(orgId) {
  if (!orgId) throw new Error("orgId is required");

  const prefix = "QTN";

  // Use first 4 characters of orgId (or entire if shorter)
  const orgPart = orgId.substring(0, 4).toUpperCase();

  // Generate timestamp in hex (similar to MongoDB ObjectId)
  const timestamp = Math.floor(Date.now() / 1000).toString(16).toUpperCase();

  // Generate random 3-digit suffix
  const randomSuffix = Math.floor(100 + Math.random() * 900);

  // Combine all parts
  const quotationId = `${orgPart}-${prefix}-${timestamp}-${randomSuffix}`;

  return quotationId;
}



export const createQuotation = async (data) => {
    try {

        
        const finalData = {
            orgId: new ObjectId(data?.user?.orgId),
            leadId: new ObjectId(data?.leadId),
            quoationCode:generateQuotationId(data?.user?.orgId),
            // baseQuotePriceId: new ObjectId(data?.baseQuotePriceId),
            // referenceId: data?.referenceId ? new ObjectId(data?.referenceId) : undefined,
            // priceId: data?.priceId ? new ObjectId(data?.priceId) : undefined,
            subscriptionType: data?.subscriptionType,
            quotationDate: data?.quotationDate || getCurrentDateTime("date"), // default today (YYYY-MM-DD)
            createdAt: getCurrentDateTime(),
            updatedAt: getCurrentDateTime(),
            createBy: new ObjectId(data?.userId),
            status: "Pending",
            isActive: true

        };

        const result = await create(finalData, collection_name)
        return result;

    } catch (error) {
        logger.error(`Error creating quotation: ${error.message}`, { stack: error.stack });
        throw new Error('Error creating quotation');
    }
};

export const trackQuotation = async (data) => {
    try {
        const params = {}
        if (data?.quotationId) {
            params._id = new ObjectId(data?.quotationId)
        }


        const finalData = [
            {
                $match: {
                    leadId: new ObjectId(
                        data?.leadId
                    ),
                    ...params
                }
            },
            {
                $lookup: {
                    from: "negotiations",
                    localField: "_id",
                    foreignField: "quotationId",
                    as: "negotation"
                }
            },
        ]

        const result = await aggregate(finalData, collection_name)
        return result;

    } catch (error) {
        logger.error(`Error creating quotation: ${error.message}`, { stack: error.stack });
        throw new Error('Error creating quotation');
    }
};

export const closeQuotation = async (data) => {
    try {
        const params = {}
        if (data?.quotationId) {
            params._id = new ObjectId(data?.quotationId)
        }
        const finalData = [
            {
                $match: {
                    leadId: new ObjectId(
                        data?.leadId
                    ),
                    ...params
                }
            },

        ]

        const result = await update(finalData, { $set: { isActive: false, comment: body?.comment, status: "rejected", modifyDate: new Date(), modifiedBy: new ObjectId(body?.user?._id) } }, collection_name)
        return result;

    } catch (error) {
        logger.error(`Error creating quotation: ${error.message}`, { stack: error.stack });
        throw new Error('Error creating quotation');
    }
};


export const getDetailsForQuoatation = async (data) => {
    try {
        const params = {}
        if (data?.quotationId) {
            params._id = new ObjectId(data?.quotationId)
        }


        const query = [
            {
                $match: {
                    leadId: ObjectId("68df9a7a6bad9d9f274e219d"),
                    isActive: true
                }
            },
            {
                $lookup: {
                    from: "leads",
                    localField: "leadId",
                    foreignField: "_id",
                    as: "leadDetails"
                }
            },
            {
                $unwind: {
                    path: "$leadDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "organization",
                    localField: "leadDetails.orgId",
                    foreignField: "_id",
                    as: "organization"
                }
            },
            {
                $lookup: {
                    from: "organization",
                    localField: "leadDetails.subOrgId",
                    foreignField: "_id",
                    as: "subOrganization"
                }
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "leadDetails.branchId",
                    foreignField: "_id",
                    as: "branchDetails"
                }
            },
            {
                $lookup: {
                    from: "negotiations",
                    let: { quotationId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$quotationId", "$$quotationId"] },
                                        { $eq: ["$isActive", true] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "negotiations"
                }
            }
        ]


        const result = await aggregate(query, collection_name)
        return result;

    } catch (error) {
        logger.error(`Error creating quotation: ${error.message}`, { stack: error.stack });
        throw new Error('Error creating quotation');
    }
};
