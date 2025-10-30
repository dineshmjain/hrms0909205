import { aggregate, aggregationWithPegination, bulkWriteOperations, create, getMany, getOne, updateOne } from '../../helper/mongo.js'
import { logger } from '../../helper/logger.js';
import { ObjectId } from 'mongodb';
import { getCurrentDateTime } from '../../helper/formatting.js';
import { QueryBuilder } from "../../helper/filter.js";


let collection_name = 'client'
const REQUIREMENTS_COLLECTION = 'branchRequirements';

export const getClientBranch = async (body) => {
  try {
    console.log(body.query, "body");

    const query = new QueryBuilder(body)
      .addId()
      .addIsActive()
      .addOrgId();

    const params = query.getQueryParams();
    console.log(params, "params");

    const aggregationPipeline = [
      { $match: { ...params } },
      {
        $lookup: {
          from: "user",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      // Lookup all users whose clientBranches contains this branch _id
      {
        $lookup: {
          from: "user",
          let: { branchId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$$branchId",
                    { $ifNull: ["$clientBranches", []] } // <= important line
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                mobile: 1,
                profileImage: 1,
                role: 1
              }
            }
          ],
          as: "fieldOfficer"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          isActive: 1,
          clientId: 1,
          clientMappedId: "$orgId",
          address: 1,
          geoLocation: 1,
          geoJson: 1,
          createdDate: 1,
          createdBy: {
            _id: "$userDetails._id",
            name: "$userDetails.name"
          },
          businessTypeId: 1,
          subOrgId: 1,
          createdAt: "$createdDate",
          fieldOfficer: 1 // keep the array as-is
        }
      }
    ];

    console.log(JSON.stringify(aggregationPipeline), "aggregationPipeline");

    return await aggregationWithPegination(aggregationPipeline, body, "branches");
  } catch (error) {
    logger.error("Error while getClientBranch in branch module", error);
    throw error;
  }
};

export const isMultipleBranchValid = async (body) => {
    try {
      let params = {
        // orgId:body.user.orgId,

      }
      if(body.clientMappedId && Array.isArray(body.clientMappedId)) {
        params['_id'] = {$in : body.clientMappedId.map(c => new ObjectId(c))}
      }
      const aggrigationPipeline = [
        {
          $match: params
        },
        {
          $lookup: {
            from: "branches",
            localField: "_id",
            foreignField: "orgId",
            as: "branchDetails",
            pipeline: [
              {
                $match: {
                  isActive: true,
                  $or: [
                    {
                      clientId: {
                        $exists: true
                      }
                    },
                    {
                      client: {
                        $exists: true
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          $unwind: "$branchDetails"
        },
        {
          $addFields: {
            originalDoc: "$$ROOT"
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$branchDetails",
                {
                  clientId: "$originalDoc.clientId"
                }
              ]
            }
          }
        }
      ]

      // if(body.clientBranchIds && body.clientBranchIds.length > 0) {
      //   aggrigationPipeline[4]['$match']['_id'] = {$in : body.clientBranchIds.map(cb => new ObjectId(cb))}
      // }
      // console.log(JSON.stringify(aggrigationPipeline))
      return await aggregate(aggrigationPipeline,collection_name,);
    }
    catch(error)
    {
        logger.error("Error while getDepartment in departmnet module");
        throw error;
    }
};


export const isClientBranch= async (body) => {
  try {
      let params = {
          client:true,
          isActive: true
      }
      if (body.clientMappedId) {
          params['orgId'] = new ObjectId(body.clientMappedId);
      }
      if(body.id){
          params['_id'] = new ObjectId(body.id);
      }
      if(body.status!== undefined && body.status !== null) {
          params['isActive'] = body.status === 'true';
          delete params['isActive'];
      }
      return await getOne(params, 'branches');
  } catch (error) {
      logger.error("Error while isClientBranch in client branch model");
      throw error;
  }
}


export const activateOrDeactivateBranch = async (body) => {
  try {
    if (!body.id) throw new Error("Branch ID is required");
    let params = {
      client: true
    }
    if (body.clientMappedId) {
      params['orgId'] = new ObjectId(body.clientMappedId);
    }
    if (body.id) {
      params['_id'] = new ObjectId(body.id);
    }

    const updateData = {
      isActive: body.status,
      modifiedDate: new Date(),
      modifiedBy: new ObjectId(body.user?._id)
    };

    return await updateOne(params, {$set:updateData}, 'branches');
    
  } catch (error) {
    logger.error("Error while activateOrDeactivateBranch in client branch model");
    throw error;
  }
}

export const getShiftIdsByClientRequirement = async (body) => {
  try {
    const requirementIds = body.user?.requirementIds || [];
    const formattedIds = requirementIds.map(id => new ObjectId(id));

    const { status, data } = await getMany(
      { _id: { $in: formattedIds }, isActive: true },
      REQUIREMENTS_COLLECTION,
      { shiftId: 1, _id: 0 }
    );

    if (!status || !data?.length) {
      return { status: true, data: [] };
    }

    const shiftIds = data.map(item => item.shiftId)

    return {
      status: true,
      data: shiftIds
    };

  } catch (error) {
    logger.error("Error while getShiftByClientRequirement:", error);
    throw error;
  }
};
