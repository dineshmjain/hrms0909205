import { logger } from "../../helper/logger.js";
import {ObjectId} from "mongodb";
import { create,getOne,aggregationWithPegination,findOneAndUpdate,removeOne,removeMany,aggregate,getMany, createMany, updateMany } from "../../helper/mongo.js";
import { hierarchy } from "../../helper/constants.js";

const collection_name = "assignment";

export const assignment = async (body) => {
  try {
    const { subOrgId, designationId, departmentId, roleId, missingBranchIds } = body;

    if (missingBranchIds && missingBranchIds.length > 0) {
      const newAssignments = missingBranchIds.map(branchId => ({
        orgId: body.user.orgId,
        branchId: new ObjectId(branchId),
        isActive:true,
        createdDate: new Date(),
        createdBy:new ObjectId(body.user._id),
        ...(designationId && { designationId: new ObjectId(designationId) }),
        ...(departmentId && { departmentId : new ObjectId(departmentId) }),
        ...(subOrgId && { subOrgId : new ObjectId(subOrgId) }),
        // ...(roleId && { roleId : new ObjectId(roleId) })
      }));

      const createdAssignments = await createMany(newAssignments, collection_name);
      const createdIds = Object.values(createdAssignments.data.insertedIds);

      return [...(body.assignmentIds || []), ...createdIds]; // return combined ids
    }

    return body.assignmentIds || [];

  } catch (error) {
    throw error;
  }
};


export const getSingleAssignment = async (body) => {
    try{
        let params = Object.create(null);

        params["orgId"] = params["orgId"] ? body.orgDetails._id  : body.user.orgId;
        if(body._id || body.assignmentId){
            params["_id"] = body._id ? body._id : Array.isArray(body.assignmentId) ? {$in: body.assignmentId} : new ObjectId(body.assignmentId);
        }
        if(body.branchId){
            params["branchId"] = new ObjectId(body.branchId);
        }
        if(body.departmentId){
            params["departmentId"] = new ObjectId(body.departmentId)
        }
        if(body.designationId){
            params["designationId"] = new ObjectId(body.designationId)
        }
        
        return await getOne(params,collection_name);  
    }catch(error){
        logger.error("Error while getSingleAssignment in assignment module")
        throw error;
    }
};

export const getAssignment = async (body) => {
    try{

        const {query={}} = body;
        query.orgId = body.user.orgId;
        let params = Object.create(null);
        // params['isActive'] = true
        if(query.id){
            params["_id"] = new ObjectId(query.id);
        }
        else{
            params['_id'] = {$in: body.user.assignmentId}
            // this below condition for _id get defualty added beacuse above else condition
            if(query.id===undefined && body.user.assignmentId===undefined){
                delete params['_id'] 
            }
        }
        if(query.orgId){
            params["orgId"] = new ObjectId(query.orgId);
        }
        if(query.subOrgId){
            params["subOrgId"] = new ObjectId(query.subOrgId);
        }
        if(query.createdAt){
            const start = new Date(query.createdAt);
            const end = new Date(start.getTime() + 24*60*60*1000)

            params["createdAt"] = {$gte:start,$lt:end}
        }
        if(query.branchId){
            params["branchId"] = new ObjectId(query.branchId);
        }
        if(query.departmentId) {
            params["departmentId"] = new ObjectId(query.departmentId);
        }
        if(query.designationId) {
            params["designationId"] = new ObjectId(query.designationId);
        }

        let aggregationFilter = [
            {
                $match:params
            },
            {
                $match: {
                    [`${query.mapedData}Id`]: {
                      $exists: true,
                      $ne: null
                    }
                  }
            },
            { 
                $group: { _id: `$${query.mapedData}Id`, doc: { $first: "$$ROOT" } } 
            },
            { 
                $replaceRoot: { newRoot: "$doc" } 
            },
            // {
            //     $lookup:{
            //         from:`${query.mapedData}`,
            //         localField:`${query.mapedData}Id`,
            //         foreignField:"_id",
            //         as:`${query.mapedData}`
            //     }
            // },
            // {
            //     $unwind: `$${query.mapedData}`
            // },
        ]

        console.log(JSON.stringify(aggregationFilter));
        
        return await aggregate(aggregationFilter,collection_name);
    }catch(error){
        logger.error("Error while getassignment in assignment module");
        throw error;
    }
}

