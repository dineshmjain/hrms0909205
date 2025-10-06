import * as shiftModel from '../../models/shift/shift.js';
import * as apiResponse from '../../helper/apiResponse.js';
import { Controller } from '../../helper/controllerService.js';
import { ObjectId } from 'mongodb';

export const getShiftList = async (request,response,next) => {
    try
    {
        shiftModel.getShiftList(request.body).then(res => {

            if(request.body.wizardGetAllData) {
                if(res.status && res.data && res.data.length > 0) request.body.allDataRes['shift'] = res.data
                return next()
            }
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            // if(!res.data.length) return apiResponse.notFoundResponse(response,"Shift not found");
            request.body.shiftList = res.data;
            return next()
        }).catch(error => {
            request.logger.error("Error while getShiftList in shift controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)   
        })

    }
    catch(error){
        request.logger.error("Error while getShiftList in shift controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const createShift = async (request,response,next) => {
    try{
        if(request.body.shift) return apiResponse.validationError(response,"Already exist with this name");
        // const newShift = new Shift();
        // shiftModel.createShift(request.body).then(res => {
        //     if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
        //     request.body.shift = res.data;
        //     return next();

        shiftModel.createShift(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.shift = res.data;
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



export const getOneShift = async (request,response,next) => {
    try{
        // shiftModel.getOneShift(request.body).then(res => {
        //     if(!res.status) return next();
        //     request.body.shift = res.data;
        //     return next();
        
        shiftModel.getOneShift(request.body).then(res => {
            if(!res.status) return next()

            request.body.shift = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while getOneShift in shift controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while getOneShift in shift controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const getAllShifts = async (request,response,next) => {
    try{
        
        shiftModel.getAllShifts(request.body).then(res => {
            if(!res.status) return next()

            request.body.shiftObjData = res.data.reduce((acc,shift) => {
                acc[shift._id] = shift;
                return acc
            },{});
            return next();
        }).catch(error => {
            request.logger.error("Error while getOneShift in shift controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while getOneShift in shift controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const getShiftListWithPagination = async (request,response,next) => {
    try{
        // shiftModel.getOneShift(request.body).then(res => {
        //     if(!res.status) return next();
        //     request.body.shift = res.data;
        //     return next();
        
        shiftModel.listShift({...request.body, query : request.query}).then(res => {
            if(!res.status) throw {}
            res.data = res.data.map(u => {
                u.createdBy = {id : u.createdBy, firstName : request.body.allUsers[u.createdBy].name.firstName, lastName : request.body.allUsers[u.createdBy].name.lastName} 
                return u
            })
            request.body.shift = res;
            return next();
        }).catch(error => {
            request.logger.error("Error while getOneShift in shift controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while getOneShift in shift controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const updateShift = async (request,response,next) => {
    try{
        
        shiftModel.updateShift(request.body).then(res => {
            if(!res.status) throw {}

            return next();
        }).catch(error => {
            request.logger.error("Error while updating in shift ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while updating in shift ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const isShiftValid = async (request,response,next) => {
    try{
        
        shiftModel.isShiftValid(request.body).then(res => {
            if(!res.status) return apiResponse.notFoundResponse(response, "Invalid Shift!")

            return next();
        }).catch(error => {
            request.logger.error("Error while getOneShift in shift controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while getOneShift in shift controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};

// export class ShiftController extends Controller {
//     constructor(request,response,next) {
//         super(request,response,next,Shift);
//     }  

//     async isExist () {
//         try{
//         const result = await this.service.isExist(this.request.body);
//         if(result.success) return this.next();
//         return apiResponse.validationErrorWithData(this.response,result.message,result.shiftIds);
//         }catch(error){
//             this.request.logger.error("Error while checking shift exist or not in shift controller ",{ stack: error.stack });
//             return apiResponse.somethingResponse(this.response, error.message)
//         }
//     }

// }


// create default  shifts
export const AddDefaultShifts=async(request,response,next)=>{
    try{
        if(request.body.orgExist) return next();
        shiftModel.createDefaultShifts(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            return next();
        }).catch(error => {
            request.logger.error("Error while createDefaultShifts in shift controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while createDefaultShifts in shift controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const generateShiftData = async (request,response,next) => {
    try{
        if(request.body.extractedData?.currentShiftId ?.length > 0) {
            shiftModel.getShiftByIds({shiftIds: request.body.extractedData.currentShiftId , user:request.body.user}).then(res => {
                if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
                if(!request.body["extractedProcessedData"]) request.body.extractedProcessedData = {}
                request.body.extractedProcessedData["shiftId"] = {}
                res.data.forEach(shift => {
                    request.body.extractedProcessedData["shiftId"][shift._id] = {
                        _id:shift._id,
                        name:shift.name,
                        startTime:shift.startTime,
                        endTime:shift.endTime,
                        bgColor:shift.bgColor,
                        textColor:shift.textColor,
                    }
                }) 
                return next();
            }).catch(error => {
                request.logger.error("Error while getShiftByIds in shift controller ",{ stack: error.stack });
                return apiResponse.somethingResponse(response, error.message)
            })
        }else return next()
    }catch(error){
        request.logger.error("Error while generateShiftData in shift controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const activateDeactivateShift=(request,response,next)=>{
    try{
        shiftModel.activateDeactivateShift(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            return next();
        }).catch(error => {
            request.logger.error("Error while activateDeactivateShift in shift controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while activateDeactivateShift in shift controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}