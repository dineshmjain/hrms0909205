import {
  create,
  getOne,
  removeOne,
  findOneAndUpdate,
  aggregationWithPegination,
  updateOne,
  findWithPegination,
  getMany,
  bulkWriteOperations,
  aggregate,
} from "../../helper/mongo.js";
import { ObjectId } from "mongodb";
import { logger } from "../../helper/logger.js";
import moment from "moment";

const COLLECTION_NAME = "baseQuotationPrice";
const REFERENCE_COLLECTION_NAME = "referenceBaseQuotePrice";

// Helper functions
const validateUserAndOrg = (data) => {
  logger.debug('Validating user and org', {
    hasUser: !!data?.user,
    hasUserId: !!data?.user?._id,
    hasOrgId: !!data?.user?.orgId
  });

  const userId = data?.user?._id;
  const orgId = data?.user?.orgId;

  if (!userId || !orgId) {
    logger.error('User validation failed', { userId: !!userId, orgId: !!orgId });
    throw new Error("Either userId or orgId not found");
  }

  return {
    userId: typeof userId === "string" ? new ObjectId(userId) : userId,
    orgId: typeof orgId === "string" ? new ObjectId(orgId) : orgId,
  };
};

const validateObjectId = (id, fieldName) => {
  logger.debug(`Validating ObjectId for ${fieldName}`, { id, fieldName });

  if (!id) {
    throw new Error(`${fieldName} is required`);
  }

  if (!ObjectId.isValid(id)) {
    logger.error(`Invalid ObjectId for ${fieldName}`, { id, fieldName });
    throw new Error(`Invalid ${fieldName}: ${id}`);
  }

  return new ObjectId(id);
};

const buildOptionalParams = (data) => {
  const params = {};

  try {
    if (data?.designationId) params.designationId = validateObjectId(data.designationId, 'designationId');
    if (data?.subOrgId) params.subOrgId = validateObjectId(data.subOrgId, 'subOrgId');
    if (data?.departmentId) params.departmentId = validateObjectId(data.departmentId, 'departmentId');
    if (data?.branchId) params.branchId = validateObjectId(data.branchId, 'branchId');

    logger.debug('Built optional params', {
      paramCount: Object.keys(params).length,
      params: Object.keys(params)
    });
  } catch (error) {
    logger.error('Error building optional params', { error: error.message, data });
    throw error;
  }

  return params;
};

const mapLimitsToArray = (limits) => {
  if (!limits) {
    logger.debug('No limits provided, returning empty array');
    return [];
  }

  try {
    const result = ["male", "female"].map((gender) => ({
      gender,
      cityLimit: limits[gender]?.cityLimit || 0,
      outCityLimit: limits[gender]?.outCityLimit || 0,
      dayShift: limits[gender]?.dayShift || 0,
      nightShift: limits[gender]?.nightShift || 0,
      outCityDayShift:limits[gender]?.outCityDayShift || 0,
      outCityNightShift:limits[gender]?.outCityNightShift ||0,

    }));

    logger.debug('Mapped limits to array', {
      inputGenders: Object.keys(limits),
      outputCount: result.length
    });

    return result;
  } catch (error) {
    logger.error('Error mapping limits to array', { error: error.message, limits });
    throw new Error(`Invalid limits structure: ${error.message}`);
  }
};

const createBodyData = (data, userId) => {
  try {
    logger.debug('Creating body data', {
      hasDaily: !!data?.daily,
      hasMonthly: !!data?.monthly,
      hasYearly: !!data?.yearly,
      hasAdjustment: !!data?.adjustment,
      hasEffectiveFrom: !!data?.effectiveFrom
    });

    const bodyData = {
      daily: mapLimitsToArray(data?.daily),
      monthly: mapLimitsToArray(data?.monthly),
      yearly: mapLimitsToArray(data?.yearly),
      effectiveFrom: data?.effectiveFrom || new Date(),
      adjustment: data?.adjustment || {},
      createdBy: userId,
      createdAt: new Date(),
    };

    logger.debug('Body data created successfully', {
      dailyCount: bodyData.daily?.length,
      monthlyCount: bodyData.monthly?.length,
      yearlyCount: bodyData.yearly?.length,
      effectiveFrom: bodyData.effectiveFrom
    });

    return bodyData;
  } catch (error) {
    logger.error('Error creating body data', { error: error.message, data });
    throw error;
  }
};