export const getAssignmentbyHirearchy = async (body) => {
    try{
        let query = {orgId: body.user.orgId}
        hierarchy.forEach(h => {
            if(body[`${h}Ids`] || body[`${h}Id`]) {
                query[`${h}Id`] = body[`${h}Ids`] ? {$in : body[`${h}Ids`].map(hi => new ObjectId(hi))} : new ObjectId(body[`${h}Id`]) 
            }
        })

        return await getMany(query,collection_name);
    }catch(error){
        logger.error("Error while getassignment in assignment module");
        throw error;
    }
}

// export const getAssignmentByRaman = async (body) => {
//     try {
//         const { query } = body;
//         const mapedData = query.mapedData; // Extract mapedData from query
//         query.orgId = body.orgDetails._id;

//         let matchStage = {
//             orgId: new ObjectId(query.orgId), // Organization ID is mandatory
//             branchId: new ObjectId(query.branchId), // Branch ID is mandatory
//         };

//         // Add dynamic filtering based on mapedData
//         if (mapedData === 'department') {
//             matchStage['departmentId'] = new ObjectId(query.departmentId);
//         } else if (mapedData === 'designation') {
//             matchStage['departmentId'] = new ObjectId(query.departmentId);
//             matchStage['designationId'] = new ObjectId(query.designationId);
//         }

//         // Optional filters for date and ID
//         if (query.id) {
//             matchStage["_id"] = new ObjectId(query.id);
//         }
//         if (query.createdAt) {
//             const start = new Date(query.createdAt);
//             const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
//             matchStage["createdAt"] = { $gte: start, $lt: end };
//         }
//         if(query.designationId) {
//             params["designationId"] = new ObjectId(query.designationId);
//         }

//         // Aggregation pipeline
//         let aggregationFilter = [
//             {
//                 $match: matchStage, // Match the dynamically constructed filters
//             },
//         ];
//         console.log("qwertyuioppqwertyuiopwertyuio")
//         // Execute aggregation and return the result
//         return await aggregate(aggregationFilter, collection_name);
//     } catch (error) {
//         logger.error("Error while getting assignments in assignment module", { error });
//         throw error;
//     }
// };


// export const getAssignment = async (body) => {
//     try {
//         const { query } = body;
//         const mapedData = query.mapedData; // Extract mapedData from query
//         query.orgId = body.orgDetails._id;

//         let matchStage = {
//             orgId: new ObjectId(query.orgId), // Organization ID is mandatory
//             branchId: new ObjectId(query.branchId), // Branch ID is mandatory
//         };

//         // Add dynamic filtering based on mapedData
//         if (mapedData === 'department') {
//             matchStage['departmentId'] = new ObjectId(query.departmentId);
//         } else if (mapedData === 'designation') {
//             matchStage['departmentId'] = new ObjectId(query.departmentId);
//             matchStage['designationId'] = new ObjectId(query.designationId);
//         }

//         // Optional filters for date and ID
//         if (query.id) {
//             matchStage["_id"] = new ObjectId(query.id);
//         }
//         if (query.createdAt) {
//             const start = new Date(query.createdAt);
//             const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
//             matchStage["createdAt"] = { $gte: start, $lt: end };
//         }
//         if(query.designationId) {
//             params["designationId"] = new ObjectId(query.designationId);
//         }

//         // Aggregation pipeline
//         let aggregationFilter = [
//             {
//                 $match: matchStage, // Match the dynamically constructed filters
//             },
//         ];

//         // Execute aggregation and return the result
//         return await aggregate(aggregationFilter, collection_name);
//     } catch (error) {
//         logger.error("Error while getting assignments in assignment module", { error });
//         throw error;
//     }
// };


