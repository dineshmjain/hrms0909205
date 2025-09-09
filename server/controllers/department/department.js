
import * as departmentModel from '../../models/department/department.js';
import * as apiResponse from '../../helper/apiResponse.js'
import {ObjectId} from "mongodb";
import { response } from 'express';


export const createDepartment = async (request,response,next) => {
    try{
        if(request.body.department) return apiResponse.validationError(response,"Already exist with this name")
        if(!request.body.name) return apiResponse.validationError(response,"Name is required");
        departmentModel.createDepartment(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.departmnet = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while createDepartment in departmnet controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while createDepartment in departmnet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const getDepartment = async (request,response,next) => {
    try{
        request.body.query = request.query || {};
        if(request.body.assignment?.status) request.body.query.assignment = request.body.assignment.data 
        const { query={}, body } = request;
        // body.query = query;
        departmentModel.getDepartment({...body,...query}).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            if(!res.data.length) return apiResponse.notFoundResponse(response,"Department not found");
            request.logger.debug(JSON.stringify(res));
            request.body.department = res;
            return next()
        }).catch(error => {
            request.logger.error("Error while getDepartment in departmnet controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)          
        })
    }catch(error){
        request.logger.error("Error while getDepartment in departmnet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)    
    }
};

export const getOneDepartment = async (request,response,next) => {
    try{
        if(!request.body.departmentId) return next();
        departmentModel.getOneDepartment(request.body).then(res => {
            if(!res.status) return next();
 
            request.logger.debug(JSON.stringify(res));
            request.body.department = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while getOneDepartmnet in departmnet controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        request.logger.error("Error while getOneDepartmnet in departmnet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)    
    }
};

export const updateDepartment = async (request,response,next) => {
    try{
        if(!request.body.departmentId) return apiResponse.validationError(response,"departmnetId is required");
        departmentModel.updateDepartmnet(request.body).then(res => {
            if(!res.status) return apiResponse.notFoundResponse(response,"Unable to find department");

            request.body.department = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while updateDepartment in departmnet controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        request.logger.error("Error while getOneDepartmnet in departmnet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)   
    }
}

export const assignmentValidation = async (request,responce,next) => {
    try{
        if(!request.body.branchId) return apiResponse.validationError(responce,"branchId is required");

        if(!request.body.departmentId) return apiResponse.validationError(responce,"departmentId is required");

        if(!ObjectId.isValid(request.body?.branchId) || !ObjectId.isValid(request.body?.departmentId)){
            return apiResponse.validationError(responce,"Invalid mongoId");
        };

        return next();
    }catch(error){
        request.logger.error("Error while assignmentValidation in departmnet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)   
    }
};


export const getDepartmentByOrgId = async (request,response,next) => {
    try{
        departmentModel.getDepartmentByOrgId(request.body).then(res => {
            if(!res.status) return apiResponse.notFoundResponse(response,"Failed to get ");

            request.body.department = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while updateDepartment in departmnet controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        request.logger.error("Error while get org department in departmnet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)   
    }
}

export const checkPending = async(request, response, next) => {
    try {
        if(request.body.department && request.body.department.totalRecord>0) request.body.pending['department']=true
        request.body.sendLoginResponse = true
        return next()
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const isMultipleDepartmentValid = async (request,response,next) => {
    try{
       if(!request.body.department || !request.body.department?.length) return next()

       departmentModel.isMultipleDepartmentValid(request.body).then(res => {

        if (!res.status || res.data.length != request.body.department.length) return apiResponse.notFoundResponse(response, "Invalid Department!");

        request.body.departmentData = res.data

        return next()
       }).catch(error => {
            request.logger.error("Error while get Multiple Department in departmeet controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })


    }
    catch(error){
        request.logger.error("Error while get Multiple Department in departmeet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)   
    }
}


// create 10 default departments
export const addDefaultDepartments=async(request,response,next)=>{
    try{
        if(request.body.orgExist) return next();
        departmentModel.createDefaultDepartments(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            return next();
        }).catch(error => {
            request.logger.error("Error while addDefaultDepartments in departmnet controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while addDefaultDepartments in departmnet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}