import { aggregate, aggregationWithPegination, bulkWriteOperations, create, getMany, getOne, updateOne } from '../../helper/mongo.js'
import { logger } from '../../helper/logger.js';
import { ObjectId } from 'mongodb';
import { getCurrentDateTime } from '../../helper/formatting.js';
import { QueryBuilder } from "../../helper/filter.js";
import { adminRoleId } from "../../helper/constants.js";
import { get } from '../organization/organization.js';


let collection_name = 'client'

export const isClientExist = async (body) => {
  try
  {
    let orgId = body?.user?.orgId
    orgId = typeof orgId === "string" ? new ObjectId(orgId) : orgId;

    const query = {
      orgId: orgId,
      // clientId: body?.clientId? (typeof body.clientId  === "string" ? new ObjectId(body.clientId) : body.clientId) : body.orgId,
      isActive: true,
    }
    if( body?.clientMappedId){
      query['_id'] = body.clientMappedId
    }
    if(body.clientId){
      // Ensure both are valid ObjectId instances
      query.clientId = typeof body.clientId === "string" ? new ObjectId(body.clientId) : body.clientId;
    }

    return await getOne(query, collection_name)
  }
  catch(error)
  {
    logger.error("Error while isClientExist in client module");
    throw error;
  }
}

export const mapClient = async (body) => {
    try {
      let orgId = body?.user?.orgId
      orgId = typeof orgId === "string" ? new ObjectId(orgId) : orgId;

      const query = {
        orgId: orgId,
        clientId: body?.clientId? (typeof body.clientId  === "string" ? new ObjectId(body.clientId) : body.clientId) : body.orgId,
        createdBy: body.user._id,
        createdAt: new Date(),
        isActive: true,
        ...(body.name && {nickName : body.name}),

      }
      return await create(query , collection_name);

    }
    catch (error) {
        logger.error("Error while mapClient in client module");
        throw error;
    }
}

export const addClient = async (body) => {
    try
    {
        let userId = body?.user?._id;
        let businessTypeId = body?.businessTypeId
        let orgId = body?.user?.orgId
        // Ensure both are valid ObjectId instances
        userId = typeof userId === "string" ? new ObjectId(userId) : userId;
        businessTypeId = typeof businessTypeId === "string" ? new ObjectId(businessTypeId) : businessTypeId;
        orgId = typeof orgId === "string" ? new ObjectId(orgId) : orgId;
      
        let query = {
          name: body.name,
          orgId: orgId,
          mobile: body.mobile,
          ...(businessTypeId && { businessTypeId: businessTypeId }),
          ...(body.email && { email: body.email }),
          ...(body.orgName && { orgName: body.orgName }),
          ...(body.location && { location: body.location }),
          ...(body.floors && { floors: body.floors }),
          ...(body.employeesRequired && { employeesRequired: body.employeesRequired }),
          ...(body.area && { area: body.area }),
          password: body.password,
          createdBy: userId,
          isActive: true,
          isClient: true,
          createdDate: new Date(),
          isKYC: false,
      };
        return await create(query , collection_name);
    }
    catch(error)
    {
      logger.error("Error while listOrg in org module");
      throw error;
    }
};

