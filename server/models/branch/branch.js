import { ObjectId } from 'mongodb';
import { getMany, getOne, updateOne, create, createMany, aggregate,aggregationWithPegination, findOneAndUpdate, updateMany } from "../../helper/mongo.js"
import { convertToYYYYMMDD, getCurrentDateTime } from '../../helper/formatting.js';
import { QueryBuilder } from '../../helper/filter.js';
import { logger } from '../../helper/logger.js';
import { isOrgExist } from '../organization/organization.js';
import { allowed_branch_params } from '../../helper/constants.js';
import { check } from '../../controllers/leavePolicy/leavePolicy.js';

const collection_name = "branches"
const REQUIREMENTS_COLLECTION = "branchRequirements"
const SHIFT_COLLECTION = "shift"
const DESIGNATION_COLLECTION = "designation"
const USERS_COLLECTION = "user"
const ASSIGNMENT_COLLECTION = "assignment"
const DEPARTMENT_COLLECTION = "department"

export const addBranch = async (body) => {
  try {
    let query = {
      // orgId: new ObjectId(body.user.orgId),
      ...body.branchData
    };

    // if(!body.clientId) query['orgId'] = new ObjectId(body.user.orgId)
    // const getQuery = await create(query, "branches");
    // console.log("getQuery", query)
    return await create(query, "branches");

  } catch (error) {
    console.log(error);
    return { status: false, message: "Unable to get Branch Data" };
  }
}


export const addRequirements = async (body) => {
  try {
    const requirementsDocs = body.requirements.map((req) => ({
      orgId: new ObjectId(body.clientMappedId),
      clientId: new ObjectId(body.clientId),
      branchId: new ObjectId(body.branchId),
      shiftId: new ObjectId(req.shiftId),
      designationId: new ObjectId(req.designationId),
      gender: req.gender,
      requiredCount: req.count,
      assignedCount: 0,
      checkPoints: req?.checkPoints ? Number(req.checkPoints) : 0,
      isActive: true,
      createdBy: new ObjectId(body.user?._id || body.createdBy),
      createdDate: new Date()
    }));

    return await createMany(requirementsDocs, REQUIREMENTS_COLLECTION);
  } catch (error) {
    console.error("Error in addRequirements:", error);
    return { status: false, message: "Unable to add branch requirements" };
  }
};

export const updateRequirements = async (body) => {
  try {
    const { requirementId, updates, user } = body;

    if (!requirementId) {
      return { status: false, message: "Requirement ID is missing" };
    }

    const query = { _id: new ObjectId(requirementId) };

    // Fetch existing document to verify it exists
    const existing = await getOne(query, REQUIREMENTS_COLLECTION);
    if (!existing.status) {
      return { status: false, message: "Requirement not found" };
    }

    const updateObj = {};
    const allowedFields = [
      "shiftId",
      "designationId",
      "gender",
      "requiredCount",
      "assignedCount",
      "isActive",
      "checkPoints"
    ];

    // Add only valid fields to updateObj
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        if (["shiftId", "designationId"].includes(key) && ObjectId.isValid(updates[key])) {
          updateObj[key] = new ObjectId(updates[key]);
        } else {
          updateObj[key] = updates[key];
        }
      }
    }

    // Add metadata
    updateObj.modifiedBy = new ObjectId(user?._id || body.modifiedBy);
    updateObj.modifiedDate = new Date();

    // Construct final MongoDB update object
    const update = { $set: updateObj };

    const result = await updateOne(query, update, REQUIREMENTS_COLLECTION);

    if (!result.status) {
      return { status: false, message: "Failed to update requirement" };
    }

    return { status: true, message: "Requirement updated successfully" };
  } catch (error) {
    console.error("Error in updateRequirements:", error);
    return { status: false, message: "Unable to update branch requirement" };
  }
};


