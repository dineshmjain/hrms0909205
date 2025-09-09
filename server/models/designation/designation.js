import { logger } from "../../helper/logger.js";
import { ObjectId } from "mongodb";
import { create, getOne, aggregationWithPegination, getMany,findOneAndUpdate,createMany} from "../../helper/mongo.js";
import { QueryBuilder } from "../../helper/filter.js";
import { allowed_designation_params,defaultDesignations } from '../../helper/constants.js';
const collection_name = "designation";

export const createDesignation = async (body) => {
    try {
        //TODO: If globle is false then respective id is required.
        let designation = {
            name: body.name,
            orgId: body.orgDetails._id,
            global: body?.globle ?? true,
            createdDate: new Date(),
            createdBy: new ObjectId(body.userId),
            isActive: true
        }

        return await create(designation, collection_name);

    } catch (error) {
        logger.error("Error while createDesignation in designation module");
        throw error;
    }
};


export const getDesignation = async (body) => {
    try {

        const query = new QueryBuilder(body.query)
            .addId()
            .addName()
            .addIsActive()
            .addOrgId()
            .addCreatedAt();

        const params = query.getQueryParams();
        let assignmentIds = [];
        if (body.query.assignment) {
            assignmentIds = body.query.assignment.map(data => data.designationId);
        }
        const category = body.query?.category;
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
            //         (category === 'unassigned') ? { assigned: false } : {}
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

        for (let param of allowed_designation_params) {
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

        return await aggregationWithPegination(aggrigationPipeline, paginationQuery, collection_name);

    } catch (error) {
        logger.error("Error while getDesignation in designation module");
        throw error;
    }
};


export const getOneDesignation = async (body) => {
    try {
        // const {query} = body;
        // query["orgId"] = body.orgDetails._id;
        let params = Object.create(null);
        // params["orgId"] = body.orgDetails._id;
        const orgId=body.user?.orgId
        params["orgId"]=body?.orgDetails?._id || orgId;
        if(body._id){
            params["_id"] = new ObjectId(body._id);
        }else if(body.designationId){
            params["_id"] = new ObjectId(body.designationId);
        }else if(body.assignment?.designationId){
            params["_id"] = new ObjectId(body.assignment?.designationId);
        }
        if (body.name && (!body.addUser && !body.updateUser)) {
            params["name"] = body.name;
        }
        if(body.authUser?.otpVerified && body.authUser?.role[0]?.toString() == body.adminRole?.toString()){
            delete params["_id"];
            params["roles"] = new ObjectId(body.adminRole);
        }

        console.log(JSON.stringify(params));
        let projection={
            _id:1,
            name:1,
            orgId:1,
            createdDate:1,
            createdBy:1,
            roles:1
        }
        return await getOne(params, collection_name,projection);
    } catch (error) {
        logger.error("Error while getOneDesignation in designation module");
        throw error;
    }
};

export const updateDesignation = async (body) => {
    try {
        const {designationId,user,userId,token,orgDetails,...updateData} = body;
        updateData.modifiedDate = new Date();
        const update = {$set: {...updateData}};
        const query = {
            _id:new ObjectId(designationId),
            orgId:orgDetails._id
        };
        return await findOneAndUpdate(query,update,collection_name);
    } catch (error) {
        logger.error("Error while updateDesignation in designation module")
        throw error;
    }
};

export const isMultipleDesignationValid = async (body) => {
    try {
        const query = {
            _id: { $in: body.designation.map(dep => new ObjectId(dep)) }
        };
        return await getMany(query, collection_name);
    } catch (error) {
        logger.error("Error while get Multiple Designation in designation module")
        throw error;
    }
};

// create 10 default designations
export const createDefaultDesignations= async (body) => {
    try{
        //TODO: If globle is false then respective id is required.
        const orgId=body.user?.orgId
        

        const designations = defaultDesignations.map(name => ({
            name,
            orgId,
            global: false,
            isActive: true,
            createdDate: new Date(),
            createdBy:new ObjectId(body.userId)
          }));

        return await createMany(designations,collection_name);

    }catch(error){
        logger.error("Error while createDefaultDesignations in designation model");
        throw error;
    }
};



export const getDesignationById = async (body) => {
    try {
        const query = {
            _id: { $in: body.designationIds.map(desg => new ObjectId(desg)) }
        };
        return await getMany(query, collection_name);
    } catch (error) {
        logger.error("Error while get Designation by Id in designation module")
        throw error;
    }
};