//updateClient
export const updateClient = async (body, params) => {
    try 
    {
      let updateObj = {}
      
      let query = {
        _id: new ObjectId(body.clientId),
        isActive : true
      };

      // if (body.location) 
      // {
      //   for (let field in body.location) 
      //   {
      //     updateObj[`location.${field}`] = body['location'][field]
      //   }
      // } 
    
      if (body.name) 
      {
        for (let field in body.name) 
        {
          updateObj[`name.${field}`] = body['name'][field]
        }
      } 
      if (body.businessTypeId) 
      {
        updateObj['businessTypeId'] = new ObjectId(body.businessTypeId)
      }
      if(body.orgName)
      {
        updateObj['orgName'] = body.orgName
      }
      if(body.mobile)
      {
        updateObj['mobile'] = body.mobile
      }
      if(body.email)
      {
        updateObj['email'] = body.email
      }
      if(body.floors)
      {
        updateObj['floors'] = body.floors
      }
      if(body.employeesRequired)
      {
        updateObj['employeesRequired'] = body.employeesRequired
      }
      if(body.area)
      {
        updateObj['area'] = body.area
      }
      if(body.password)
      {
        updateObj['password'] = body.password
      }
      if(body.gstNo)
      {
        updateObj['gstNo'] = body.gstNo
      }
      if(body.aadharNo)
      {
        updateObj['aadharNo'] = body.aadharNo
      }
      if(body.panNo)
      {
        updateObj['panNo'] = body.panNo
      }

      if(body.gstNo && body.aadharNo && body.panNo)
      {
        updateObj['isKYC'] = true
      }

      if(body.assignToUserId && Array.isArray(body.assignToUserId))
      {
        const users = body.assignToUserId
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
                  { $set: { clientId: new ObjectId(body.clientId) } }, 
                  'user' 
              )
          })
        )

      }

      // if(body.patrolling)
      // {
      //   updateObj['patrolling'] = body.patrolling
      // } 
      if(body.status)
      {
        updateObj['isActive'] = body.status
      } 

      updateObj['modifiedBy'] =  body.authUser?._id || body.user?._id || 1
      updateObj['modifiedDate'] =  getCurrentDateTime()
  
      let update = {
        $set: updateObj
      }
      return await updateOne(query, update, collection_name);
    } 
    catch (error) 
    {
      console.log(error);
      return { status: false, message: "Unable to update branch" };
    }
  }

export const getOneClient = async(body) => {
    try {
      let orgId = body?.user?.orgId
      orgId = typeof orgId === "string" ? new ObjectId(orgId) : orgId;
      
      let query = {  orgId:orgId };

      if(body.clientId){
        let clientId = body?.clientId
        // Ensure both are valid ObjectId instances
        clientId = typeof clientId === "string" ? new ObjectId(clientId) : clientId;
        query['clientId'] = clientId
      }
      if(body.clientMappedId){
        let clientMappedId = body?.clientMappedId
        // Ensure both are valid ObjectId instances
        clientMappedId = typeof clientMappedId === "string" ? new ObjectId(clientMappedId) : clientMappedId;
        query['_id'] = clientMappedId
      }

      return await getOne(query, collection_name)
    }
    catch (error) {
        return {status : false, message : "Failed to get organization details"}
    }
};

export const isMultipleClientValid = async(body) => {
    try {
        let client = body?.client
        // Ensure both are valid ObjectId instances
        let orgId = body?.user?.orgId
        orgId = typeof orgId === "string" ? new ObjectId(orgId) : orgId;

        let query = { _id: {$in : body.clientMappedId.map(c => new ObjectId(c))}, orgId:orgId };
        return await getMany(query, collection_name)
    }
    catch (error) {
        return {status : false, message : "Failed to get organization details"}
    }
};

export const getClient = async (body) => {
  try {
    const query = new QueryBuilder(body.query)
      .addId()
      .addClientId()
      .addIsActive()
      // .addOrgId()

    const params = query.getQueryParams();
    params['orgId'] = body.authUser?.orgId || body.user?.orgId

    let search = null;
    if(body.search && body.search !== ""){
      search = {
        $match: {
          $or: [
            { 'organisation.name': { $regex: body.search, $options: 'i' } },
            { 'orgType.name': { $regex: body.search, $options: 'i' } },
            { 'clientOwner.name': { $regex: body.search, $options: 'i' } },
            { 'nickName': { $regex: body.search, $options: 'i' } }
          ]
        }
      }
    }

    const aggrigationPipeline = [
      {
        $match: params
      },
      {
        $lookup: {
          from: "organization",
          localField: "clientId",
          foreignField: "_id",
          as: "organisation"
        }
      },
      { $unwind: { path: "$organisation", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "user",
          localField: "createdBy",
          foreignField: "_id",
          as: "clientOwner"
        }
      },
      { $unwind: { path: "$clientOwner", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "typesOfOrganization",
          localField: "organisation.orgTypeId",
          foreignField: "_id",
          as: "orgType"
        }
      },
      {
        $unwind: {
          path: "$orgType",
          preserveNullAndEmptyArrays: true
        }
      },
      ...(search ? [search] : []),
      {
        $project: {
          orgId: 1,
          clientId: 1,
          name: "$organisation.name",
          orgTypeId: "$orgType._id",
          type:"$orgType.name",
          createdBy:"$clientOwner.name",
          createdDate:"$organisation.createdDate",
          isActive:"$organisation.isActive",
          nickName: 1,
          modifiedDate: {
              $cond: {
                  if: {
                      $ne: [
                          {
                              $ifNull: ["$organisation.modifiedDate", null]
                          },
                          null
                      ]
                  },
                  then: "$organisation.modifiedDate",
                  else: "$organisation.createdDate"
              }
          }
        }
      },
    ];
    let paginationQuery = {
      page: body.page,
      limit: body.limit,
      sortOrder: -1,
      sortBy: "createdDate"
    }
    return await aggregationWithPegination(aggrigationPipeline, paginationQuery, collection_name,);
  }
  catch (error) {
    logger.error("Error while getClient in client module");
    throw error;
  }
};

