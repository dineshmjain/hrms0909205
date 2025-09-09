import * as globalModel from '../../models/globle/globle.js';
import * as apiResponse from '../../helper/apiResponse.js';
import { ObjectId } from 'mongodb';



export const getSavedLanguage = async (request,response,next) => {
    try{

        globalModel.getSavedLanguage(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.language = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while geting saved language  in controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while geting saved language  in controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};


export const createGlobalLeave = async (request,response,next) => {
    try{
        globalModel.createGlobalLeave(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.leave = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while creating leave",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while creating leave ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const isLeaveExist = async (request,response,next) => {
    try{
        globalModel.isLeaveExist(request.body).then(res => {
            if(res.data.length !== 0) return apiResponse.validationError(response,"Leave already exists");
            return next();
        }).catch(error => {
            request.logger.error("Error while getting leave",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while getting leave ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const listOrgType = async (request,response, next) => {
    try{
        globalModel.listOrgType(request.body).then(res => {
            request.body.orgTypes = res.data;
            return next()
        }).catch(error => {
            request.logger.error("Error while listOrgType",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while listOrgType ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

// checking address type exist
export const isAddressTypeExist= async (request,response,next) => {
    try{
        globalModel.isAddressTypeExist(request.body).then(res => {
            if(res.data.length !== 0) return apiResponse.validationError(response,"address type already exists");
            return next();
        }).catch(error => {
            request.logger.error("Error while isAddressTypeExist",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while isAddressTypeExist",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};


// add adress type
export const addAddressType= (request,response,next) => {
    try{
        globalModel.createAddressType(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.leave = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while creating address type",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while creating address type ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};


// get address types
export const getAddressType= async (request,response,next) => {
    try{
        globalModel.listAddressType(request.body).then(res => {
            if(res.data.length>=1){
                request.body.addressType=res.data
                return next()
            }
            return apiResponse.notFoundResponse(response,'No Data found')
            
        }).catch(error => {
            request.logger.error("Error while getAddressType in controller",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while getAddressType in controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}