export const listRequirements = async (body) => {
  try {
    const matchStage = {};

    if (body.orgId) matchStage.orgId = new ObjectId(body.orgId);
    if (body.clientId) matchStage.clientId = new ObjectId(body.clientId);
    if (body.branchId) matchStage.branchId = new ObjectId(body.branchId);
    if (body.shiftId) matchStage.shiftId = new ObjectId(body.shiftId);
    if (body.designationId) matchStage.designationId = new ObjectId(body.designationId);
    if (body.gender) matchStage.gender = body.gender;
    matchStage.isActive = true;

    let search = null;
    if (body.search && body.search.trim() !== "") {
      search = {
        $match: {
          $or: [
            { "shiftDetails.name": { $regex: body.search, $options: "i" } },
            { "designationDetails.name": { $regex: body.search, $options: "i" } },
            { gender: { $regex: body.search, $options: "i" } }
          ]
        }
      };
    }

    const aggregationPipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: SHIFT_COLLECTION,
          localField: "shiftId",
          foreignField: "_id",
          as: "shiftDetails"
        }
      },
      { $unwind: { path: "$shiftDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: DESIGNATION_COLLECTION,
          localField: "designationId",
          foreignField: "_id",
          as: "designationDetails"
        }
      },
      { $unwind: { path: "$designationDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: USERS_COLLECTION,
          let: { requirementId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$$requirementId",
                    { $ifNull: ["$requirementIds", []] } 
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                gender: 1,
                designation: 1,
                branchId: 1,
              }
            }
          ],
          as: "assignedUsers"
        }
      },
      ...(search ? [search] : []),
      {
        $project: {
          _id: 1,
          orgId: 1,
          clientId: 1,
          branchId: 1,
          shiftId: 1,
          designationId: 1,
          gender: 1,
          requiredCount: 1,
          assignedCount: 1,
          checkPoints: 1,
          isActive: 1,
          createdDate: 1,
          "shiftDetails.name": 1,
          "designationDetails.name": 1,
          assignedUsers: 1, 
        }
      },
    ];

    const paginationQuery = {
      page: body.page ? parseInt(body.page) : 1,
      limit: body.limit ? parseInt(body.limit) : 10,
      sortOrder: body.sortOrder ? parseInt(body.sortOrder) : -1,
      sortBy: body.sortBy || "createdDate",
    };
console.log(JSON.stringify(aggregationPipeline,null,2),'hello')
    const result = await aggregationWithPegination(
      aggregationPipeline,
      paginationQuery,
      REQUIREMENTS_COLLECTION
    );

    return {
      status: true,
      message: "Requirements fetched successfully",
      total: result.totalRecord,
      next_page: result.next_page,
      data: result.data,
    };
  } catch (error) {
    logger.error("Error while listRequirements:", error);
    return { status: false, message: "Unable to fetch branch requirements" };
  }
};

export const listRequirementUsers = async (body) => {
  try {
    const { clientMappedId, clientBranchIds, limit = 10, page = 1 } = body;

    if (!clientMappedId) {
      return { status: false, message: "Organization ID is required" };
    }

    const orgId = new ObjectId(clientMappedId);
    const branchIds = Array.isArray(clientBranchIds)
      ? clientBranchIds.map((id) => new ObjectId(id))
      : [];

    const aggregationPipeline = [
      {
        $match: {
          orgId: orgId,
          ...(branchIds.length > 0 ? { branchId: { $in: branchIds } } : {}),
          isActive: true,
        },
      },
      {
        $lookup: {
          from: USERS_COLLECTION,
          let: { requirementId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$requirementId", { $ifNull: ["$requirementIds", []] }],
                },
              },
            },
            {
              $lookup: {
                from: ASSIGNMENT_COLLECTION,
                let: { assignmentIds: "$assignmentId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ["$_id", { $ifNull: ["$$assignmentIds", []] }],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: DEPARTMENT_COLLECTION,
                      localField: "departmentId",
                      foreignField: "_id",
                      as: "departmentDetails",
                    },
                  },
                  {
                    $unwind: {
                      path: "$departmentDetails",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $lookup: {
                      from: DESIGNATION_COLLECTION,
                      localField: "designationId",
                      foreignField: "_id",
                      as: "designationDetails",
                    },
                  },
                  {
                    $unwind: {
                      path: "$designationDetails",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      "departmentDetails.name": 1,
                      "designationDetails.name": 1,
                    },
                  },
                ],
                as: "assignmentDetails",
              },
            },
            {
              $addFields: {
                departmentName: {
                  $arrayElemAt: ["$assignmentDetails.departmentDetails.name", 0],
                },
                designationName: {
                  $arrayElemAt: ["$assignmentDetails.designationDetails.name", 0],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                gender: 1,
                requirementIds: 1,
                departmentName: 1,
                designationName: 1,
                mobile: 1, // Added this field
              },
            },
          ],
          as: "users",
        },
      },
      { $unwind: "$users" },
      { $replaceRoot: { newRoot: "$users" } },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          gender: { $first: "$gender" },
          mobile: { $first: "$mobile" },
          requirementIds: { $first: "$requirementIds" },
          departmentName: { $first: "$departmentName" },
          designationName: { $first: "$designationName" },
        },
      },
    ];

    return await aggregationWithPegination(
      aggregationPipeline,
      { limit, page, sortBy: "name.firstName", sortOrder: 1 },
      REQUIREMENTS_COLLECTION
    );
  } catch (error) {
    logger.error("Error in listRequirementUsers:", error);
    return { status: false, message: "Unable to fetch requirement users" };
  }
};