export const getClientWithBranchAndFieldOfficer = async (body) => {
  try {
    const query = new QueryBuilder(body.query)
      .addId()
      .addClientId()
      .addIsActive();

    const params = query.getQueryParams();
    params["orgId"] = body.authUser?.orgId || body.user?.orgId;

    let search = null;
    if (body.search && body.search.trim() !== "") {
      search = {
        $match: {
          $or: [
            { "organisation.name": { $regex: body.search, $options: "i" } },
            { "nickName": { $regex: body.search, $options: "i" } },
            { "branches.name": { $regex: body.search, $options: "i" } },
            { "branches.assignedUsers.name.firstName": { $regex: body.search, $options: "i" } }
          ]
        }
      };
    }

    const aggregationPipeline = [
      { $match: params },

      // Join with organization (the client org data)
      {
        $lookup: {
          from: "organization",
          localField: "clientId",
          foreignField: "_id",
          as: "organisation"
        }
      },
      { $unwind: { path: "$organisation", preserveNullAndEmptyArrays: true } },

      // Join client branches
      {
        $lookup: {
          from: "branches",
          let: { clientOrgId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$orgId", "$$clientOrgId"] },
                    { $eq: ["$client", true] },
                    { $eq: ["$isActive", true] }
                  ]
                }
              }
            },
            // Fetch users assigned to this branch
            {
              $lookup: {
                from: "user",
                let: { branchId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ["$$branchId", { $ifNull: ["$clientBranches", []] }]
                      }
                    }
                  },
                  // Join each user's assignment details
                  {
                    $lookup: {
                      from: "assignment",
                      let: { assignmentIds: "$assignmentId" },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $in: ["$_id", { $ifNull: ["$$assignmentIds", []] }] },
                                { $eq: ["$isActive", true] }
                              ]
                            }
                          }
                        },
                        {
                          $project: {
                            _id: 1,
                            designationId: 1,
                            departmentId: 1,
                            branchId: 1,
                            createdDate: 1,
                            subOrgId: 1
                          }
                        }
                      ],
                      as: "assignments"
                    }
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      email: 1,
                      mobile: 1,
                      gender: 1,
                      profileImage: 1,
                      roleId: 1,
                      isActive: 1,
                      assignments: 1
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
                address: 1,
                radius: 1,
                gstNo: 1,
                panNo: 1,
                isActive: 1,
                createdDate: 1,
                fieldOfficer: 1
              }
            }
          ],
          as: "branches"
        }
      },

      ...(search ? [search] : []),

      {
        $project: {
          _id: 1,
          orgId: 1,
          clientId: 1,
          nickName: 1,
          createdBy: 1,
          createdAt: 1,
          isActive: 1,
          "organisation.name": 1,
          "organisation.orgTypeId": 1,
          branches: 1,
          branchCount: { $size: "$branches" },
          modifiedDate: {
            $cond: {
              if: { $ifNull: ["$organisation.modifiedDate", false] },
              then: "$organisation.modifiedDate",
              else: "$organisation.createdDate"
            }
          }
        }
      }
    ];

    const paginationQuery = {
      page: body.page ? parseInt(body.page) : 1,
      limit: body.limit ? parseInt(body.limit) : 10,
      sortOrder: body.sortOrder ? parseInt(body.sortOrder) : -1,
      sortBy: body.sortBy || "createdAt"
    };

    return await aggregationWithPegination(
      aggregationPipeline,
      paginationQuery,
      collection_name
    );
  } catch (error) {
    logger.error("Error while getClientWithBranch in client module", { stack: error.stack });
    throw error;
  }
};