export const getAssignmentByRaman = async (body) => {
    try {
        const { query } = body;
        const mapedData = query.mapedData; // Extract mapedData from query
        query.orgId = body.orgDetails._id;

        let matchStage = {
            orgId: new ObjectId(query.orgId), // Organization ID is mandatory
            branchId: new ObjectId(query.branchId), // Branch ID is mandatory
        };

        // Add dynamic filtering based on mapedData
        if (mapedData === 'department') {
            matchStage['departmentId'] = new ObjectId(query.departmentId);
        } else if (mapedData === 'designation') {
            matchStage['departmentId'] = new ObjectId(query.departmentId);
            matchStage['designationId'] = new ObjectId(query.designationId);
        }

        // Optional filters for date and ID
        if (query.id) {
            matchStage["_id"] = new ObjectId(query.id);
        }
        if (query.createdAt) {
            const start = new Date(query.createdAt);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            matchStage["createdAt"] = { $gte: start, $lt: end };
        }
        if(query.designationId) {
            params["designationId"] = new ObjectId(query.designationId);
        }

        // Aggregation pipeline
        let aggregationFilter = [
            {
                $match: matchStage, // Match the dynamically constructed filters
            },
        ];
        console.log("qwertyuioppqwertyuiopwertyuio")
        // Execute aggregation and return the result
        return await aggregate(aggregationFilter, collection_name);
    } catch (error) {
        logger.error("Error while getting assignments in assignment module", { error });
        throw error;
    }
};


export const getAssignmentForUser = async (body) => {
    try{

        const {query} = body;
        query.orgId = body.orgDetails._id;
        let params = Object.create(null);

        if(query.id){
            params["_id"] = new ObjectId(query.id);
        }
        if(query.orgId){
            params["orgId"] = new ObjectId(query.orgId);
        }
        if(query.subOrgId){
            params["subOrgId"] = new ObjectId(query.subOrgId);
        }
        if(query.createdAt){
            const start = new Date(query.createdAt);
            const end = new Date(start.getTime() + 24*60*60*1000)

            params["createdAt"] = {$gte:start,$lt:end}
        }
        if (query.branchId) {
            if (Array.isArray(query.branchId)) {
                params["branchId"] = { $in: query.branchId.map(id => new ObjectId(id)) };
            } else {
                params["branchId"] = new ObjectId(query.branchId);
            }
        }
        if(query.departmentId) {
            params["departmentId"] = new ObjectId(query.departmentId);
        }
        if(query.designationId){
            params["designationId"] = new ObjectId(query.designationId)
        }

        if(query.roleId) params["roleId"] = new ObjectId(query.roleId);

        let aggregationFilter = [
            {
                $match:params
            },
        ]
        
        return await aggregate(aggregationFilter,collection_name);
    }catch(error){
        logger.error("Error while getAssignmentForUser in assignment module");
        throw error;
    }
}


export const deleteMapping = async (branchId, departmentId, designationId, user) => {
    try {
        const query = {
            // branchId: new ObjectId(branchId),
            orgId: user?.orgId,
        };

        if(branchId) query.branchId=new ObjectId(branchId);
        if (departmentId) query.departmentId = new ObjectId(departmentId);
        if (designationId) query.designationId = new ObjectId(designationId);

        return await removeMany(query, collection_name);
    } catch (error) {
        console.log("....error in deleteMapping model...",error?.message)
        logger.error("Error while deleteMapping model function in assignment model");
        throw error;
        
    }
};


//checking all fileds in collection 
export const checkingAllFileds=async(body)=>{
    try{
        const {branchId, user,departmentId,designationId}=body
        let params = Object.create(null);
        const orgId=body.user?.orgId || body?.orgDetails?._id;
        if(orgId) params["orgId"] = orgId
        if(branchId )params["branchId"] = new ObjectId(branchId);
        if(departmentId) params["departmentId"] = new ObjectId(departmentId)
        if(designationId) params["designationId"] = new ObjectId(designationId)
        

        const checkingFiledsstatus= await getMany(params,collection_name);
        if(checkingFiledsstatus.status){
            return {status:true,message:"Data Found",result:checkingFiledsstatus.data}
        }
        return {status:false,message:"branch/department/designation not found  under organisation"};
        

    }catch(error){
        console.log("....error in checkingAllFileds model...",error?.message)
        logger.error("Error while checkingAllFileds function in assignment model");
        throw error;
    }
}


