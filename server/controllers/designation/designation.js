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