// Helper function to sync history across collections
const syncHistoryToReferences = async (baseQuotePriceId, historyId, bodyData, userId, orgId) => {
  try {
    // Find all referenceQuotePrice documents that reference this baseQuotePriceId
    const referenceDocsQuery = [
      {
        $match: {
          baseQuotePriceId: baseQuotePriceId,
          orgId: orgId,
          isActive: true
        }
      },
      {
        $project: {
          _id: 1,
          designationId: 1,
          subOrgId: 1,
          branchId: 1,
          departmentId: 1
        }
      }
    ];

    const referenceDocs = await aggregate(referenceDocsQuery, REFERENCE_COLLECTION_NAME);

    if (!referenceDocs?.status || !referenceDocs?.data?.length) {
      return { status: true, updatedCount: 0, message: "No reference documents found" };
    }

    // Prepare bulk operations for updating all reference documents
    const bulkOps = referenceDocs.data.map(doc => ({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            [`history.${historyId}`]: bodyData,
            modifiedBy: userId,
            modifiedAt: new Date()
          }
        }
      }
    }));

    // Execute bulk update
    const bulkResult = await bulkWriteOperations(bulkOps, REFERENCE_COLLECTION_NAME);

    if (bulkResult?.status) {
      logger.info('Successfully synced history to reference quote prices', {
        baseQuotePriceId: baseQuotePriceId.toString(),
        historyId: historyId.toString(),
        updatedCount: referenceDocs.data.length,
        referenceDocs: referenceDocs.data.map(doc => ({
          id: doc._id.toString(),
          designationId: doc.designationId?.toString(),
          subOrgId: doc.subOrgId?.toString(),
          branchId: doc.branchId?.toString(),
          departmentId: doc.departmentId?.toString()
        }))
      });

      return {
        status: true,
        updatedCount: referenceDocs.data.length,
        data: bulkResult.data
      };
    } else {
      logger.error('Failed to sync reference quote price histories', {
        baseQuotePriceId: baseQuotePriceId.toString(),
        historyId: historyId.toString(),
        error: bulkResult?.error
      });

      return {
        status: false,
        error: bulkResult?.error || "Failed to update reference documents"
      };
    }

  } catch (error) {
    logger.error('Error syncing history to reference collections', {
      baseQuotePriceId: baseQuotePriceId.toString(),
      historyId: historyId.toString(),
      error: error.message,
      stack: error.stack
    });

    return { status: false, error: error.message };
  }
};

// Main functions
export const QuotePriceExists = async (data) => {
  try {
    const { userId, orgId } = validateUserAndOrg(data);
    const optionalParams = buildOptionalParams(data);

    // Fixed the typo in the condition
    if (!data?.designationId) {
      throw new Error("designationId is required");
    }

    const params = {
      ...optionalParams,
      orgId,
    };

    const query = [{ $match: params }];

    return await aggregate(query, COLLECTION_NAME);
  } catch (error) {
    logger.error(`Error in QuotePriceExists: ${error.message}`);
    return { status: false, error: error.message };
  }
};

export const isQuotePriceByDesignationId = async (data) => {
  try {
    const { userId, orgId } = validateUserAndOrg(data);

    if (!data?.designationId) {
      throw new Error("designationId is required");
    }

    const targetDate = data?.date ? new Date(data.date) : new Date();

    const query = [
      {
        $match: {
          designationId: validateObjectId(data.designationId, 'designationId'),
          orgId,
        }
      },
      {
        $addFields: {
          historyArray: { $objectToArray: "$history" }
        }
      },
      { $unwind: "$historyArray" },
      {
        $addFields: {
          effectiveFrom: {
            $dateFromString: {
              dateString: "$historyArray.v.effectiveFrom",
              onError: null
            }
          }
        }
      },
      {
        $match: {
          effectiveFrom: {
            $lte: targetDate,
            $ne: null
          }
        }
      },
      {
        $sort: { effectiveFrom: -1 }
      },
      {
        $limit: 1
      },
      {
        $project: {
          baseQuotePriceId: "$_id",
          priceId: "$historyArray.k",
          data: "$historyArray.v",
          effectiveFrom: 1
        }
      }
    ];

    return await aggregate(query, COLLECTION_NAME);
  } catch (error) {
    logger.error(`Error in isQuotePriceByDesignationId: ${error.message}`);
    return { status: false, error: error.message };
  }
};

export const standardQuotePriceCreate = async (data) => {
  try {
    const { userId, orgId } = validateUserAndOrg(data);

    if (!data?.designationId) {
      throw new Error("designationId is required");
    }

    const designationId = validateObjectId(data.designationId, 'designationId');
    const bodyData = createBodyData(data, userId);

    const params = {
      orgId,
      designationId,
      // ...bodyData,
      // history: { [new ObjectId()]: bodyData },
      isActive: true,
      createdBy: userId,
      createdAt: new Date(),
    };

    const result = await create(params, COLLECTION_NAME, {
      action: "standardQuotePriceCreate",
      userId,
    });

    if (result.status) {
      logger.info("Quotation price document created successfully", { docId: result.data._id });
      return { status: true, data: result.data };
    }

    return { status: false, error: result.error };
  } catch (error) {
    logger.error(`Error in standardQuotePriceCreate: ${error.message}`);
    return { status: false, error: error.message };
  }
};
export const standardQuotePriceCreateHistory = async (data) => {
  try {
        const { userId, orgId } = validateUserAndOrg(data);
    const bodyData = createBodyData(data, userId);
    const params = {
      basePriceId:new ObjectId(data?.baseQuotePriceId),
      effectiveFrom:new Date(data?.effectiveFrom),
      ...bodyData,
      isActive: true,
      createdBy: userId,
      createdAt: new Date(),
    }

    const result = await create(params, 'baseQuotationPriceHistory', {
      action: "standardQuotePriceHistoryCreate",
      userId,
    });
    if (result.status) {
      logger.info("Quotation price History document created successfully", { docId: result.data._id });
      return { status: true, data: result.data };
    }

    return { status: false, error: result.error };
  }
  catch (error) {
    logger.error(`Error in standardQuotePriceCreate: ${error.message}`);
    return { status: false, error: error.message };
  }

}
export const updateBaseQuotationPriceId = async (data) => {

  try {
    const updateQuery = { _id: new ObjectId(data?.baseQuotePriceId) };
    const updateData = {
      $set: {
        latestPriceId: new ObjectId(data?.latestPriceId),
        modifiedBy: new ObjectId(data?.userId),
        modifiedAt: new Date()
      }
    };

    return updateOne(updateQuery, updateData, 'baseQuotationPrice')
  }
  catch (error) {
    logger.error(`Error in standardQuotePriceCreate  Price Id: ${error.message}`);
    return { status: false, error: error.message };
  }

}

