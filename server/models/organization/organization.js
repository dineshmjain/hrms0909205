import { ObjectId } from 'mongodb';
import { aggregate, aggregationWithPegination, bulkWriteOperations, create, getMany, getOne, updateOne } from '../../helper/mongo.js';
import { convertToYYYYMMDD, getCurrentDateTime } from '../../helper/formatting.js';
import mongoDbService from '../../helper/mongoDbService.js';
import { logger } from '../../helper/logger.js';
import { QueryBuilder } from '../../helper/filter.js';
import { allowed_org_params } from '../../helper/constants.js';
const collection_name = "organization"

export const addOrganization = async (body) => {
    try {
        const {orgDetails, orgExist , token,user,userId,owner,address,FY,geoJson,geoLocation,...newOrgDetails} = body
        let query = {
            // ...newOrgDetails,
            ...(body.name && {name:body.name}),
            ...(body.groupName && {name:body.groupName}),
            orgTypeId: new ObjectId(body.orgTypeId),
            ...(body.parentOrg && {parentOrg:new ObjectId(body.parentOrg)}),
            ...(body.structure && {structure:body.structure}),
            ...(body.addSubOrg !== undefined && {addSubOrg:body.addSubOrg}),
            ...(body.addBranch !== undefined && {addBranch:body.addBranch}),
            ...(body.panNo&&{panNo:body.panNo}),
            ...(body.gstNo&&{gstNo:body.gstNo}),
            // ...(body.address && {address:body.address}),
            ...(!body.orgExist&&body.FY&&{FY:body.FY}),
            isActive:true,
            createdDate: new Date(),
            createdBy: new ObjectId(userId)
        };
        // if(body.address&&body.structure===undefined){
        //     query['address']=body.address
        // }
        // console.log("..query..",query)
        // console.log("..newOrgDetails..",newOrgDetails)
        return await create(query, "organization");
    } catch (error) {
        logger.error("Error while addOrganization in org module")
        throw error;
    }
}

export const isOrgExist = async(body) => {
    try {
        let user = body.user
        let query = {
            _id : user?.orgId,
            isActive:true
        }
        if(body.isActive!=undefined){
            delete query['isActive']
        }
        if(body.multiple){
            query={
                $or:body.clientOrgData // this one used for client import excel api for checking existing data
            }
            return await getMany(query, collection_name)
        }
        return await getOne(query, collection_name)
    }
    catch (error) {
        return {status : false, message : "Failed to get organization details"}
    }
};
export const isSubOrgExist = async(body) => {
    try {
        let user = body.user
        let query = {
            parentOrg:user.orgId,
            isActive:true
        }
        if(body.isActive!=undefined){
            delete query['isActive']
        }
        // this below one comes from  employeeimportexcel whether suborg exists or not
        if(body.subOrgName){
            query['name']=body.subOrgName
        }
        return await getMany(query, collection_name)
    }
    catch (error) {
        return {status : false, message : "Failed to get organization details"}
    }
};

export const isMultipleSubOrgValid = async(body) => {
    try {
        let user = body.user
        let query = {
            parentOrg:user.orgId, _id : {$in : body.subOrg.map(so => new ObjectId(so))}
        }
        return await getMany(query, collection_name)
    }
    catch (error) {
        return {status : false, message : "Failed to get organization details"}
    }
};


export const get = async (body) => {
    try {
        let query= {_id:new ObjectId(body.user.orgId)}
        // if(body.subOrgId && !body.addUser){
        //     query['_id']=new ObjectId(body.subOrgId)
        //     query["parentOrg"]=new ObjectId(body.user.orgId)
        //     // query['parentOrg']={ $exists:true}
        // }
        //return await mongoDbService.getOne(collection_name,query)
         return await getOne(query,collection_name)
    } catch (error) {
        throw error;
        return {status : false, message : "Failed to get organization details",error}
    }
}

