import * as apiResponse from '../../helper/apiResponse.js';
import * as leavePolicy from '../../models/leavePolicy/leavePolicy.js';
import { ObjectId } from 'mongodb';

export const createLeavePolicy = async (request, response, next) => {
    try {
        if(request.body.leaveExists) return apiResponse.duplicateResponse(response, 'leave policy already esists with this name!')
        await leavePolicy.createLeavePolicy(request.body).then(res => {
            request.body.leavePolicyDetails = res.data
            return next()
        }).catch(error => {
            request.logger.error("Error while createLeavePolicy in leavePolicy controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while createLeavePolicy in leavePolicy controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const isPolicyExists = async (request, response, next) => {
    try {
        leavePolicy.isPolicyExists(request.body).then(res => {
            if(!res.status)return apiResponse.notFoundResponse(response,'No Data Found')
            request.body.leaveExists = res.data
            request.body.policyData = [res.data]
            request.body.policydata = [res.data]
            return next()
        }).catch(error => {
            request.logger.error("Error while isPolicyExists in leavePolicy controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while isPolicyExists in leavePolicy controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const check = async (request, response, next) => {
    try {
        await leavePolicy.isPolicyExists(request.body).then(res => {
            request.body.leaveExists = res.data
            return next()
        }).catch(error => {
            request.logger.error("Error while isPolicyExists in leavePolicy controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while isPolicyExists in leavePolicy controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}




// export const getleavePolicy = async (request, response, next) => {
//     try {
//         if(!request.body.leaveExists) return apiResponse.notFoundResponse(response, 'No leave policy found with this name!')
//         await leavePolicy.getleavePolicy(request.body).then(res => {
//             request.body.leavePolicyDetails = res.data
//             return next()
//         }).catch(error => {
//             request.logger.error("Error while isPolicyExists in leavePolicy controller ", { stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         })
//     } catch (error) {
//         request.logger.error("Error while isPolicyExists in leavePolicy controller ", { stack: error.stack });
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }


export const createPolicy=async(request,response,next)=>{
    try{
        leavePolicy.createPolicyLeave(request.body).then(res=>{
            if(res.status){
                return apiResponse.successResponse(response,'Policy created')
            }
            return apiResponse.validationError(response,'failed to create leave policy')
        }).catch(error=>{
            request.logger.error("Error while createPolicy in leavePolicy controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error('error while createPolicy in leavePolicy controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getPolicy=async(request,response,next)=>{
    try{
        leavePolicy.getleavePolicy(request.body).then(res=>{
            if(res.status && res.data.length>=1){
                request.body.policyData=res
                request.body.policydata=res.data
                // console.log('res',JSON.stringify(res))
                return next()

            }

            if(request.body.wizardGetAllData) {
                if(res.status && res.data && res.data.length > 0) request.body.allDataRes['salaryComponents'] = res.data
                return next()
            }
            // return apiResponse.notFoundResponse(response,'No leave policy found')
            return next()
        }).catch(error=>{
            request.logger.error("Error while getPolicy in leavePolicy controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error('error while getPolicy in leavePolicy controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const updateLeavePolicy=(request,response,next)=>{
    try{
        leavePolicy.updatePolicy(request.body).then(res=>{
            if(res.status){
                return next()
            }
            return apiResponse.validationError(response,'failed to update leave policy')
        }).catch(error=>{
            request.logger.error("Error while updatePolicy in leavePolicy controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error('error while updatePolicy in leavePolicy controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}

//activate/deactivate policy
export const activeDeactivatePolicy=(request,response,next)=>{
    try{
        leavePolicy.activeDeactivatePolicy(request.body).then(res=>{
            if(res.status){
                return next()
            }
            return apiResponse.validationError(response,`failed to ${request.body.isActive?'Activated':'Deactivted'} leave policy`)
        }).catch(error=>{
            request.logger.error("Error while activeDeactivatePolicy in leavePolicy controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error('error while activeDeactivatePolicy in leavePolicy controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const isExistPolicyName=(request,response,next)=>{
    try{
        leavePolicy.getPolicy(request.body).then(res=>{
            if(res.data.length>=1){
                return apiResponse.validationError(response,'leave policy name alreday exists')
            }
            return next()
        }).catch(error=>{
            request.logger.error("error while isExistPolicyName in leavePolicy controller",{stack:error.stack})
            return apiResponse.somethingResponse(response,error.message)
        })

    }catch(error){
        request.logger.error("error while addPolcies in leavePolicy controller",{stack:error.stack})
        return apiResponse.somethingResponse(response,error.message)
    }
}


export const addPolicies=(request,response,next)=>{
    try{
        leavePolicy.addPolicy(request.body).then(res=>{
            if(!res.status){
                return apiResponse.validationError(response,'failed to add policy')
            }
            return next()
            
        }).catch(error=>{
            request.logger.error("error while addPolcies in leavePolicy controller",{stack:error.stack})
            return apiResponse.somethingResponse(response,error.message)
        })

    }catch(error){
        request.logger.error("error while addPolcies in leavePolicy controller",{stack:error.stack})
        return apiResponse.somethingResponse(response,error.message)
    }
}


export const getPolicies=(request,response,next)=>{
    try{
        leavePolicy.getPolicy(request.body).then(res=>{
            if(!res.status){
                return apiResponse.validationError(response,'failed to add policy')
            }
            request.body.policies=res.data
            return next()
        }).catch(error=>{
            request.logger.error("error while addPolcies in leavePolicy controller",{stack:error.stack})
            return apiResponse.somethingResponse(response,error.message)
        })

    }catch(error){
        request.logger.error("error while addPolcies in leavePolicy controller",{stack:error.stack})
        return apiResponse.somethingResponse(response,error.message)
    }
}


export const isPolicyLeaveMasterExists=(request,response,next)=>{
    try{
        leavePolicy.getleavePolicyMaster(request.body).then(res=>{
            if(res.data.length>=1){
                return apiResponse.validationError(response,'leave policy  alreday exists')
            }
            return next()
        }).catch(error=>{
            request.logger.error("error while isPolicyLeaveMasterExists in leavePolicy controller",{stack:error.stack})
            return apiResponse.somethingResponse(response,error.message)
        })

    }catch(error){
        request.logger.error("error while addPolcies in leavePolicy controller",{stack:error.stack})
        return apiResponse.somethingResponse(response,error.message)
    }
}