// export const standardQuotePricesList = async (body) => {
//   try {
//     const { orgId } = validateUserAndOrg(body);

//     // if (!body?.designationId) {
//     //   throw new Error("designationId is required");
//     // }

//     const designationId = new ObjectId(body?.designationId)
//     const effectiveDate = body?.date || new Date().toISOString();

//     const baseParams = {
//       orgId,
//       history: { $exists: true, $type: "object" }
//     };

//     // Build conditional filters
//     const conditionalFilters = [];
//     if (body?.subOrgId) conditionalFilters.push({ $eq: ["$subOrgId", validateObjectId(body.subOrgId, 'subOrgId')] });
//     if (body?.branchId) conditionalFilters.push({ $eq: ["$branchId", validateObjectId(body.branchId, 'branchId')] });
//     if (body?.departmentId) conditionalFilters.push({ $eq: ["$departmentId", validateObjectId(body.departmentId, 'departmentId')] });

//     const query = [
//       { $match: baseParams },
//       {
//         $match: {
//           $expr: {
//             $or: [
//               { $ne: ["$designationId", designationId] },
//               {
//                 $and: [
//                   { $eq: ["$designationId", designationId] },
//                   ...conditionalFilters
//                 ]
//               }
//             ]
//           }
//         }
//       },
//       {
//         $addFields: {
//           validHistoryEntries: {
//             $filter: {
//               input: { $objectToArray: "$history" },
//               as: "entry",
//               cond: {
//                 $and: [
//                   { $ne: ["$$entry.v.effectiveFrom", null] },
//                   { $ne: ["$$entry.v.effectiveFrom", ""] },
//                   {
//                     $lte: [
//                       { $dateFromString: { dateString: "$$entry.v.effectiveFrom", onError: null } },
//                       { $dateFromString: { dateString: effectiveDate, onError: new Date() } }
//                     ]
//                   }
//                 ]
//               }
//             }
//           }
//         }
//       },
//       {
//         $addFields: {
//           latest: {
//             $cond: [
//               { $gt: [{ $size: "$validHistoryEntries" }, 0] },
//               {
//                 $let: {
//                   vars: {
//                     sortedEntries: {
//                       $sortArray: {
//                         input: "$validHistoryEntries",
//                         sortBy: { "v.effectiveFrom": -1 }
//                       }
//                     }
//                   },
//                   in: {
//                     priceId: { $arrayElemAt: ["$$sortedEntries.k", 0] },
//                     data: { $arrayElemAt: ["$$sortedEntries.v", 0] }
//                   }
//                 }
//               },
//               null
//             ]
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: "designation",
//           localField: "designationId",
//           foreignField: "_id",
//           as: "designation",
//           pipeline: [{ $project: { name: 1 } }] // Only fetch name field
//         }
//       },
//       {
//         $project: {
//           baseQuotePriceId: "$_id",
//           designationName: { $arrayElemAt: ["$designation.name", 0] },
//           latest: 1,
//           history:1,
//           designationId: 1,
//           orgId: 1,
//           isActive: 1,
//           createdBy: 1,
//           createdAt: 1,
//           _id: 0
//         }
//       },
//       {
//         $group: {
//           _id: "$designationId",
//           doc: { $first: "$$ROOT" }
//         }
//       },
//       { $replaceRoot: { newRoot: "$doc" } }
//     ];

//     return await aggregationWithPegination(query, {}, COLLECTION_NAME);
//   } catch (error) {
//     logger.error(`Error in standardQuotePricesList: ${error.message}`);
//     throw error;
//   }
// };

// export const standardQuotePricesList = async (body) => {
//   try {
//     const { orgId } = validateUserAndOrg(body);

//     // if (!body?.designationId) {
//     //   throw new Error("designationId is required");
//     // }

//     // const designationId = validateObjectId(body.designationId, 'designationId');
//     const effectiveDate = body?.date || new Date().toISOString();


//     const baseParams = {
//       orgId,
//       history: { $exists: true, $type: "object" }
//     };