export const listOrg = async (body) => {
    try{
        let assignmentIds = []
        let query = new QueryBuilder(body.query)
            .addId()
            .addName()
            // .addCreatedAt()
            .addParentOrgId()
        

            // .addParentOrgId();
        // const params={_id:body.user.orgId}
        let search = null;
        if(body.search && body.search !== ""){
          
            search={
                $match: {
                  $or: [
                    { 'name': { $regex: body.search, $options: 'i' } },
                    { 'type': { $regex: body.search, $options: 'i' } },
                    { 'createdByName.firstName': { $regex: body.search, $options: 'i' } },
                    { 'createdByName.lastName': { $regex: body.search, $options: 'i' } }
                  ]
                }
              }
        }  
        const params={parentOrg:new ObjectId(body.user.orgId)}
        if(body.query.parentOrg){
            params["parentOrg"]=new ObjectId(body.user.orgId)
            // delete params["_id"]
        }
        // this below for get client sub org
        if(body.query.orgId){
            params["parentOrg"]=new ObjectId(body.query.orgId)
            // delete params["_id"]
        }

        if(body.query.parentOrgId){
            params["parentOrg"]=new ObjectId(body.query.parentOrgId)
            // delete params["_id"]
        }
        if(body.query.assignment){
             assignmentIds =  body.query.assignment.map(data => data.subOrgId);
        }

        const category = query.category
        
        let queryString = query.getNameAgregationPipeLIne();
        // queryString.unshift({
        //     $match:{
        //         $or:[
        //             // {_id:body.user.orgId},
        //             // {parentOrg:body.user.orgId}
        //             // {parentOrg:parentOrg}
        //             {...params}
        //         ]
        //     }
        // })
        queryString.unshift(
            {
              $match: {
                $or: [
                   //{ parentOrg: new ObjectId(body.user.orgId) }
                    {...params}
                ]
              }
            },
            {
              $lookup: {
                from: "typesOfOrganization",
                localField: "orgTypeId",
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
            {
              $addFields: {
                type: "$orgType.name",
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
            }
          );
        console.log(JSON.stringify(queryString));

          queryString.push(
            {
                $addFields: {
                    createdByName:"$createdByName",
                    assigned: { $cond: { if: { $in: ["$_id", assignmentIds] }, then: true, else: false } }
                }
            },
            ...(search?[search]:[]),
            {
                $match: (category === 'assigned') ? { assigned: true } :
                        (category === 'unassigned') ? { assigned: false } : {}
            })

        let projection = {
            // user: 0,

        }

        allowed_org_params.forEach(param => {
            if (!body.params || body.params.includes(param)) {
                projection[param] = 1;
            }
        });


        queryString.push(
            {
                $project: projection
            }
        )
        let paginationQuery = {
            page:body.page,
            limit:body.limit,
            sortOrder:-1,
            sortBy: "_id"
        }
        console.log(JSON.stringify(queryString))
        return aggregationWithPegination(queryString,paginationQuery,collection_name);
    }catch(error){
        logger.error("Error while listOrg in org module");
        throw error;
    }
};

export const updateOrg = async (body) => {
    try{
        // const {user,token,orgIdToUpdate,userId,_id,...updateData} = body;
        // updateData.updatedAt = new Date(Date.now())
        const query={_id:new ObjectId(body._id)}
        // const keys=["orgTypeId","addSubOrg","addBranch","panNo","gstNo","geoLocation","geoJson","FY","isActive","name"]
        const keys=["orgTypeId","panNo","gstNo","isActive","name"]
        const updateData=keys.reduce((acc,key)=>{
            if(body[key]!==undefined && body[key]!==null){
                if (key === "orgTypeId") {
                    acc[key] = new ObjectId(body[key]);
                } else {
                    acc[key] = body[key];
                }
            }
            return acc
        },{})
        
        const update = {$set: {...updateData,modifiedBy:body.user._id,modifiedDate:new Date()}};
        return await updateOne(query,update,collection_name)
    }catch(error){
        logger.error("Error while updateOrg in org module");
        throw error;
    }
}

// create suborganization
export const addSubOrg = async (body) => {
    try {
        let query = {
            name:body.orgName,
            // type:body.type,
            orgTypeId: new ObjectId(body.orgTypeId),
            parentOrg:new ObjectId(body.orgId),
            isActive:true,
            createdDate: new Date(),
            createdBy: new ObjectId(body.userId)
        };
        return await create(query, "organization");
    } catch (error) {
        logger.error("Error while addSubOrg in org module")
        throw error;
    }
}

export const findOrgData = async (body) => {
    try {
        let query =[
            {
                $match:{
                    _id:{$in:[body.user.orgId,...body.subOrgIds.map(org=>new ObjectId(org))]}
                },
            },
            {
              $lookup: {
                from: "branches",
                let: {
                  orgId: "$_id"
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          {
                            $and: [
                              { $eq: ["$orgId", "$$orgId"] },
                              {
                                $eq: [
                                  "$subOrgId",
                                  null
                                ]
                              }
                            ]
                          },
                          { $eq: ["$subOrgId", "$$orgId"] }
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
        return aggregate(query, collection_name)
    } catch (error) {
        logger.error("Error while findOrgData in org module")
        throw error;
    }
}