import { ObjectId } from 'mongodb';
import { aggregate, bulkWriteOperations, create, getMany, getOne, updateOne } from '../../helper/mongo.js';
import { convertToYYYYMMDD, getCurrentDateTime } from '../../helper/formatting.js';

const collection_name = "subscriptionHistory"

export const addFeatureUsage = async (body) => {
    try {
        let query = {
            UserID: body.user._id,
            PlanId: new ObjectId(body.featureDetails?.PlanId || body.PlanId),
            ModuleName: body.featureKey,
            CreatedDate: getCurrentDateTime()
        }
        return await create(query, collection_name)
    }
    catch (error) {
        return { status: false, message: "Failed to add Feature Usage type" }
    }
}