export const assignEmployeesToRequirements = async (body) => {
  try {
    const { requirementId, employeeIds } = body;

    const reqObjectId = new ObjectId(requirementId);
    const empObjectIds = employeeIds.map((id) => new ObjectId(id));

    const existingEmployees = await getMany(
      { _id: { $in: empObjectIds }, requirementIds: reqObjectId },
      USERS_COLLECTION,
      { _id: 1 }
    );

    const alreadyAssignedIds = existingEmployees?.data?.map(e => e._id.toString()) || [];
    const unassignedEmpIds = empObjectIds.filter(
      id => !alreadyAssignedIds.includes(id.toString())
    );

    if (unassignedEmpIds.length === 0) {
      return { status: true, data: { assignedEmployees: 0 } };
    }

    const employeeUpdate = await updateMany(
      { _id: { $in: unassignedEmpIds } },
      { $addToSet: { requirementIds: reqObjectId } },
      USERS_COLLECTION
    );

    if (!employeeUpdate.status) {
      return { status: false };
    }

    const requirementUpdate = await updateOne(
      { _id: reqObjectId },
      { $inc: { assignedCount: unassignedEmpIds.length } },
      REQUIREMENTS_COLLECTION
    );

    if (!requirementUpdate.status) {
      return { status: false };
    }

    return {
      status: true,
      data: {
        newlyAssigned: unassignedEmpIds.length,
        skippedExisting: alreadyAssignedIds.length,
      },
    };
  } catch (error) {
    console.error("Error in assignEmployeesToRequirements:", error);
    return { status: false, message: "Unable to assign employees to requirement" };
  }
};


export const getBranchData = async (body) => {
  try {
    let params = {
      $or:[
        { _id: ObjectId.isValid(body.branchId) ? new ObjectId(body.branchId) : null },
        { name: body.name }
      ]
    }

    if(body.clientId) params['clientId'] = ObjectId.isValid(body.clientId) ? new ObjectId(body.clientId) : null
    else params['orgId'] = body.user.orgId

    let query = [{
      $match: params
    },
    {
      $project: {
        name: 1,
        location: 1,
        gpsL:1,
        geoLocation:1,
        geoJson:1,
        address:1,
        isActive: 1,
        timeSettingType: 1,
        startTime: 1,
        endTime: 1,
        maxIn: 1,
        minOut: 1,
        weekOff: 1,
        salaryCycle: 1
      },
    }];

    return await aggregate(query, "branches");
  } catch (error) {
    console.log(error);
    return { status: false, message: "Unable to get Branch Details" };
  }
}

export const getBranchDataClient = async (body) => {

  try {
    let query = [{
      $match: {
        // orgId: body.user.orgId,
        $or: [
          { _id: ObjectId.isValid(body.branchId) ? new ObjectId(body.branchId) : null },
          { clientId: ObjectId.isValid(body.clientId) ? new ObjectId(body.clientId) : null }],
          name: body.name ,
          orgId:body.user.orgId
      }
    },
    {
      $lookup: {
        from: "user",
        localField: "clientId",
        foreignField: "_id",
        as: "client"
      }
    },
    {
      $unwind: "$client"
    },
    {
      $project: {
        name: 1,
        location: 1,
        isActive: 1,
        branchName : 1,
        location : 1,
        floors : 1,
        employeesRequired : 1,
        area : 1,
        patrolling : 1,
        orgName: "$client.orgName",
      },
    }];
    return await aggregate(query, "branches");
  } catch (error) {
    console.log(error);
    return { status: false, message: "Unable to get Branch Details" };
  }
}

