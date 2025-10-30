import { logger } from "../../helper/logger.js";
import { ObjectId } from "mongodb";
import { create, getOne, aggregationWithPegination, getMany,findOneAndUpdate,createMany,aggregate} from "../../helper/mongo.js";
import { QueryBuilder } from "../../helper/filter.js";
import { allowed_designation_params,defaultDesignations, userRoleId } from '../../helper/constants.js';
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
            roleId:1,
            roles:1,
            disabledModules:1
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
        // const orgId=body.user?.orgId
        const orgId= body.defaultBranchOrgId?new ObjectId(body.defaultBranchOrgId):new ObjectId(body.user.orgId)
        const serviceDesigations =["Supervisor","Security Gaurd","Cleaning Staff"]

        const designations = Object.keys(defaultDesignations).map(name => ({
            name,
            orgId,
            global: false,
            roleId : new ObjectId(userRoleId), 
            isActive: true,
            isService:serviceDesigations?.includes(name),
            createdDate: new Date(),
            createdBy:new ObjectId(body.userId),
            disabledModules: defaultDesignations[name],
            isService:serviceDesigations?.includes(name)
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

export const getDesignationByName = async (name, orgId = null) => {
    try {
        const query = { name: name.trim() };
        if (orgId) query.orgId = new ObjectId(orgId);
        // console.log(orgId);s

        const projection = { _id: 1, name: 1 };
        return await getOne(query, collection_name, projection);
    } catch (error) {
        logger.error("Error while getDesignationByName in designation module", { stack: error.stack });
        throw error;
    }
};



//update designation as service
export const updateDesignationAsService= async (body) => {
    try{
         const {designationId,user,userId,token,orgDetails,isService} = body;
         const updateData={}
        updateData.modifiedDate = new Date();
        updateData.modifiedBy=new ObjectId(user?._id)
        updateData.isService=isService
        const update = {$set: {...updateData}};
        const query = {
            _id:new ObjectId(designationId),
            orgId:new ObjectId(user?.orgId),
            
        };
        return await findOneAndUpdate(query,update,collection_name);
    } catch (error) {
        logger.error("Error while updateDesignation in designation module")
        throw error;
    }
};


export const getDesignationAsService = async (body) => {
    try {
        const { designationId, user, userId, token, orgDetails, isService } = body;
        const updateData = {}
        updateData.modifiedDate = new Date();
        updateData.modifiedBy = new ObjectId(user?._id)
        updateData.isService = isService
        const update = { $set: { ...updateData } };
        let params ={}
        if(body?.type){
            params={}
        }
        if(body?.type=="active")
        {
            params.isService=true
        }
         if(body?.type=="inactive")
        {
            params.isService=false
        }
        const query = [
            {
                $match: {
                    orgId: new ObjectId(user?.orgId),
                    // isService: true,
                    isActive: true,
                    ...params
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                isService: { $ifNull: ["$isService", false] }
                }
            }
        ];

        return await aggregate(query, collection_name);
    } catch (error) {
        logger.error("Error while getting  designation module")
        throw error;
    }
};


export const updateDisabledModules = async (body) => {
    try {
      const { designationId, disabledModules, designation } = body;
  
      if (!designationId)throw new Error('designationId is required');
  
      const existingModules = designation?.disabledModules || [];
  
      //  Merge logic — avoid duplicates & merge permissions
      const mergedMap = new Map();
  
      // Add existing first
      for (const mod of existingModules) {
        mergedMap.set(mod.moduleId.toString(), new Set(mod.permissions));
      }
  
      // Merge incoming body modules
      for (const mod of disabledModules) {
        const id = mod.moduleId.toString();
        if (!mergedMap.has(id)) mergedMap.set(id, new Set());
        for (const p of mod.permissions) mergedMap.get(id).add(p);
      }
  
      //  Convert back to array format
      const mergedDisabledModules = Array.from(mergedMap.entries()).map(
        ([moduleId, perms]) => ({
          moduleId: new ObjectId(moduleId),
          permissions: Array.from(perms),
        })
      );
  
      //  Update in DB
      const updateBody = {
        $set: {
          disabledModules: mergedDisabledModules,
          modifiedDate: new Date(),
          modifiedBy: body.authUser?._id || body.user?._id,
        },
      };
  
      const query = {
        _id: new ObjectId(designationId),
        orgId: new ObjectId(body.user.orgId),
        isActive: true,
      };
  
       return  await findOneAndUpdate(
        query,
        updateBody,
        "designation"
      );
  
      
  
      // Pass merged result forward (optional)
    //   request.body.disabledModules = mergedDisabledModules;
    //   return next();
  
    } catch (error) {
      logger.error("Error while updateDisabledModules", { stack: error.stack });
      throw error
    }
  };
  

export const getDesignationModules= async (body) => {
    try {
  
        const designationMatch = {
            _id:new ObjectId(body.designationId),
            orgId:new ObjectId(body.user.orgId),
            isActive:true
        };
  
      const query = [
        {
          // $match: {
          //   _id: body?.authUser?._id || new ObjectId(body.userId),
          // },
          $match: designationMatch
        },
        {
          $lookup: {
            from: "roles",
            localField: "roles",
            foreignField: "_id",
            as: "roles",
          },
        },
        {
          $unwind: "$roles"
        },
        {
          $lookup: {
            from: "modules",
            pipeline:[
              {
                $match: {$or:[{isActive:1},{isActive:true}]}
              }
            ],
            localField: "roles.modules.moduleId",
            foreignField: "_id",
            as: "roles.Modules",
          },
        },
        {
          $group: {
            _id: "$_id",
            // email: {
            //   $first: "$email",
            // },
            name: {
              $first: "$name",
            },
            roles: {
              $push: "$roles",
            },
          },
        },
      ]
      console.log(JSON.stringify(query))
      return await aggregate(query, "designation")
    } catch (error) {
      return { status: false, message: "Fail to get designation wise module Details" }
    }
  }


export const getDesignationAsServicePrice = async (body) => {
    try {
        const { designationId, user, userId, token, orgDetails, isService } = body;
        const updateData = {}
        updateData.modifiedDate = new Date();
        updateData.modifiedBy = new ObjectId(user?._id)
        updateData.isService = isService
        const update = { $set: { ...updateData } };
        let params = {}
        if (body?.type) {
            params = {}
        }
        if (body?.type == "active") {
            params.isService = true
        }
        if (body?.type == "inactive") {
            params.isService = false
        }
        const query = [
            {
                $match: {
                    orgId: new ObjectId(user?.orgId),
                    // isService: true,
                    isActive: true,
                    ...params
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    isService: { $ifNull: ["$isService", false] }
                }
            },
            {
                $lookup: {
                    from: "baseQuotationPrice",
                    let: { designationId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$designationId", "$$designationId"] },
                                        { $eq: ["$isActive", true] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "dp"
                }
            },
            {
                $match: {
                    "dp.0": { $exists: true } // only keep if active price exists
                }
            },
            {
                $project: {
                    dp: 0 // ✅ remove lookup array from output
                }
            }
        ];

        return await aggregate(query, collection_name);
    } catch (error) {
        logger.error("Error while getting  designation module")
        throw error;
    }
};