// get all level assignmentids using single assignmentIds this below function for cron job
export const getAllLevelAssignmentIds=async(body)=>{
    try{
        return await getOne({_id:body.assignmentId},collection_name)
        // const {orgId,branchId,departmentId,designationId}=result.data
        

    }catch(error){
        console.log("....error in getAllLevelAssignmentIds model...",error?.message)
        logger.error("Error while getAllLevelAssignmentIds function in assignment model");
        throw error;
    }
}

export const getIdBasedAssignment=async(body)=>{
    try{
        let query = {}
        const assignmentId = body.updatingUserDetails?.assignmentId || body.userDetails?.assignmentId

          if(assignmentId) {
            if(Array.isArray(assignmentId)) {
                query = {_id:{ $in:assignmentId }}
            } else {
                query = {_id:assignmentId}
            }
        }
        return await getMany(query,collection_name)

    }catch(error){
        console.log("....error in getAllLevelAssignmentIds model...",error?.message)
        logger.error("Error while getAllLevelAssignmentIds function in assignment model");
        throw error;
    }
}

export const getUserAssignment = async(body)=>{
    try{
        let query = {}
        const assignmentId = body.user?.assignmentId

          if(assignmentId) {
            if(Array.isArray(assignmentId)) {
                query = {_id:{ $in:assignmentId }}
            } else {
                query = {_id:assignmentId}
            }
        }
        return await getMany(query,collection_name)

    }catch(error){
        console.log("....error in getAllLevelAssignmentIds model...",error?.message)
        logger.error("Error while getAllLevelAssignmentIds function in assignment model");
        throw error;
    }
}

export const checkMultipleAssignment=async(body)=>{
    try{
        let query = {
            $or : body.combinations
        }
        return await getMany(query,collection_name)

    }catch(error){
        console.log("....error in getAllLevelAssignmentIds model...",error?.message)
        logger.error("Error while getAllLevelAssignmentIds function in assignment model");
        throw error;
    }
}

export const addMultiple = async(body)=>{
    try{
        return await createMany(body.addAssignmentData.map(aad => ({...aad, isActive:true})),collection_name)

    }catch(error){
        console.log("....error in adding multiple AssignmentIds model...",error?.message)
        logger.error("Error while adding multiple AssignmentIds function in assignment model");
        throw error;
    }
}

export const removeMultiple = async(body)=>{
    try{
        let query = {_id : {$in : body.assignmentData.map(ad => ad._id)}}

        return await removeMany(query,collection_name)

    }catch(error){
        console.log("....error in remove multiple AssignmentIds model...",error?.message)
        logger.error("Error while remove multiple AssignmentIds function in assignment model");
        throw error;
    }
}

export const getUserDetailsbyAssignmentId = async (assignmentId) => {
    try {
        const query = [
            {
                $match: {
                    _id: new ObjectId(assignmentId)
                }
            },
            {
                $lookup: {
                    from: "organization",
                    localField: "orgId",
                    foreignField: "_id",
                    as: "Org"
                }
            },
            {
                $addFields: {
                    OrgName: { $arrayElemAt: ["$Org.name", 0] }
                }
            },
            {
                $lookup: {
                    from: "organization",
                    localField: "subOrgId",
                    foreignField: "_id",
                    as: "subOrg"
                }
            },
            {
                $addFields: {
                    subOrgName: { $arrayElemAt: ["$subOrg.name", 0] }
                }
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchId",
                    foreignField: "_id",
                    as: "branches"
                }
            },
            {
                $addFields: {
                    branchName: { $arrayElemAt: ["$branches.name", 0] }
                }
            },

            {
                $project: {
                    branches: 0,
                    subOrg: 0,
                    Org: 0
                }
            }
        ]
        return aggregate(query, collection_name)
    }
    catch (error) {
        logger.error("Error while get UserDetailsbyAssignmentIds function in assignment model");
        throw error;
    }
}