export const editBranch = async (body, params) => {
  try {
    let updateObj = {}
    
    let query = {
      // orgId: new ObjectId(body.user.orgId),
      _id: params.branchId!==undefined ? new ObjectId(params.branchId) : new ObjectId(body.id),
      // isActive: true

    };

    for (let item in body) 
    {
      if (item == 'location') {
        // for (let field in body[item]) {
        //   updateObj[`location.${field}`] = body[item][field]
        // }
        updateObj[`location`] = body[item]

      } 
      if( item == "assignToUserId" && Array.isArray(body[item]))
      {
        const users = body[item]
        const validatedUsers = await Promise.all(
          users.map(async (inputItem) => {
              const inputDetail = await getOne(
                  { _id: new ObjectId(inputItem), isActive: true },
                  'user',
                  {}
              );
              if (!inputDetail.status) throw new Error(`InputId ${inputItem.id} not found in the database`);
              return inputItem
          })
        );
       
        updateObj['assignToUserId'] = validatedUsers

        await Promise.all(
          validatedUsers.map(async (userId) => {
              await updateOne(
                  { _id: new ObjectId(userId) },
                  { $set: { clientBranchId: new ObjectId(body.id) } }, 
                  'user' 
              )
          })
        )
      }
      if(item==='subOrgId')updateObj['subOrgId']=new ObjectId(body.subOrgId)
      else 
      {
        updateObj[item] = body[item]
      } 
    }

    ['token', 'user', 'userId', 'query', 'clientBranchData', 'id','orgDetails' ,'authUser'].forEach(f => delete updateObj[f])

    // console.log("updateObj", updateObj)
    // console.log("query", query)
    let update = {
      $set: {...updateObj,modifiedBy:new ObjectId(body.user._id),modifiedDate:new Date()}
    }

    return await updateOne(query, update, collection_name);
  } catch (error) {
    throw error;
  }
}

export const updateBranchStatus = async (body) => {
  try {

      let query = {
         orgId: new ObjectId(body.user.orgId),
         _id:new ObjectId(body.branchId)

      };

      let update = {
          $set: {
           isActive:body.status,
           modifiedDate:new Date()
          }
      };

      return await updateOne(query, update ,collection_name);
  } catch (error) {
      console.log(error);
      return { status: false, message: "Unable to update branch" };
  }
}


//list branches limited data
export const getBranchesLimited = async (body) => {
  try 
  {
    const paramQuery = new QueryBuilder(body.query)
        .addId()
        .addName()
        .addIsActive()
        .addOrgId()
        .addCreatedAt()
        .addSubOrgId()

      const params = paramQuery.getQueryParams();
  
      let assignmentIds = [];
      if (body.query.assignment) {
          params['_id'] = {$in: body.query.assignment.map(data => data.branchId)};
      }
      let query = [
      {$match:params},
      {
        $project: {
          _id:1,
          name: 1,
        },
      }]

      if(body.query.pagination === false)
      {
        return await aggregate(query, collection_name)
      }
      else
      {
        return await aggregationWithPegination(query, body.query, collection_name, );
      }

  } catch (error) {
    logger.error("Error while getBranchesLimited in branch module");
    throw error;
  }
}


