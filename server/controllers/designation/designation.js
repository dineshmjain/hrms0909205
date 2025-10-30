import * as designationModel from '../../models/designation/designation.js';
import * as apiResponse from '../../helper/apiResponse.js';
import { ObjectId } from 'mongodb';



export const createDesignation = async (request,response,next) => {
    try{
        if(request.body.designation) return apiResponse.validationError(response,"Already exist with this name")
        if(!request.body.name) return apiResponse.validationError(response,"Name is required");
        designationModel.createDesignation(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.designation = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while createing Degignation in degignation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while createing Degignation in degignation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const getOneDesignation = async (request,response,next) => {
    try{
        designationModel.getOneDesignation(request.body).then(res => {
            if(!res.status) return next();

            request.logger.debug(JSON.stringify(res));
            request.body.designation = res.data;
            request.body.designationDisabledModules=res.data?.disabledModules ?? {}
            return next();
        }).catch(error => {
            request.logger.error("Error while get designation in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        request.logger.error("Error while get designation in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)    
    }
}


export const getDesignation = async (request,response,next) => {
    try{
        request.body.query = request.query || {};
        const { query={}, body } = request;
        if(request.body.assignment?.status) request.body.query.assignment = request.body.assignment.data 
        request.body.query.orgId = request.body.user.orgId

        designationModel.getDesignation({...body,...query}).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            if(!res.data.length) return apiResponse.notFoundResponse(response,"Designation not found");
            request.logger.debug(JSON.stringify(res));
            request.body.designation = res;
            return next()
        }).catch(error => {
            request.logger.error("Error while getDesignation in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)          
        })
    }catch(error){
        request.logger.error("Error while getDesignation in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)    
    }
};


export const updateDesignation = async (request,response,next) => {
    try{
        if(!request.body.designationId) return apiResponse.validationError(response,"designationId is required");
        designationModel.updateDesignation(request.body).then(res => {
            if(!res.status) return apiResponse.notFoundResponse(response,"Unable to find designation");

            request.body.designation = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while updateDesignation in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        request.logger.error("Error while updateDesignation in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)   
    }
}

export const isMultipleDesignationValid = async (request, response, next) => {
    try {
        if (!request.body.designation || !request.body.designation?.length) return next();
        designationModel.isMultipleDesignationValid(request.body).then(res => {
            if (!res.status || res.data.length != request.body.designation.length) return apiResponse.notFoundResponse(response, "Invalid Designation");

            request.body.designationData = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while get Multiple Designation in designation controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while get Multiple Designation in designation controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const assignmentValidation = async (request,responce,next) => {
    try{
       // if(!request.body.branchId) return apiResponse.validationError(responce,"branchId is required");

        if(!request.body.designationId) return apiResponse.validationError(responce,"designationId is required");

        if(request.body.departmentId && !ObjectId.isValid(request.body.departmentId)){
            return apiResponse.validationError(responce,"Invalid mongoId")
        }

        if((request.body.branchId && !ObjectId.isValid(request.body.branchId)) || !ObjectId.isValid(request.body.designationId)){
            return apiResponse.validationError(responce,"Invalid mongoId");
        };

        // const bodyKeys = ["departmentId","designationId","branchId"];
        // for(let key in request.body)

        return next();
    }catch(error){
        request.logger.error("Error while assignmentValidation in departmnet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)   
    }
}


// class Designation {


//     async create(request,response,next) {
//         try{
//             if(request.body.designation) return apiResponse.validationError(response,"Already exist with this name")
//             if(!request.body.name) return apiResponse.validationError(response,"Name is required");
//             designationModel.createDesignation(request.body).then(res => {
//                 if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
    
//                 request.body.designation = res.data;
//                 return next();
//             }).catch(error => {
//                 request.logger.error("Error while createing Degignation in degignation controller ",{ stack: error.stack });
//                 return apiResponse.somethingResponse(response, error.message)
//             })
//         }catch(error){
//             request.logger.error("Error while createing Degignation in degignation controller ",{ stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         }
//     };

//     async getOne(request,response,next) {
//         try{
//             designationModel.getOneDesignation(request.body).then(res => {
//                 if(!res.status) return next();
    
//                 request.logger.debug(JSON.stringify(res));
//                 request.body.designation = res.data;
//                 return next();
//             }).catch(error => {
//                 request.logger.error("Error while get designation in designation controller ",{ stack: error.stack });
//                 return apiResponse.somethingResponse(response, error.message)  
//             })
//         }catch(error){
//             request.logger.error("Error while get designation in designation controller ",{ stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)    
//         }
//     }
// };


// export default Designation

// 10 default designations
export const addDefaultDesignations=async(request,response,next)=>{
    try{
        if(request.body.orgExist) return next();
        designationModel.createDefaultDesignations(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            return next();
        }).catch(error => {
            request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const findDesignations = async (request,response,next) => {
    try {
        if(request.body.extractedData?.designationId ?.length > 0) {
            designationModel.getDesignationById({designationIds: request.body.extractedData.designationId , user:request.body.user}).then(res => {
                if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
                if(!request.body["extractedProcessedData"]) request.body.extractedProcessedData = {}
                request.body.extractedProcessedData["designationId"] = {}
                res.data.forEach(desg => {
                    request.body.extractedProcessedData["designationId"][desg._id] = {
                        _id:desg._id,
                        name:desg.name,
                    }
                }) 
                return next();
            }).catch(error => {
                request.logger.error("Error while findDesignations in designation controller ",{ stack: error.stack });
                return apiResponse.somethingResponse(response, error.message)
            })
        }else return next()
    } catch (error) {
        request.logger.error("Error while findDesignations in designation controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const updateDesignationAsService=async(request,response,next)=>{
    try{
        if(request.body.orgExist) return next();
        designationModel.updateDesignationAsService(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            return next();
        }).catch(error => {
            request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getDesignationAsService=async(request,response,next)=>{
    try{
     
        designationModel.getDesignationAsService(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            request.body.designationList =res.data
            return next();
        }).catch(error => {
            request.logger.error("Error while getDesignationasService in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while getDesignationasService in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const updateDisabledModules = async (request,response,next) => {
    try{
        if(!request.body.designationId) return apiResponse.validationError(response,"designationId is required");
        designationModel.updateDisabledModules(request.body).then(res => {
            if(!res.status) return apiResponse.validationError(response,"Unable to update disabledModules");
            return next();
        }).catch(error => {
            request.logger.error("Error while updateDisabledModules in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        request.logger.error("Error while updateDisabledModules in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)   
    }
}


export const getDesignationModules = async (request, response, next) => {
    try {
        if(!request.body.designation?.roles)return apiResponse.validationError(response,'role is not mapped to this designation')
        designationModel.getDesignationModules(request.body).then(res => {
            if (res.status) {
                let result = res.data[0]

                // Create an object to store unique module names as keys
                const uniqueModules = {};
                // Iterate through roles and their modules
                result?.roles.forEach((role) => {
                    role?.Modules.forEach((module) => {

                        //Module needs to be active
                        if (module.isActive === 1 || module.isActive === true) {

                            const moduleName = module.name;
                            const permissions = role.modules.find(m => m.moduleId.toString() === module._id.toString())?.permissions

                            // Check if the module name is already in the uniqueModules object
                            if (uniqueModules[moduleName]) {
                                // Merge the permissions array for the duplicate module
                                uniqueModules[moduleName].permissions = [
                                    ...new Set([
                                        ...uniqueModules[moduleName].permissions,
                                        ...permissions,
                                    ]),
                                ];
                            } else {
                                // If it's a new module name, add it to uniqueModules
                                uniqueModules[moduleName] = {
                                    moduleId: module._id,
                                    name: moduleName,
                                    moduleKey: module.moduleKey,
                                    permissions,
                                };
                            }
                        }
                    });
                });

                // Extract the unique merged modules as an array
                request.body.assignedModules = Object.values(uniqueModules);
                return next()
            }

            else throw {}
        }).catch(error => {
            request.logger.error("Error while getUserModules in user controller.",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.toString())
        })
    }
    catch (error) {
        request.logger.error("Error while getUserModules in user controller.",{ stack: err.stack });
        return apiResponse.somethingResponse(response, error.toString())
    }
}


export const mergeBothEnableDisableModules = async (request, response, next) => {
    try {
        if(request.body.designation?.disabledModules.length<1)return next()
        const ALL_PERMS = ["c", "r", "u", "d"];
     
        const disabledModules = [
            ...(Array.isArray(request.body.designation?.disabledModules)
              ? request.body.designation.disabledModules
              : []),
        ];
        let dbModules = request.body.assignedModules
      
        const disabledMap = new Map();
        
        if (Array.isArray(disabledModules)) {
            for (const m of disabledModules) {
                const moduleId = typeof m === "string" ? String(m) : String(m.moduleId);
                const perms = m && m.permissions ? m.permissions : ["all"];
            
            if (!disabledMap.has(moduleId)) {
                disabledMap.set(moduleId, new Set(perms));
              } else {
                const existing = disabledMap.get(moduleId);
                for (const p of perms) existing.add(p); // ✅ merge permissions
                disabledMap.set(moduleId, existing);
              }
            }
        } else if (disabledModules && typeof disabledModules === "object") {
            for (const [k, v] of Object.entries(disabledModules)) {
            disabledMap.set(String(k), new Set(Array.isArray(v) ? v : ["all"]));
            }
        }
      
        const filteredModules = dbModules.map((m) => {
            const moduleId = String(m.moduleId);
            const rolePerms = new Set(m.permissions || []);
            const disabledPerms = disabledMap.get(moduleId) || new Set();
            const isAllDisabled = disabledPerms.has("all");
      
            const permissions = {};
            for (const p of ALL_PERMS) {
              // If disabled -> unchecked
              if (isAllDisabled || disabledPerms.has(p)) {
                // permissions[p] = "unchecked";
                permissions[p] = false;
              } else if (rolePerms.has(p)) {
                // permissions[p] = "checked";
                permissions[p] = true;
              } else {
                // permissions[p] = "unchecked";
                permissions[p] = false;
              }
            }
      
            return {
              moduleId: m.moduleId,
              name: m.name,
              moduleKey: m.moduleKey,
              permissions, // always the {c,r,u,d} status object
            };
          });
      
          request.body.assignedModules = filteredModules;
        // console.log("...filterdModules",JSON.stringify(filteredModules));
        return next()
    }
    catch (error) {
        request.logger.error("Error while checkDisabledModules in user controller.",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString())
    }
}



export const getDesignationAsServicePrice=async(request,response,next)=>{
    try{
     
        designationModel.getDesignationAsServicePrice(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            request.body.designationList =res.data
            return next();
        }).catch(error => {
            request.logger.error("Error while getDesignationasService in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while getDesignationasService in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}