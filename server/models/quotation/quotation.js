import { aggregate, aggregationWithPegination, bulkWriteOperations, create, getMany, getOne, updateOne } from '../../helper/mongo.js'
import { logger } from '../../helper/logger.js';
import { ObjectId } from 'mongodb';
import { getCurrentDateTime } from '../../helper/formatting.js';
import { QueryBuilder } from "../../helper/filter.js";

const collection_name = 'quotations';

export const createQuotation = async (data) => {
    try {
        const finalData = {
            orgId: new ObjectId(data?.user?.orgId),
            leadId: new ObjectId(data?.leadId),
            // baseQuotePriceId: new ObjectId(data?.baseQuotePriceId),
            referenceId: data?.referenceId ? new ObjectId(data?.referenceId) : undefined,
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

