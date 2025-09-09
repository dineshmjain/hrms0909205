import { logger } from "../../helper/logger.js";
import {ObjectId} from "mongodb";
import { create,getOne,aggregationWithPegination,findOneAndUpdate, getMany,createMany } from "../../helper/mongo.js";
import { updateDepartment } from "../../controllers/department/department.js";
import { userGetTypeProjection, adminRoleId, allowed_department_params } from '../../helper/constants.js';
import * as constants from '../../helper/constants.js';

const collection_name = "department";

export const createDepartment = async (body) => {
    try{
        //TODO: If globle is false then respective id is required.
        const orgId=body.user?.orgId
        let department = {
            name:body.name,
            orgId:body.orgDetails?._id || orgId,
            global: body?.globle ?? true,
            createdDate: new Date(),
            createdBy:new ObjectId(body.userId),
            isActive:true
        }

        return await create(department,collection_name);

    }catch(error){
        logger.error("Error while createDepartment in department module");
        throw error;
    }
};


export const getDepartment = async (body) => {
    try{
        const {query={}} = body;
        query.orgId = body.orgDetails._id;
        let params = Object.create(null);
        let assignmentIds = [];
        if(body.id){
            params["_id"] = query.id;
        }
        if(body.departmentId){
            params["_id"] = new ObjectId(body.departmentId);
        }
        if(body.name){
            params["name"] = new RegExp(`${query.name}`,"i");
        }
        if(query.orgId){
            params["orgId"] = new ObjectId(query.orgId)
        }
        if(body.global){
            params["global"] = query.global === "true" ? true : false;
        }
        if(body.createdAt){
            const start = new Date(query.createdAt);
            const end = new Date(start.getTime() + 24*60*60*1000)

            params["createdAt"] = {$gte:start,$lt:end}
        }
        if(body.isActive){
            params["isActive"] = query.isActive === "true" ? true : false
        }
        if(body.assignment?.status){
             if(body.assignment?.data.length>0){
                assignmentIds =  query.assignment.map(data => data.departmentId);
             }
             
        }
       const category = body?.category;
        
        
        const aggrigationPipeline = [
            {
                $match: params  
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
                $unwind: "$user"  
            },
            {
                $addFields: {
                    createdByName: "$user.name",
                    assigned: { $cond: { if: { $in: ["$_id", assignmentIds] }, then: true, else: false } },
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
            // {
            //     $match: (category === 'assigned') ? { assigned: true } :
            //             (category === 'unassigned') ? { assigned: false } : {}
            // },
            {
                $project: {
                    "user": 0
                }
            },


        ];

        let groupQuery = {
            $group: {
              _id: "$_id"
            }
        }
        // Add allowed parameters to the group query
        for (let param of allowed_department_params) {
            if (!body.params || body.params.includes(param)) {
              if (param !== "_id") {
                groupQuery.$group[param] = { $first: `$${param}` };
              }
            }
        }
          
        aggrigationPipeline.push(groupQuery)
        let paginationQuery = {
            page:body.page,
            limit:body.limit,
            sortOrder:-1,
             sortBy: "_id"
        }
        console.log(JSON.stringify(aggrigationPipeline))
        return await aggregationWithPegination(aggrigationPipeline,paginationQuery,collection_name);
    }catch(error){
        logger.error("Error while getDepartment in departmnet module");
        throw error;
    }
}


export const getOneDepartment = async (body) => {
    try{
        // const {query} = body;
        // query["orgId"] = body.orgDetails._id;
        let params = Object.create(null);
        // if(!body._id && !body.departmentId) throw new Error("Either _id or departmentId parameter must be provided")
        if(body._id) params["_id"] = body._id 
        if(body.departmentId) params["_id"]=new ObjectId(body.departmentId)
        if(body.name && (!body.addUser && !body.updateUser)) params["name"] = body.name;

        // params["orgId"] = body.orgDetails._id ;
        const orgId=body.user?.orgId
        params["orgId"]=body?.orgDetails?._id || orgId;
        return await getOne(params,collection_name);  
    }catch(error){
        logger.error("Error while getOneDepartment in department module");
        throw error;
    }
};

export const updateDepartmnet = async (body) => {
    try{
        const {departmentId,user,userId,token,orgDetails,...updateData} = body;
        updateData.modifiedDate = new Date();
        const update = {$set: {...updateData}};
        const query = {
            _id:new ObjectId(departmentId),
            orgId:orgDetails._id
        };
        return await findOneAndUpdate(query,update,collection_name);
    }catch(error){
        logger.error("Error while updateDepartmnet in departmnet module")
        throw error;
    }   
};

export const getDepartmentByOrgId = async (body) => {
    try{
        const query = {
            orgId:body.orgId
        };
        return await getMany(query,collection_name);
    }catch(error){
        logger.error("Error while updateDepartmnet in departmnet module")
        throw error;
    }   
};

export const isMultipleDepartmentValid = async (body) => {
    try{
        const query = {
            // orgId: body.user.orgId
            _id: {$in : body.department.map(d => new ObjectId(d))}
        };
        return await getMany(query,collection_name);
    }catch(error){
        logger.error("Error while getMultipleDepartmnet in departmnet module")
        throw error;
    }   
};


// create 10 default departments
export const createDefaultDepartments = async (body) => {
    try{
        //TODO: If globle is false then respective id is required.
        const orgId=body.user?.orgId
        
        const departments = constants.defaultDepartments.map(name => ({
            name,
            orgId,
            global: false,
            isActive: true,
            createdDate: new Date(),
            createdBy:new ObjectId(body.userId)
          }));

        return await createMany(departments,collection_name);

    }catch(error){
        logger.error("Error while createDefaultDepartments in department model");
        throw error;
    }
};
