import * as shiftGroup from '../../models/shiftGroup/shiftGroup.js';
import * as apiResponse from '../../helper/apiResponse.js';
import moment from 'moment';
import {shiftTypes} from '../../helper/constants.js';
import { request, response } from 'express';
import { ObjectId } from 'mongodb';
import { logger } from '../../helper/logger.js';
import { extractUniqueValues } from '../../helper/formatting.js';

export const buildShiftGroupObject = async(request, response, next) => {
  try {
    const res = await shiftGroup.buildShiftGroupObject(request.body);
    
    if (res.status) {
      request.body.shiftGroupObj = res.data;
      return next();
    } else {
      return apiResponse.validationError(response, res.message);
    }
  } catch (error) {
    request.logger.error("Error while creating shift group object in shiftGroup controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
}

export const getOverlappingShift = async(request, response, next) => {
  try {
    const res = await shiftGroup.getOverlappingShift(request.body);
    
    if (res.status) {
        if (res?.data?.length > 0) {
            request.body.overlappingShifts = res.data;
            return next();
        } else {
            return next();
        }
    } else {
      return apiResponse.validationError(response, res.message);
    }
  } catch (error) {
    request.logger.error("Error while creating shift group object in shiftGroup controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
}

export const handleOverlappingShift = async(request, response, next) => {
  try {
    const res = await shiftGroup.handleOverlappingShift(request.body);
    
    if (res.status === false) {
        return apiResponse.customResponse(response, "Handle Overlapping Shifts", res.data)
    } else if (res.status) {
        return next();
    } else {
      return apiResponse.validationError(response, res.message);
    }
  } catch (error) {
    request.logger.error("Error while creating shift group object in shiftGroup controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
}

export const createShiftGroup = async (request, response, next) => {
  try {
    const res = await shiftGroup.createShiftGroup(request.body);
    
    if (res.status) {
      request.body.shiftGroup = res.data;
      return next();
    } else {
      return apiResponse.validationError(response, res.message);
    }
  } catch (error) {
    request.logger.error("Error while creating shift group in shiftGroup controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
};

export const addGroupExceptions = async (request, response, next) => {
  try {
    const res = await shiftGroup.addGroupExceptions(request.body);
    
    if (res.status) {
      request.body.shifts = res.data;
      return next();
    } else {
      return apiResponse.validationError(response, res.message);
    }
  } catch (error) {
    request.logger.error("Error while creating shift group in shiftGroup controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
};


export const getShiftGroupListByDate = async (request,response,next) => {
    try
    {
        shiftGroup.getShiftGroupListByDate(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.shiftGroupDataListResponse = res.data;
            return next();
        }).catch(error => {
            logger.error("Error while getListShiftDate in shift by date controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch(error)
    {
        logger.error("Error while getListShiftDate in shift by date controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const assignShiftGroup = async (request,response,next) => {
    try{
        shiftGroup.assignShiftGroup(request.body).then(res => {
            if(res.status){
                request.body.shiftGroup = res.data
                return next();
            }
        }).catch(error => {
            request.logger.error("Error while assigning shift group in shiftGroup controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while createing shift group in shiftGroup controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

const getShiftSetting = (body) => {
    
    let shiftSetting = {
        type:body.type,
    }
    
    if(body.type == shiftTypes.pattern){
        let pattern = body.pattern.map((id)=>{if(id == 'WO') return id; else return new ObjectId(id)})
            shiftSetting.pattern = pattern
        shiftSetting.shiftLength = pattern.length
    }
    else if(body.type == shiftTypes.weekDayWise){
        let pattern = body.pattern.map((obj) => {
            if (obj.shiftId === 'WO') return obj;
            if (obj.subOrgId) {
                return {
                    shiftId: new ObjectId(obj.shiftId),
                    subOrgId: new ObjectId(obj.subOrgId),
                    branchId: new ObjectId(obj.branchId),
            }
            }
            return {
                shiftId: new ObjectId(obj.shiftId),
                clientMappedId: new ObjectId(obj.clientMappedId),
                clientBranchId: new ObjectId(obj.clientBranchId),
            }
        })
        if(pattern.length != 7) return apiResponse.validationError(response,"Number of shift in pattern must be 7 in week day wise type")
        shiftSetting.pattern = pattern
        shiftSetting.shiftLength = pattern.length
    }
    else if(body.type == shiftTypes.weekly){
        let weekNumbers = Object.keys(body.pattern)
        for (let i = 0; i < weekNumbers.length; i++) {
            const wn = weekNumbers[i];
            body.pattern[wn].shiftId = new ObjectId(body.pattern[wn].shiftid)
            if (body.pattern[wn].subOrgId) {
                body.pattern[wn].subOrgId = new ObjectId(body.pattern[wn].subOrgId)
                body.pattern[wn].branchId = new ObjectId(body.pattern[wn].branchId)
            } else {
                body.pattern[wn].clientMappedId = new ObjectId(body.pattern[wn].clientMappedId)
                body.pattern[wn].clientBranchId = new ObjectId(body.pattern[wn].clientBranchId)               
            }
            if(body.pattern[wn].weekOffDay<0 && body.pattern[wn].weekOffDay<6) return apiResponse.validationError(response,"week off day must be 0-6")
        }
        shiftSetting.pattern = body.pattern
    }
    else if(body.type == shiftTypes.monthlyWeekWise){
        let weekNumbers = Object.keys(body.pattern)
        for (let i = 0; i < weekNumbers.length; i++) {
            const wn = weekNumbers[i]
            body.pattern[wn].shiftId = new ObjectId(body.pattern[wn].shiftid)
            if(body.pattern[wn].weekOffDay<0 && body.pattern[wn].weekOffDay<6) return apiResponse.validationError(response,"week off day must be 0-6")
        }
        shiftSetting.pattern = body.pattern
    }
    else if(body.type == shiftTypes.monthly){
        let monthNumbers = Object.keys(body.pattern)
        for (let i = 0; i < monthNumbers.length; i++) {
            const wn = monthNumbers[i]
            body.pattern[wn].shiftId = new ObjectId(body.pattern[wn].shiftid)
            if (body.pattern[wn].subOrgId) {
                body.pattern[wn].subOrgId = new ObjectId(body.pattern[wn].subOrgId)
                body.pattern[wn].branchId = new ObjectId(body.pattern[wn].branchId)
            } else {
                body.pattern[wn].clientMappedId = new ObjectId(body.pattern[wn].clientMappedId)
                body.pattern[wn].clientBranchId = new ObjectId(body.pattern[wn].clientBranchId)               
            }
            
            if(body.pattern[wn].weekOffDay<0 && body.pattern[wn].weekOffDay<6) return apiResponse.validationError(response,"week off day must be 0-6")
        }
        shiftSetting.pattern = body.pattern
    }

    return shiftSetting
}

export const getSingleShiftGroup = async (request,response,next) => {
    try{
        shiftGroup.getSingleShiftGroup(request.body).then(res => {
            if(!res.status) return next();
            request.body.shiftGroup = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while geting single shift group in shiftGroup controller ",{ stack: error.stack })
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while geting single shift group in shiftGroup controller ",{ stack: error.stack })
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const validateDate = async (request,response,next) => {
    try{
        request.body.startDate = new Date(moment(request.body.startDate).format('YYYYY-MM-DD'))
        request.body.endDate = new Date(moment(request.body.endDate).format('YYYYY-MM-DD'))
        return next()
    }catch(error){
        request.logger.error("Error while geting single shift group in shiftGroup controller ",{ stack: error.stack })
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const checkOverlapping = async (request,response,next) => {
    try{
        shiftGroup.getSGByParams(request.body).then(res => {
            if(res.data?.length > 0) return apiResponse.validationErrorWithData(response, "Shift already exists for the same duration",res.data)
            return next();
        }).catch(error => {
            request.logger.error("Error while checking duplicate in shiftGroup controller ",{ stack: error.stack })
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while checking duplicate in shiftGroup controller ",{ stack: error.stack })
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const listShiftGroup = async (request,response,next) => {
    try{
        request.body.query = request.query;
        request.body.query.orgId = request.body.user.orgId;
        shiftGroup.listShiftGroup(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            if(!res.data.length) return apiResponse.notFoundResponse(response,"Shift group not found");
            request.logger.debug(JSON.stringify(res));
            request.body.shiftGroup = res;
            return next()
        }).catch(error => {
            request.logger.error("Error while listing shift group in shiftGroup controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)   
        })
    }catch(error){
        request.logger.error("Error while listing shift group in shiftGroup controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);  
    }
}

export const getDetailsOfCurrentShift = async (request,response,next) => {
    try{
        //if(request.body.attendanceDetails.status) return next();
        const result = await shiftGroup.getCurrentDayShift(request.body);
        if(!result.status) return apiResponse.ErrorResponse(response,"Something went worng",result.error);
        request.body.shiftDetails = result.data;
        request.body.data = {shiftDetails:result.data} 
        return next();  
    }catch(error){
        request.logger.error("Error while getting details of current shift in shiftGroup controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());  
    }
}

export const getShiftGroupList = async (request,response,next) => {
    try
    {
        shiftGroup.getShiftGroupList(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            // if(!res.data.length) return apiResponse.notFoundResponse(response,"Shift group not found");
            request.body.shiftGroup = res.data;
            return next()
        }).catch(error => {
            request.logger.error("Error while getShiftGroupList in shiftGroup controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)   
        })

    }
    catch(error){
        request.logger.error("Error while getShiftGroupList in shiftGroup controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());  
    }
}