// update client organization
export const updateClientOrganization = async (body) => {
  try {
    const query = {}
    let collectionName='organization'
    if(body.isBranchKYC)collectionName='branches'

    if (body.clientId) {
      query["_id"] = new ObjectId(body.clientId)
    }
    if (body._id) {
      query["_id"] = new ObjectId(body._id)
    }
    
    const params = {
      ...(body.name && { name: body.name }),
      ...(body.orgTypeId && { orgTypeId: new ObjectId(body.orgTypeId)}),
      ...(body.panNo && { panNo: body.panNo }),
      ...(body.gstNo && { gstNo: body.gstNo }),
      ...(body.address && { address: body.address }),
      ...(body.geoLocation&&{geoLocation:body.geoLocation}),
      ...(body.geoJson&&{geoJson:body.geoJson}),
      modifiedBy:new ObjectId(body.user._id),
      modifiedDate:new Date()
    }

    return await updateOne(query, { $set: params },collectionName)

  } catch (error) {
    logger.error("Error while updateClientOrganization in client module");
    throw error;
  }

}

// update client owner
export const updateClientOwner=async(body)=>{
  try{
    const query = {}
    if (body._id) {
      query["_id"] = new ObjectId(body._id)
    }
    if(body.clientId){
      query["orgId"] = new ObjectId(body.clientId)
    }
    const params = {
      ...(body.mobile && { mobile: body.mobile }),
      ...(body?.name?.firstName && { 'name.firstName': body.name.firstName }),
      ...(body?.name?.lastName && { 'name.lastName': body.name.lastName }),
      modifiedBy:new ObjectId(body.user._id),
      modifiedDate:new Date()
    }

    return await updateOne(query, { $set: params }, 'user')

  }catch (error) {
    logger.error("Error while updateClientOwner in client module");
    throw error;
  }
}

// check is client found or not in organization collection
export const isClient=async(body)=>{
  try{
    const query={}
    if(body.clientId){
      query["_id"]=new ObjectId(body.clientId)
    }

    return await getOne(query,'organization',{_id:1,name:1,orgTypeId:1})

  }catch (error) {
    logger.error("Error while isClient in client module");
    throw error;
  }
}

// check client has a owner
export const isClientOwner=async(body)=>{
  try{
    const query={isActive:true}
    if(body.clientId){
      query["orgId"]=new ObjectId(body.clientId)
    }
    if(body.mobile){
      query["mobile"]=body.mobile
    }
    // if(body._id){
    //   query["_id"]=new ObjectId(body._id)
    //   delete query['mobile'] // delete mobile for edit the same logic used both edit and avoid duplicates in create
    // }

    return await getOne(query,'user',{_id:1,mobile:1,orgId:1,name:1})

  }catch (error) {
    logger.error("Error while isClientOwner in client module");
    throw error;
  }
}

export const getIdBasedClient=async(body)=>{
  try{
    const query={_id:new ObjectId(body.clientMappedId), orgId: body.user.orgId}

    // if(body._id){
    //   query["_id"]=new ObjectId(body._id)
    //   delete query['mobile'] // delete mobile for edit the same logic used both edit and avoid duplicates in create
    // }

    return await getOne(query,collection_name)

  }catch (error) {
    logger.error("Error while isClientOwner in client module");
    throw error;
  }
}


// get client list owners
export const getClientOwner=async(body)=>{
  try{
    const query={isActive:true}
    if(body.clientId){
      query["orgId"]=new ObjectId(body.clientId)
      // query['owner']=true
    }
    if(body.mobile){
      query["mobile"]=body.mobile
    }

    return await getOne(query,'user',{_id:1,mobile:1,orgId:1,name:1})

  }catch (error) {
    logger.error("Error while isClientOwner in client module");
    throw error;
  }

}

