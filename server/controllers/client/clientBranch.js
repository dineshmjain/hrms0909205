import * as clientBranchModel from '../../models/client/clientBranch.js'
import * as apiResponse from '../../helper/apiResponse.js'
import { ObjectId } from 'mongodb';
import {logger} from "../../helper/logger.js";


//branch List
export const getBranchList = async (request, response, next) => {
    try 
    {
        request.body.query = request.body;
        request.body.query.orgId = new ObjectId(request.body.clientMappedId)
        const clientBranch = await clientBranchModel.getClientBranch(request.body)
        if (!clientBranch.status)  return apiResponse.ErrorResponse(response,"Something went worng",res.error);
        request.body.clientBranchData=clientBranch
        return next()
    } 
    catch (error) 
    {
        logger.error("Error while getBranchList in client branch controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)  
    }
}

//get one branch
export const getBranch = async (request,response,next) => {
    try
    {
        if(!request.body.id) return apiResponse.validationError(response, 'branchId is required.') 
        request.body.query = request.body;

        const clientBranch = await clientBranchModel.getClientBranch(request.body)
        if (!clientBranch.status)  return apiResponse.ErrorResponse(response,"Something went worng",res.error);
        if (clientBranch.data.length <=0 )  return apiResponse.notFoundResponse(response,"No data found");
        request.body.clientBranchData=clientBranch
        return next()
    }
    catch (error) 
    {
        logger.error("Error while getBranch in client branch controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)  
    }
};

export const isMultipleBranchValid = async (request,response,next) => {
    try
    {
        // if(!request.body.clientBranchIds || !request.body.clientBranchIds?.length) return next()
        request.body.query = request.body;

        const clientBranch = await clientBranchModel.isMultipleBranchValid(request.body)
        if (!clientBranch.status) throw {}
        
        let filterBranch = clientBranch.data.filter(value => request.body.clientBranchIds?.includes(value._id.toString()));
        if(request.body.clientBranchIds?.length > 0 && filterBranch.length != request.body.clientBranchIds?.length) return apiResponse.somethingResponse(response, "Invalid Branches!")
        
        clientBranch.data.forEach(element => {
            request.body.clientIds[element.clientId].push(element._id.toString())
        });
        request.body.clientBranchData=clientBranch.data
        return next()
    }
    catch (error) 
    {
        logger.error("Error while getBranch in client branch controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)  
    }
};


export const isClientBranch=(request ,response,next)=>{
    try{
        if(!request.body.clientMappedId) return apiResponse.validationError(response, 'clientMappedId is required.')
        if (!request.body.id) return apiResponse.validationError(response, 'branchId is required.')
        clientBranchModel.isClientBranch(request.body).then(res => {
            if(!res.status) return apiResponse.notFoundResponse(response, "Invalid Branch")
            // request.body.clientBranchData = res.data[0];
            return next()
        }).catch(error => {
            logger.error("Error while isClientBranch in client branch controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        logger.error("Error while isClientBranch in client branch controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)  
    }
}


export const activateOrDeactivateClientBranch = (request, response, next) => {
    try {
        if (!request.body.id) return apiResponse.validationError(response, 'branchId is required.')
        clientBranchModel.activateOrDeactivateBranch(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "Something went wrong", res.error);
            request.body.clientBranchData = res.data;
            return next()
        }).catch(error => {
            logger.error("Error while activateOrDeactivateBranch in client branch controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        logger.error("Error while isClientBranch in client branch controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}