//     // Build conditional filters
//     const conditionalFilters = [];
//     if (body?.subOrgId) conditionalFilters.push({ $eq: ["$subOrgId", validateObjectId(body.subOrgId, 'subOrgId')] });
//     if (body?.branchId) conditionalFilters.push({ $eq: ["$branchId", validateObjectId(body.branchId, 'branchId')] });
//     if (body?.departmentId) conditionalFilters.push({ $eq: ["$departmentId", validateObjectId(body.departmentId, 'departmentId')] });
// let designationId = null;
// if(body?.designationId){
//   designationId = validateObjectId(body.designationId, 'designationId');
// }
//     const query = [
//       { $match: baseParams },
//       {
//         $match: {
//           $expr: {
//             $or: [
//               { $ne: ["$designationId", designationId] },
//               {
//                 $and: [
//                   { $eq: ["$designationId", designationId] },
//                   ...conditionalFilters
//                 ]
//               }
//             ]
//           }
//         }
//       },
//       {
//         $addFields: {
//           validHistoryEntries: {
//             $filter: {
//               input: { $objectToArray: "$history" },
//               as: "entry",
//               cond: {
//                 $and: [
//                   { $ne: ["$$entry.v.effectiveFrom", null] },
//                   { $ne: ["$$entry.v.effectiveFrom", ""] },
//                   {
//                     $lte: [
//                       { $dateFromString: { dateString: "$$entry.v.effectiveFrom", onError: null } },
//                       { $dateFromString: { dateString: effectiveDate, onError: new Date() } }
//                     ]
//                   }
//                 ]
//               }
//             }
//           }
//         }
//       },
//       {
//         $addFields: {
//           latest: {
//             $cond: [
//               { $gt: [{ $size: "$validHistoryEntries" }, 0] },
//               {
//                 $let: {
//                   vars: {
//                     sortedEntries: {
//                       $sortArray: {
//                         input: "$validHistoryEntries",
//                         sortBy: { "v.effectiveFrom": -1 }
//                       }
//                     }
//                   },
//                   in: {
//                     priceId: { $arrayElemAt: ["$$sortedEntries.k", 0] },
//                     data: { $arrayElemAt: ["$$sortedEntries.v", 0] }
//                   }
//                 }
//               },
//               null
//             ]
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: "designation",
//           localField: "designationId",
//           foreignField: "_id",
//           as: "designation",
//           pipeline: [{ $project: { name: 1 } }] // Only fetch name field
//         }
//       },
//       {
//         $project: {
//           baseQuotePriceId: "$_id",
//           designationName: { $arrayElemAt: ["$designation.name", 0] },
//           latest: 1,
//           designationId: 1,
//           orgId: 1,
//           isActive: 1,
//           createdBy: 1,
//           createdAt: 1,
//           _id: 0
//         }
//       },
//       {
//         $group: {
//           _id: "$designationId",
//           doc: { $first: "$$ROOT" }
//         }
//       },
//       { $replaceRoot: { newRoot: "$doc" } }
//     ];

//     return await aggregationWithPegination(query, {}, COLLECTION_NAME);
//   } catch (error) {
//     logger.error(`Error in standardQuotePricesList: ${error.message}`);
//     throw error;
//   }
// };