//Get Branch list full data
export const getBranch = async (body) => {
  try{
      const query = new QueryBuilder(body.query)
        .addId()
        .addName()
        .addIsActive()
        .addOrgId()
        .addCreatedAt()
        .addSubOrgId()

      const params = query.getQueryParams();
  
      let assignmentIds = [];
      if (body.query.assignment) {
          assignmentIds = body.query.assignment.map(data => data.branchId);
          // params['_id'] = { $in: assignmentIds };
      }
      const category = body.query?.category;
      const aggrigationPipeline = [
          // {
          //     $match: {...params,clientId:{$exists: false,}}
          // },
          {
            $match: {...params,$or:[{clientId:{$exists: false}},{client:{$exists: false}}]}
          },
          {
            $lookup:{
              from:'addressTypes',
              localField:'address.addressTypeId',
              foreignField:'_id',
              as:'addressType'
      
            }
          },
          {
            $unwind: {
              path: '$addressType',
              preserveNullAndEmptyArrays: true
            }
          },
      
          {
              $lookup: {
                  from: "user",
                  localField: "createdBy",
                  foreignField: "_id",
                  as: "user"
              }
          },
          {
            $unwind: {
              path: '$user',
              preserveNullAndEmptyArrays: true
            }
          },
          {
              $addFields: {
                  createdByName: "$user.name",
                  assigned: { $cond: { if: { $in: ["$_id", assignmentIds] }, then: true, else: false } },
                  address: {
                    $mergeObjects: [
                      "$address",
                      { addressType: "$addressType.name" }
                    ]
                  },
                  modifiedDate: {
                      $cond: {
                          if: {
                              $ne: [
                                  {
                                      $ifNull: ["$modifiedDate", null]
                                  },
                                  null
                              ]
                          },
                          then: "$modifiedDate",
                          else: "$createdDate"
                      }
                  }
                  
              }
          },
          {
              $match: (category === 'assigned') ? { assigned: true } :
                  (category === 'unassigned') ? { assigned: false } : {}
          },
      ];

      if (body.pendingActions) {
        aggrigationPipeline[0]["$match"]["geoJson.coordinates"] = {$exists: false}
      }

      let projection = {}
      allowed_branch_params.forEach(param => {
          if (!body.params || !body.params.length || body.params.includes(param)) {
              projection[param] = 1;
          }
      });
      aggrigationPipeline.push(
          {
              $project: projection
          }
      )
      if (body.query.pagination === false) {
          return await aggregate(aggrigationPipeline, collection_name, params);
      }
      else
      {
        // console.log(JSON.stringify(aggrigationPipeline))
        return await aggregationWithPegination(aggrigationPipeline,body.query,collection_name,params);
      }

  }catch(error){
      logger.error("Error while getBranch in branch module");
      throw error;
  }
};

// get find branch
export const getBranchOne=async(body)=>{
  try{
    let orgId=new ObjectId(body.user?.orgId) || new ObjectId(body?.orgDetails?._id)

    if(body.isClientBranchMatched) orgId = new ObjectId(body.clientMappedId) 
    const query={_id:new ObjectId(body.branchId),orgId:orgId}
    const branchResponse=await getOne(query,collection_name)
    if(branchResponse.status){
      return {status:true,data:branchResponse.data,message:'branch data found'}
    }
    return {status:false,message:'No branch data found',data:[]}

  }catch(error){
    console.log("...error....",error?.message)
    return {status:false,message:error?.message??'Something went wrong in Branch Model of get BranchOne'}

  }
}

export const isMultipleBranchIdValid=async(body)=>{
  try{
    const orgId=body.user?.orgId || body?.orgDetails?._id
    const query={_id: {$in : body.branchId.map(b => new ObjectId(b))},orgId:orgId}
    return await getMany(query,collection_name)
  }catch(error){
    console.log("...error....",error?.message)
    return {status:false,message:error?.message??'Something went wrong in Branch Model of get BranchOne'}

  }
}

export const isMultipleBranchValid=async(body)=>{
  try{
    const orgId=body.user?.orgId || body?.orgDetails?._id
    const query={_id: {$in : body.branch.map(b => new ObjectId(b))},orgId:orgId}
    return await getMany(query,collection_name)
  }catch(error){
    console.log("...error....",error?.message)
    return {status:false,message:error?.message??'Something went wrong in Branch Model of get BranchOne'}

  }
}

export const isCheckinWithinBranch = async (body) => {
  const checkinLocation = {
    type: "Point",
    coordinates: body.geoJson.coordinates
  };

  const radius = body.branchRadius.data.radius

  const query = {
    _id: new ObjectId(body.branchId),
      geoJson: {
      $near: {
        $geometry: checkinLocation,
        $maxDistance: radius
      }
    }
  }

  return await getOne(query, collection_name)

};


export const isBranchExists=async(body)=>{
  try{
    const query={
      isActive:true,
      ...(body.subOrgId && {subOrgId:new ObjectId(body.subOrgId)}),
    }
    if(body.user.orgId){
      query['orgId']=new ObjectId(body.user.orgId)
    }
    if(body.name){
      query['name']=body.name
    }

    return await getOne(query,collection_name)

  }catch(error){
    logger.error("Error while isBranchExists in branch module");
    throw error;
  }
}