// get client kyc
export const getClientKYC = async (body) => {
  try {
    const query = {isActive:true}
    let collectionName='organization'
    if(body.isBranchKYC)collectionName='branches'
    if (body.clientId) {
      query["_id"] = new ObjectId(body.clientId)
    }
    if (body._id) {
      query["_id"] = new ObjectId(body._id)
    }
    const pipeline=[
      {
        $match:{
          ...query
        }
      },
      {
        $lookup: {
          from: "addressTypes",
          localField: "address.addressTypeId",
          foreignField: "_id",
          as: "addressType"
        }
      },
      {
        $unwind: {
          path: "$addressType",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          typeOfEntity: 1,
          panNo: 1,
          gstNo: 1,
          address: {
            $mergeObjects: [
              "$address",
              { addressType: "$addressType.name" }
            ]
          },
          geoLocation: 1,
          geoJson: 1,
          subOrgId: 1
        }
      }
    ]

    return await aggregate(pipeline,collectionName)

  } catch (error) {
    logger.error("Error while getClientKYC in client module");
    throw error;
  }
}

  
export const getClientByIds = async (body) => {
  try {
    let query = [
      {
        $match:{
          _id:{$in: body.clientMappedId.map(c => new ObjectId(c))},
        }
      },
      {
        $lookup: {
          from: "organization",
          localField: "clientId",
          foreignField: "_id",
          as: "matchedOrganization"
        }
      },
      {
        $unwind: {
          path: "$matchedOrganization",
          preserveNullAndEmptyArrays: true
        }
      },
      // {
      //   $lookup: {
      //     from: "branches",
      //     localField: "_id",
      //     foreignField: "orgId",
      //     as: "matchedBranches"
      //   }
      // },
      {
        $lookup: {
          from: "branches",
          let: { orgId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$orgId", "$$orgId"] },
                    { $eq: ["$client", true] } // or whatever field denotes it's a client branch
                  ]
                }
              }
            }
          ],
          as: "matchedBranches"
        }
      },
      {
        $unwind: {
          path: "$matchedBranches",
          preserveNullAndEmptyArrays: true
        }
      }
    ]
    console.log(JSON.stringify(query));
    console.log(JSON.stringify(body));
    
    return aggregate(query, collection_name)
  } catch (error) {
    logger.error("Error while getClientByIds in client module");
    throw error;
  }
}


//get clientIds
export const getClientIds = async (body) => {
  try {
    const params={}
    params['orgId'] = new ObjectId(body.user?.orgId)

    if(body.clientMappedId) params['_id'] = new ObjectId(body.clientMappedId)

    const aggrigationPipeline = [
      {
        $match: params
      },
      {
        $project: {
          _id: 1,
          clientId: 1,
          isActive: 1
        }
      },
    ];
    // console.log(JSON.stringify(aggrigationPipeline),"aggrigationPipeline")
    return await aggregationWithPegination(aggrigationPipeline, {}, collection_name);
  } catch (error) {
    logger.error("Error while getClientIds in client module");
    throw error;
  }
}

export const activateOrDeactiveClient= async (body) => {
  try {
    
    let params = {}
    if (body.clientId) {
      params['_id'] = new ObjectId(body.clientId);
    }
    

    const updateData = {
      isActive: body.status,
      modifiedDate: new Date(),
      modifiedBy: new ObjectId(body.user?._id)
    };

    return await updateOne(params, {$set:updateData}, 'organization');
    
  } catch (error) {
    logger.error("Error while activateOrDeactivateBranch in client branch model");
    throw error;
  }
}

export const clientCount = async (body) => {
  try {

    const getData = [
      {
        $match: {
          orgId: new ObjectId(body?.user?.orgId),
          isActive: true
        }
      },
      {
        $lookup: {
          from: "organization",
          let: { clientId: "$clientId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$clientId"] },
                    { $eq: ["$isActive", true] }
                  ]
                }
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
            }
          ],
          as: "organizationsData"
        }
      },
      {
        $unwind: "$organizationsData"
      },
      {
        $group: {
          _id: null,
          current: {
            $sum: { $cond: ["$organizationsData.isCurrentMonth", 1, 0] }
          },
          active: { $sum: 1 } // includes current + other active orgs
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

    return await aggregate(getData, 'client');

  } catch (error) {
    logger.error("Error while client get in client branch model");
    throw error;
  }
}

