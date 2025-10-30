import { aggregate, create, updateOne } from '../../helper/mongo.js';
import { logger } from '../../helper/logger.js';
import { ObjectId } from 'mongodb';
import { getCurrentDateTime } from '../../helper/formatting.js';

const negotiation_collection = 'negotiations';

export const createNegotiation = async (data) => {
  try {
    if (!data?.quotationId) {
      throw new Error("quotationId is required for a negotiation");
    }

    const finalData = {
      quotationId: new ObjectId(data?.quotationId), // reference to quotation
      orgId: new ObjectId(data?.user?.orgId),
      leadId: new ObjectId(data?.leadId),
      round: data?.round || 1, // negotiation round number
      quotationDate: data?.quotationDate || getCurrentDateTime("date"),
      requirements: data?.requirements?.map(req => ({
        baseQuotePriceId:new ObjectId(req?.baseQuotePriceId),
        priceId:new ObjectId(req?.priceId),
        baseQuotePriceId: new ObjectId(req?.baseQuotePriceId),
        referenceId: req?.referenceId ? new ObjectId(req?.referenceId) : undefined,
        priceId: req?.priceId ? new ObjectId(req?.priceId) : undefined,
        designationId: new ObjectId(req?.designationId),
        noOfPositions: req?.noOfPositions,
        gender: req?.gender,
        price: req?.price,
        limits: req?.limits,
        shiftType: req?.shiftType,
        duration:req?.duration
      })),
      //   status: "Pending"
      comment: data?.comment || "",
      createdAt: getCurrentDateTime(),
      updatedAt: getCurrentDateTime(),
      createdBy: new ObjectId(data?.userId)
    };

    const result = await create(finalData, negotiation_collection);
    return result;

  } catch (error) {
    logger.error(`Error creating negotiation: ${error.message}`, { stack: error.stack });
    throw new Error('Error creating negotiation');
  }
};

export const getNegotationCount = async (data) => {
  try {
    const query =
      [
        {
          $match: {
            leadId: new ObjectId(data?.leadId),
            quotationId: new ObjectId(data?.quotationId)
          }
        },
        {
          $addFields: {
            status: {
              $cond: [
                { $eq: ["$round", 1] },
                "Quotation Shared",
                {
                  $cond: [
                    { $gt: ["$round", 1] },
                    "Negotiation",
                    "Other"
                  ]
                }
              ]
            }
          }
        },
        {
          $sort: {
            updatedAt: -1
          }
        },
        {
          $limit: 1
        }

      ]

    return aggregate(query, negotiation_collection)
  }
  catch (error) {
    logger.error(`Error negotiation getting : ${error.message}`, { stack: error.stack });
    throw new Error('Error negotiation getting');
  }
}

export const updateNegotation = async (data) => {
  try {
    if (!data?.quotationId) {
      throw new Error("quotationId is required for a negotiation");
    }

    const query = {
      quotationId: new ObjectId(data?.quotationId), // reference to quotation
      orgId: new ObjectId(data?.user?.orgId),
      leadId: new ObjectId(data?.leadId),
      isActive:true

    };
    const update = {

      isActive: false,
      updatedAt: getCurrentDateTime(),
      modifiedBy: new ObjectId(data?.userId)
    }

    const result = await updateOne(query, { $set: { ...update } }, negotiation_collection);
    return result;

  } catch (error) {
    logger.error(`Error creating negotiation: ${error.message}`, { stack: error.stack });
    throw new Error('Error creating negotiation');
  }
}