export const standardQuotePricesList = async (body) => {
  try {
    const effectiveDate = body?.date ? new Date(body.date) : new Date();

    // Build branch filters
    const branchFilters = {};
    if (body?.subOrgId) branchFilters.subOrgId = validateObjectId(body.subOrgId, 'subOrgId');
    if (body?.branchId) branchFilters.branchId = validateObjectId(body.branchId, 'branchId');
    if (body?.departmentId) branchFilters.departmentId = validateObjectId(body.departmentId, 'departmentId');

    logger.info('Getting standard quote prices list', {
      effectiveDate,
      branchFilters
    });

    // Build designation filter if provided
    const designationFilter = {};
    if (body?.designationId) {
      designationFilter.designationId = validateObjectId(body.designationId, 'designationId');
    }

    const query =[
  // Step 1: Match ALL base prices by orgId only (REMOVED subOrgId/branchId filter)
  {
    $match: {
      orgId: new ObjectId(body?.user?.orgId),
      isActive: true
    }
  },

  // Step 2: Lookup base price history
  {
    $lookup: {
      from: "baseQuotationPriceHistory",
      localField: "_id",
      foreignField: "basePriceId",
      as: "prices"
    }
  },

  // Step 3: Filter valid base history
  {
    $addFields: {
      validBaseHistory: {
        $filter: {
          input: "$prices",
          as: "entry",
          cond: {
            $and: [
              { $ne: ["$$entry.effectiveFrom", null] },
              { $ne: ["$$entry.effectiveFrom", ""] },
              {
                $lte: [
                  {
                    $dateFromString: {
                      dateString: "$$entry.effectiveFrom",
                      onError: null,
                      onNull: null
                    }
                  },
                  {
                    $dateFromString: {
                      dateString:body?.date
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    }
  },

  // Step 4: Get latest base price
  {
    $addFields: {
      latestBasePrice: {
        $cond: [
          { $gt: [{ $size: "$validBaseHistory" }, 0] },
          {
            $let: {
              vars: {
                sortedEntries: {
                  $sortArray: {
                    input: "$validBaseHistory",
                    sortBy: {
                      effectiveFrom: -1,
                      createdAt: -1
                    }
                  }
                }
              },
              in: {
                priceId: { $arrayElemAt: ["$$sortedEntries._id", 0] },
                data: { $arrayElemAt: ["$$sortedEntries", 0] },
                effectiveFrom: { $arrayElemAt: ["$$sortedEntries.effectiveFrom", 0] },
                createdAt: { $arrayElemAt: ["$$sortedEntries.createdAt", 0] }
              }
            }
          },
          null
        ]
      }
    }
  },

  // Step 5: Lookup branch-specific modifications
  {
    $lookup: {
      from: "designation",
      let: {
        baseId: "$_id",
        designationId: "$designationId"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$baseQuotePriceId", "$$baseId"] },
                { $eq: ["$designationId",body?.designationId ?new ObjectId(body?.designationId): "$$designationId"] },
                { $eq: ["$isActive", true] },
                { $eq: ["$subOrgId",new ObjectId(body?.subOrgId)] },
                { $eq: ["$branchId", new ObjectId(body?.branchId)] }
              ]
            }
          }
        },
        {
          $addFields: {
            validRefHistory: {
              $filter: {
                input: "$history",
                as: "entry",
                cond: {
                  $and: [
                    { $ne: ["$$entry.effectiveFrom", null] },
                    { $ne: ["$$entry.effectiveFrom", ""] },
                    {
                      $lte: [
                        {
                          $dateFromString: {
                            dateString: "$$entry.effectiveFrom",
                            onError: null,
                            onNull: null
                          }
                        },
                        {
                          $dateFromString: {
                            dateString: "2025-10-06"
                          }
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $addFields: {
            latestRefPrice: {
              $cond: [
                { $gt: [{ $size: "$validRefHistory" }, 0] },
                {
                  $let: {
                    vars: {
                      sortedEntries: {
                        $sortArray: {
                          input: "$validRefHistory",
                          sortBy: {
                            effectiveFrom: -1,
                            createdAt: -1
                          }
                        }
                      }
                    },
                    in: {
                      priceId: { $arrayElemAt: ["$$sortedEntries._id", 0] },
                      data: { $arrayElemAt: ["$$sortedEntries", 0] },
                      effectiveFrom: { $arrayElemAt: ["$$sortedEntries.effectiveFrom", 0] },
                      createdAt: { $arrayElemAt: ["$$sortedEntries.createdAt", 0] },
                      referenceId: "$_id"
                    }
                  }
                },
                null
              ]
            }
          }
        },
        {
          $project: {
            latestRefPrice: 1,
            subOrgId: 1,
            branchId: 1,
            departmentId: 1
          }
        }
      ],
      as: "branchModifications"
    }
  },

  // Step 6: Determine final price (branch priority, fallback to base)
  {
    $addFields: {
      finalPrice: {
        $cond: [
          {
            $and: [
              { $gt: [{ $size: "$branchModifications" }, 0] },
              {
                $ne: [
                  { $arrayElemAt: ["$branchModifications.latestRefPrice", 0] },
                  null
                ]
              }
            ]
          },
          {
            $let: {
              vars: {
                branchMod: { $arrayElemAt: ["$branchModifications", 0] },
                latestRef: { $arrayElemAt: ["$branchModifications.latestRefPrice", 0] }
              },
              in: {
                priceId: "$$latestRef.priceId",
                data: "$$latestRef.data",
                effectiveFrom: "$$latestRef.effectiveFrom",
                createdAt: "$$latestRef.createdAt",
                source: "branch",
                referenceId: "$$latestRef.referenceId",
                branchInfo: {
                  subOrgId: "$$branchMod.subOrgId",
                  branchId: "$$branchMod.branchId",
                  departmentId: "$$branchMod.departmentId"
                }
              }
            }
          },
          {
            $cond: [
              { $ne: ["$latestBasePrice", null] },
              {
                $mergeObjects: [
                  "$latestBasePrice",
                  {
                    source: "base",
                    branchInfo: null
                  }
                ]
              },
              null
            ]
          }
        ]
      }
    }
  },

  // Step 7: Filter out records without prices
  {
    $match: {
      finalPrice: { $ne: null }
    }
  },

  // Step 8: Lookup designation details
  {
    $lookup: {
      from: "designation",
      localField: "designationId",
      foreignField: "_id",
      as: "designation",
      pipeline: [
        {
          $project: {
            name: 1,
            code: 1
          }
        }
      ]
    }
  },

  // Step 9: Project final structure
  {
    $project: {
      baseQuotePriceId: "$_id",
      designationId: 1,
      designationName: { $arrayElemAt: ["$designation.name", 0] },
      designationCode: { $arrayElemAt: ["$designation.code", 0] },
      priceId: "$finalPrice.priceId",
      priceData: "$finalPrice.data",
      effectiveFrom: "$finalPrice.effectiveFrom",
      createdAt: "$finalPrice.createdAt",
      source: "$finalPrice.source",
      branchInfo: "$finalPrice.branchInfo",
      referenceId: "$finalPrice.referenceId",
      history: "$validBaseHistory",
      orgId: 1,
      _id: 0
    }
  },

  // Step 10: Sort results
  {
    $sort: {
      source: -1,  // Branch prices first
      designationName: 1,
      effectiveFrom: -1,
      createdAt: -1
    }
  }
]
console.log(JSON.stringify(query,null,2))
    const result = await aggregationWithPegination(query, {}, COLLECTION_NAME);

    if (result?.status && result?.data) {
      const summary = {
        total: result.data.length,
        basePrice: result.data.filter(item => item.source === 'base').length,
        branchSpecific: result.data.filter(item => item.source === 'branch').length,
        effectiveDate: effectiveDate.toISOString(),
        branchFilters: branchFilters
      };

      logger.info('Standard quote prices list retrieved successfully', summary);

      return {
        ...result,
        summary
      };
    }

    return result;

  } catch (error) {
    logger.error(`Error in standardQuotePricesList: ${error.message}`, {
      stack: error.stack,
      body: body
    });
    throw error;
  }
};
export const standardQuotePricesByDesignation = async (body) => {
  try {
    const { orgId } = validateUserAndOrg(body);
    const optionalParams = buildOptionalParams(body);

    const pipeline = [
      {
        $match: {
          orgId,
          ...optionalParams,
          history: { $exists: true, $type: "object" }
        }
      },
      {
        $addFields: {
          historyArray: { $objectToArray: "$history" }
        }
      },
      {
        $addFields: {
          validHistoryEntries: {
            $filter: {
              input: "$historyArray",
              as: "entry",
              cond: {
                $and: [
                  { $ne: ["$$entry.v.effectiveFrom", null] },
                  { $ne: ["$$entry.v.effectiveFrom", ""] },
                  {
                    $lte: [
                      { $dateFromString: { dateString: "$$entry.v.effectiveFrom", onError: null } },
                      new Date()
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      { $unwind: "$validHistoryEntries" },
      { $sort: { "validHistoryEntries.v.effectiveFrom": -1 } },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          latestHistory: { $first: "$validHistoryEntries" }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                baseQuotePriceId: "$doc._id",
                designationId: "$doc.designationId",
                orgId: "$doc.orgId",
                isActive: "$doc.isActive",
                createdBy: "$doc.createdBy",
                createdAt: "$doc.createdAt"
              },
              "$latestHistory.v",
              { priceId: "$latestHistory.k" }
            ]
          }
        }
      },
      {
        $lookup: {
          from: "designation",
          localField: "designationId",
          foreignField: "_id",
          as: "designation",
          pipeline: [{ $project: { name: 1 } }]
        }
      },
      {
        $addFields: {
          designationName: { $arrayElemAt: ["$designation.name", 0] }
        }
      },
      {
        $project: {
          designation: 0
        }
      }
    ];

    return await aggregate(pipeline, COLLECTION_NAME);
  } catch (error) {
    logger.error(`Error in standardQuotePricesByDesignation: ${error.message}`);
    throw error;
  }
};

export const standardQuotePriceUpdate = async (data) => {
  try {
    logger.info('Starting standardQuotePriceUpdate', {
      baseQuotePriceId: data?.baseQuotePriceId,
      designationId: data?.designationId,
      userId: data?.user?._id
    });

    const { userId, orgId } = validateUserAndOrg(data);

    if (!data?.designationId || !data?.baseQuotePriceId) {
      throw new Error("designationId and baseQuotePriceId are required");
    }

    const designationId = validateObjectId(data.designationId, 'designationId');
    const baseQuotePriceId = validateObjectId(data.baseQuotePriceId, 'baseQuotePriceId');

    logger.info('Validated input parameters', {
      baseQuotePriceId: baseQuotePriceId.toString(),
      designationId: designationId.toString(),
      orgId: orgId.toString(),
      userId: userId.toString()
    });

    // Find existing document
    const existingDocRes = await getOne(
      {
        _id: baseQuotePriceId,
        orgId,
        designationId,
        isActive: true,
      },
      COLLECTION_NAME
    );

    logger.info('Existing document query result', {
      status: existingDocRes?.status,
      hasData: !!existingDocRes?.data,
      error: existingDocRes?.error
    });

    if (!existingDocRes?.status || !existingDocRes?.data) {
      const errorMsg = existingDocRes?.error || "Quotation price not found";
      logger.error('Document not found or query failed', {
        baseQuotePriceId: baseQuotePriceId.toString(),
        error: errorMsg
      });
      return { status: false, message: errorMsg };
    }

    // Build update data
    const bodyData = {
      ...createBodyData(data, userId),
      modifiedBy: userId,
      modifiedAt: new Date(),
    };

    logger.info('Built update data', {
      hasDaily: !!bodyData.daily,
      hasMonthly: !!bodyData.monthly,
      hasYearly: !!bodyData.yearly,
      effectiveFrom: bodyData.effectiveFrom
    });

    // Generate same history ID for both collections
    const historyId = new ObjectId();
    logger.info('Generated history ID', { historyId: historyId.toString() });

    // Update baseQuotationPrice with new history
    const updateQuery = { _id: baseQuotePriceId };
    const updateData = {
      $set: {
        [`history.${historyId}`]: bodyData,
        modifiedBy: userId,
        modifiedAt: new Date()
      }
    };

    logger.info('Executing base document update', {
      updateQuery,
      historyKey: `history.${historyId}`,
      collectionName: COLLECTION_NAME
    });

    const baseUpdateResult = await create(
      updateQuery,
      updateData,
      COLLECTION_NAME
    );

    logger.info('Base update result', {
      status: baseUpdateResult?.status,
      error: baseUpdateResult?.error,
      modifiedCount: baseUpdateResult?.data?.modifiedCount,
      matchedCount: baseUpdateResult?.data?.matchedCount
    });

    if (!baseUpdateResult?.status) {
      const errorMsg = baseUpdateResult?.error || "Failed to update base quotation price";
      logger.error('Base update failed', {
        error: errorMsg,
        baseQuotePriceId: baseQuotePriceId.toString()
      });
      return { status: false, error: errorMsg };
    }

    // Sync history to all related reference quote prices
    let syncResult = { status: true, updatedCount: 0 };

    try {
      logger.info('Starting sync to reference documents');
      syncResult = await syncHistoryToReferences(baseQuotePriceId, historyId, bodyData, userId, orgId);
      logger.info('Sync operation completed', {
        syncStatus: syncResult?.status,
        updatedCount: syncResult?.updatedCount,
        syncError: syncResult?.error
      });
    } catch (syncError) {
      logger.error('Sync operation failed', {
        error: syncError.message,
        stack: syncError.stack
      });
      // Don't fail the main operation if sync fails
      syncResult = { status: false, error: syncError.message, updatedCount: 0 };
    }

    // Log the operation result
    logger.info('Base quotation price updated successfully', {
      baseQuotePriceId: baseQuotePriceId.toString(),
      historyId: historyId.toString(),
      referencesUpdated: syncResult?.updatedCount || 0,
      syncSuccess: syncResult?.status || false
    });

    return {
      status: true,
      data: {
        _id: baseQuotePriceId,
        historyId: historyId.toString(),
        referencesUpdated: syncResult?.updatedCount || 0,
        syncResult: {
          success: syncResult?.status || false,
          error: syncResult?.error || null
        },
        modifiedAt: new Date(),
        modifiedBy: userId
      }
    };

  } catch (error) {
    logger.error(`Error in standardQuotePriceUpdate: ${error.message}`, {
      stack: error.stack,
      data: {
        baseQuotePriceId: data?.baseQuotePriceId,
        designationId: data?.designationId,
        userId: data?.user?._id
      }
    });
    return { status: false, error: error.message };
  }
};

export const modifyQuotePriceForBranch = async (data) => {
  try {
    const { userId, orgId } = validateUserAndOrg(data);

    if (!data?.designationId || !data?.baseQuotePriceId || !data?.priceId) {
      throw new Error("designationId, baseQuotePriceId, and priceId are required");
    }

    const designationId = validateObjectId(data.designationId, 'designationId');
    const baseQuotePriceId = validateObjectId(data.baseQuotePriceId, 'baseQuotePriceId');
    const optionalParams = buildOptionalParams(data);

    // Verify that the baseQuotePriceId exists in baseQuotationPrice collection
    const baseDocRes = await getOne(
      {
        _id: baseQuotePriceId,
        orgId,
        designationId,
        isActive: true,
      },
      COLLECTION_NAME
    );

    if (!baseDocRes?.status || !baseDocRes?.data) {
      return { status: false, message: "Base quotation price not found" };
    }

    const bodyData = createBodyData(data, userId);

    // Check if a reference document already exists for this combination
    const existingRefQuery = {
      orgId,
      designationId,
      baseQuotePriceId,
      ...optionalParams,
      isActive: true
    };

    const existingRefDoc = await getOne(existingRefQuery, REFERENCE_COLLECTION_NAME);

    let result;

    if (existingRefDoc?.status && existingRefDoc?.data) {
      // Update existing reference document
      const historyId = new ObjectId();

      result = await updateOne(
        { _id: existingRefDoc.data._id },
        {
          $set: {
            [`history.${data.priceId}`]: bodyData,
            modifiedBy: userId,
            modifiedAt: new Date()
          }
        },
        REFERENCE_COLLECTION_NAME
      );


    } else {
      // Create new reference document
      const params = {
        orgId,
        designationId,
        baseQuotePriceId,
        ...optionalParams,
        history: { [data.priceId]: bodyData },
        isActive: true,
        createdBy: userId,
        createdAt: new Date(),
      };

      result = await create(params, REFERENCE_COLLECTION_NAME, {
        action: "modifyQuotePriceForBranch",
        userId,
      });

      if (result?.status) {
        logger.info('Branch-specific quotation price created successfully', {
          referenceId: result.data._id.toString(),
          baseQuotePriceId: baseQuotePriceId.toString(),
          priceId: data.priceId
        });
      }
    }

    if (!result?.status) {
      return { status: false, error: result?.error || "Failed to modify branch quotation price" };
    }

    return {
      status: true,
      data: {
        ...result.data,
        baseQuotePriceId: baseQuotePriceId.toString(),
        priceId: data.priceId,
        operation: existingRefDoc?.status ? 'updated' : 'created'
      }
    };

  } catch (error) {
    logger.error(`Error in modifyQuotePriceForBranch: ${error.message}`);
    return { status: false, error: error.message };
  }
};

// Additional function to get branch-specific view with comparison
export const getBranchQuotePricesComparison = async (data) => {
  try {
    const { userId, orgId } = validateUserAndOrg(data);

    const effectiveDate = data?.date ? new Date(data.date) : new Date();
    const branchFilters = buildOptionalParams(data);

    if (Object.keys(branchFilters).length === 0) {
      throw new Error("At least one branch identifier (subOrgId, branchId, or departmentId) is required");
    }

    logger.info('Getting branch quote prices comparison', {
      orgId: orgId.toString(),
      branchFilters: Object.keys(branchFilters),
      effectiveDate
    });

    const query = [
      // Get all base prices
      {
        $match: {
          orgId,
          history: { $exists: true, $type: "object" },
          isActive: true
        }
      },

      // Get base price history
      {
        $addFields: {
          baseHistoryArray: { $objectToArray: "$history" }
        }
      },
      {
        $addFields: {
          latestBasePrice: {
            $let: {
              vars: {
                validEntries: {
                  $filter: {
                    input: "$baseHistoryArray",
                    as: "entry",
                    cond: {
                      $and: [
                        { $ne: ["$entry.v.effectiveFrom", null] },
                        { $ne: ["$entry.v.effectiveFrom", ""] },
                        {
                          $lte: [
                            { $dateFromString: { dateString: "$entry.v.effectiveFrom", onError: null } },
                            effectiveDate
                          ]
                        }
                      ]
                    }
                  }
                }
              },
              in: {
                $cond: [
                  { $gt: [{ $size: "$validEntries" }, 0] },
                  {
                    $let: {
                      vars: {
                        sorted: {
                          $sortArray: {
                            input: "$validEntries",
                            sortBy: { "v.effectiveFrom": -1 }
                          }
                        }
                      },
                      in: {
                        priceId: { $arrayElemAt: ["$sorted.k", 0] },
                        data: { $arrayElemAt: ["$sorted.v", 0] },
                        effectiveFrom: { $arrayElemAt: ["$sorted.v.effectiveFrom", 0] }
                      }
                    }
                  },
                  null
                ]
              }
            }
          }
        }
      },

      // Lookup branch modifications
      {
        $lookup: {
          from: REFERENCE_COLLECTION_NAME,
          let: {
            baseId: "$_id",
            designationId: "$designationId"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$baseQuotePriceId", "$baseId"] },
                    { $eq: ["$designationId", "$designationId"] },
                    { $eq: ["$orgId", orgId] },
                    { $eq: ["$isActive", true] },
                    // Exact match for branch filters
                    ...Object.entries(branchFilters).map(([key, value]) => ({
                      $eq: [`${key}`, value]
                    }))
                  ]
                }
              }
            },
            {
              $addFields: {
                refHistoryArray: { $objectToArray: "$history" }
              }
            },
            {
              $addFields: {
                latestBranchPrice: {
                  $let: {
                    vars: {
                      validEntries: {
                        $filter: {
                          input: "$refHistoryArray",
                          as: "entry",
                          cond: {
                            $and: [
                              { $ne: ["$entry.v.effectiveFrom", null] },
                              { $ne: ["$entry.v.effectiveFrom", ""] },
                              {
                                $lte: [
                                  { $dateFromString: { dateString: "$entry.v.effectiveFrom", onError: null } },
                                  effectiveDate
                                ]
                              }
                            ]
                          }
                        }
                      }
                    },
                    in: {
                      $cond: [
                        { $gt: [{ $size: "$validEntries" }, 0] },
                        {
                          $let: {
                            vars: {
                              sorted: {
                                $sortArray: {
                                  input: "$validEntries",
                                  sortBy: { "v.effectiveFrom": -1 }
                                }
                              }
                            },
                            in: {
                              priceId: { $arrayElemAt: ["$sorted.k", 0] },
                              data: { $arrayElemAt: ["$sorted.v", 0] },
                              effectiveFrom: { $arrayElemAt: ["$sorted.v.effectiveFrom", 0] },
                              referenceId: "$_id"
                            }
                          }
                        },
                        null
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                latestBranchPrice: 1,
                subOrgId: 1,
                branchId: 1,
                departmentId: 1
              }
            }
          ],
          as: "branchPrices"
        }
      },

      // Lookup designation
      {
        $lookup: {
          from: "designation",
          localField: "designationId",
          foreignField: "_id",
          as: "designation",
          pipeline: [{ $project: { name: 1, code: 1 } }]
        }
      },

      // Project final comparison
      {
        $project: {
          baseQuotePriceId: "$_id",
          designationId: 1,
          designationName: { $arrayElemAt: ["$designation.name", 0] },
          designationCode: { $arrayElemAt: ["$designation.code", 0] },
          basePrice: "$latestBasePrice",
          branchPrice: {
            $cond: [
              { $gt: [{ $size: "$branchPrices" }, 0] },
              { $arrayElemAt: ["$branchPrices.latestBranchPrice", 0] },
              null
            ]
          },
          hasCustomPrice: {
            $cond: [
              {
                $and: [
                  { $gt: [{ $size: "$branchPrices" }, 0] },
                  { $ne: [{ $arrayElemAt: ["$branchPrices.latestBranchPrice", 0] }, null] }
                ]
              },
              true,
              false
            ]
          },
          effectivePrice: {
            $cond: [
              {
                $and: [
                  { $gt: [{ $size: "$branchPrices" }, 0] },
                  { $ne: [{ $arrayElemAt: ["$branchPrices.latestBranchPrice", 0] }, null] }
                ]
              },
              { $arrayElemAt: ["$branchPrices.latestBranchPrice", 0] },
              "$latestBasePrice"
            ]
          },
          branchInfo: {
            $cond: [
              { $gt: [{ $size: "$branchPrices" }, 0] },
              {
                subOrgId: { $arrayElemAt: ["$branchPrices.subOrgId", 0] },
                branchId: { $arrayElemAt: ["$branchPrices.branchId", 0] },
                departmentId: { $arrayElemAt: ["$branchPrices.departmentId", 0] }
              },
              branchFilters
            ]
          },
          _id: 0
        }
      },

      // Filter out records without valid base prices
      {
        $match: {
          basePrice: { $ne: null }
        }
      },

      // Sort by designation name
      {
        $sort: {
          designationName: 1
        }
      }
    ];

    const result = await aggregate(query, COLLECTION_NAME);

    if (result?.status && result?.data) {
      const summary = {
        total: result.data.length,
        customPrices: result.data.filter(item => item.hasCustomPrice).length,
        basePrices: result.data.filter(item => !item.hasCustomPrice).length,
        effectiveDate: effectiveDate,
        branchFilters: branchFilters
      };

      logger.info('Branch quote prices comparison completed', summary);

      return {
        ...result,
        summary
      };
    }

    return result;

  } catch (error) {
    logger.error(`Error in getBranchQuotePricesComparison: ${error.message}`, {
      stack: error.stack,
      data: data
    });
    throw error;
  }
};