// is branchexists
export const isBranchExist=async (body) => {
  try {
    const query = {
      orgId :new ObjectId(body.user.orgId),
      isActive: true
    };

    if (body.subOrgId) 
      query['subOrgId'] = new ObjectId(body.subOrgId);

    if (body.clientMappedId) {
      query['orgId'] = new ObjectId(body.clientMappedId);
    }

    if (body.branchId) {
      query['_id'] = new ObjectId(body.branchId);
      
    }
    if(body.branchIds){
      query['_id'] = new ObjectId(body.branchIds[0]);
      
    }

    return await getOne(query, collection_name);

  } catch (error) {
    logger.error("Error while isBranchExist in branch module");
    throw error;
  }
}

export const getBranchRadius=async (body) => {
  try {
    let query = [
      {
        $match: {
          orgId: body.clientMappedId ? new ObjectId(body.clientMappedId) : new ObjectId(body.user.orgId)
        }
      },
      {
          $lookup: {
              from: "user",
              localField: "createdBy",
              foreignField: "_id",
              as: "user"
          }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          radius: 1,
          name: 1,
          // address: 1,
          address: {
            $cond: {
              if: { $ifNull: ["$address", false] },
              then: {
                addressTypeId: "$address.addressTypeId",
                hno: "$address.hno",
                landmark: "$address.landmark",
                street: "$address.street",
                city: "$address.city",
                district: "$address.district",
                taluk: "$address.taluk",
                state: "$address.state",
                country: "$address.country",
                pincode: {
                  $convert: {
                    input: "$address.pincode",
                    to: "int",
                    onError: null,
                    onNull: null
                  }
                }
              },
              else: null
            }
          },    
          geoJson: 1,
          geoLocation: 1,
          createdDate: 1,
          modifiedDate: 1,
          createdBy: "$user.name",
          geoBoundary:1
        }
      }
    ]

    if(body.subOrgId) {
      query[0].$match['subOrgId'] = new ObjectId(body.subOrgId);
    }

    return await aggregationWithPegination(query, {limit:body.limit, page:body.page, search:body.search}, collection_name, );

  } catch (error) {
    logger.error("Error while getBranchRadius in branch module");
    throw error;
  }
}

export const updateBranchRadius=async (body) => {
  try {
    const query = {
      _id : new ObjectId(body.branchId)
    }

    const updateObj={
      radius: body.radius,
      modifiedBy: new ObjectId(body.user._id),
      modifiedDate: new Date()
    }
    if(body.address){
      updateObj['address'] = body.address;
    }
    if(body.geoJson){
      updateObj['geoJson'] = body.geoJson;
    }
    if(body.geoLocation){
      updateObj['geoLocation'] = body.geoLocation;
    }
    

    let update = {$set : updateObj};

    return await updateOne(query,update, collection_name);

  } catch (error) {
    logger.error("Error while updateBranchRadius in branch module");
    throw error;
  }
}

export const createBranchLogs=async (body) => {
  try {
    let updateFields = ['name', 'address', 'geoLocation', 'geoJson', 'radius', 'createdDate', 'createdBy']

    const query = {}

    updateFields.forEach(field => {
      if (body[field]) {
        query[field] = body.branchDetails[field];
      }
      else {
        if(field == 'createdDate' || field == 'createdBy') {
          query[field] = field == 'createdDate' ? new Date() : new ObjectId(body.user._id);
        }
      }
    });

  
    return await create(query, 'branchLogs');

  } catch (error) {
    logger.error("Error while createBranchLogs in branch module");
    throw error;
  }
}


export const getNearestLocationBranch = async (body) => {
  try{
    const checkinLocation = {
      type: "Point",
      coordinates: body.geoJson.coordinates
    };

    const clientIds=body.clientIds.map(c => new ObjectId(c._id));

    const params={
      // client: true,
      isActive: true,
      $or:[{orgId:{$in:clientIds}}]
    }

    if(!body.teamAttendance) params['$or'][0]['orgId']['$in'].push(new ObjectId(body.user.orgId))
    const aggregationPipeline = [
      {
        $geoNear: {
          near: checkinLocation,
          distanceField: "distance",
          spherical: true,
          query: params
        }
      },
      // {
      //   $match: {
      //     $expr: {
      //       $lte: ["$distance", "$radius"]  //Only keep if user is inside radius
      //     }
      //   }
      // },
      {
        $addFields: {
          isWithinRadius: { $lte: ["$distance", "$radius"] },
          outsideBy: {
            $cond: [
              { $gt: ["$distance", "$radius"] },
              { $subtract: ["$distance", "$radius"] },
              0
            ]
          }
        }
      },
      {
        $sort: {
          isWithinRadius: -1, // Prioritize branches within radius
          distance: 1         // Then by closest distance
        }
      },
      {
        $project: {
          _id: 1,
          orgId: 1,
          name: 1,
          geoJson: 1,
          subOrgId: 1,
          distance: 1,
          client:1,
          radius: 1,
          isWithinRadius: 1,
          outsideBy: 1,
          timeSettingType: 1,
          startTime: 1,
          endTime: 1,
          maxIn: 1,
          minOut: 1,
          weekOff: 1,
          salaryCycle: 1,
        }
      },
      // { $sort: { distance: 1 } }, // Sort by distance
      { $limit: 1 }
    ];
    console.log(JSON.stringify(aggregationPipeline),"aggregationPipeline branches")
    return await aggregate(aggregationPipeline,'branches');
  }catch(error){
    logger.error("Error while getNearestLocationBranch in branch module");
    throw error;
  }
  
};

export const branchCount =async(body)=>{
  try{
    const getData=[
  {
    $match: {
      orgId: new ObjectId(body?.user?.orgId),
      isActive: true
    }
  },
  {
    $addFields: {
      isCurrentMonth: {
        $and: [
          {
            $gte: [
              "$createdDate",
              {
                $dateTrunc: {
                  date: "$$NOW",
                  unit: "month"
                }
              }
            ]
          },
          {
            $lt: [
              "$createdDate",
              {
                $dateAdd: {
                  startDate: {
                    $dateTrunc: {
                      date: "$$NOW",
                      unit: "month"
                    }
                  },
                  unit: "month",
                  amount: 1
                }
              }
            ]
          }
        ]
      }
    }
  },
  {
    $group: {
      _id: null,
      current: { $sum: { $cond: ["$isCurrentMonth", 1, 0] } },
      active: { $sum: 1 } // all active
    }
  },
  {
    $project: {
      _id: 0,
      
        current: "$current",
        active: "$active"
      
    }
  }
]
 return await aggregate(getData,'branches');
  }
   
  catch(error){
    logger.error("Error while Branch count in branch module");
    throw error;
  }
}

           
export const updateBranchBoundaryPoints=async(body)=>{
  try{

    const query = {
      _id : new ObjectId(body.branchId)
    }

    const updateObj={
      modifiedBy: new ObjectId(body.user._id),
      modifiedDate: new Date()
    }
   
    if(body.geoBoundary){
      updateObj['geoBoundary'] = body.geoBoundary;
    }
    

    let update = {$set : updateObj};

    return await updateOne(query,update, collection_name);


  }catch(error){
    logger.error("Error while update branch boundary points",{stack:error.stack})
    throw error
  }
}

export const getDefaultBranch=async(body)=>{
  try{

    const query = {
      orgId : new ObjectId(body.user.orgId),
    }
         
    if(body.branchId) query['_id'] = new ObjectId(body.branchId)
    return await getOne(query, collection_name,{},{_id:1}); //sort {_id:1}
  }catch(error){
    logger.error("Error while get default branch",{stack:error.stack})
    throw error
  }
}

export const getBranchClientReq =async(body)=>{
  try{

    const query = {
      orgId : new ObjectId(body.clientMappedId),
      _id : new ObjectId(body.branchId)
    }

    return await getOne(query, collection_name,{address:0,isActive:0,createdDate:0,createdBy:0},{_id:1}); //sort {_id:1}
  }catch(error){
    logger.error("Error while get client req data",{stack:error.stack})
    throw error
  }
}

export const getAssignedBranchDetails =async(body)=>{
  try{

    const query = {
      _id : body.assignmentDetails[0]?.branchId
    }

    return await getOne(query, collection_name); //sort {_id:1}
  }catch(error){
    logger.error("Error while get client req data",{stack:error.stack})
    throw error
  }
}

export const getAllBranches =async(body)=>{
  try{

    const query = {
      $or : [
        { orgId : new ObjectId(body.user.orgId) },
        { orgId : {$in : body.clientIds.map(c => new ObjectId(c._id))} }
      ]
    }

    return await getMany(query, collection_name); //sort {_id:1}
  }catch(error){
    logger.error("Error while get client req data",{stack:error.stack})
    throw error
  }
}