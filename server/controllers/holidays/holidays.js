import { response } from 'express';
import * as apiResponse from '../../helper/apiResponse.js';
import * as holidaysModel from '../../models/holidays/holidays.js'


//create holiday
export const createHoliday=async(request,response,next)=>{
    try{
        const createHoliday=await holidaysModel.createHoliday(request.body)
        return createHoliday.status
                ? apiResponse.successResponseWithData(response, createHoliday?.message ?? 'Holiday Created Successfully',createHoliday.data)
                : apiResponse.validationError(response, createHoliday?.message??'Holiday Failed to Create');
    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error createHoliday in holidays controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

// update holiday
export const updateHoliday = async (request, response, next) => {
  try {
    const updatedHoliday = await holidaysModel.updateHoliday(request.body);

    return updatedHoliday.status
      ? apiResponse.successResponseWithData(
          response,
          updatedHoliday?.message ?? 'Holiday Updated Successfully',
          updatedHoliday.data
        )
      : apiResponse.validationError(
          response,
          updatedHoliday?.message ?? 'Failed to Update Holiday'
        );
  } catch (error) {
    console.log("..error......", error?.message);
    request.logger.error("Error updateHoliday in holidays controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error?.message);
  }
};

export const getHolidays = async (request,response,next) => {
    try{
        holidaysModel.getHolidays(request.body).then(res => {
            request.body.holidayDetails = res;
            return next()
        }).catch(error => {
            request.logger.error("Error while fetching holidays in holiday controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while fetching holidays in holiday controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


// get emplyee attendance data based on branch/dept/desg/year/month
export const getHolidaysOnBranchOrDeptOrDesg=async(request,response,next)=>{
    
    try{
        
        const getHolidaysOnBranchOrDeptOrDesg=await holidaysModel.getHolidaysOnBranchOrDeptOrDesg(request.body)
        return getHolidaysOnBranchOrDeptOrDesg.status&&getHolidaysOnBranchOrDeptOrDesg.data.length>=1
                ? apiResponse.successResponseWithData(response, getHolidaysOnBranchOrDeptOrDesg?.message ?? 'Data Found Successfully',getHolidaysOnBranchOrDeptOrDesg.data)
                : apiResponse.notFoundResponse(response, 'No Data Found');


    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error getHolidaysOnBranchOrDeptOrDesg in holidays controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

// Controller for updating holidays on branch, department, or designation level
export const updateHolidaysOnBranchOrDeptOrDesg = async (request, response, next) => {
    try {
        const updateResult = await holidaysModel.updateHolidaysOnBranchOrDeptOrDesg(request.body);
        
        return updateResult.status 
                ? apiResponse.successResponseWithData(response, 'Holidays updated successfully', updateResult.data) 
                : apiResponse.notFoundResponse(response, 'No records found for update');
    } catch (error) {
        console.log("Error in updateHolidaysOnBranchOrDeptOrDesg: ", error.message);
        request.logger.error("Error updating holidays in holidays controller", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};


// activate and deactivate holidays
export const activateDeactivateHolidays=async(request,response,next)=>{
    
    try{
        const updateStatus=await holidaysModel.activateDeactivateHolidays(request.body)
        return updateStatus.status
                ? apiResponse.successResponseWithData(response, updateStatus?.message ?? 'Data Updated Successfully')
                : apiResponse.validationError(response, 'Data fail to update');


    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error getHolidays in holidays controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

//assign holidays branch/department/designation
export const assignHolidays=async(request,response,next)=>{
    try{
        const assignHolidays=await holidaysModel.assignHolidays(request.body)
        return assignHolidays.status
                ? apiResponse.successResponseWithData(response, assignHolidays?.message ?? 'Holidays assigned Successfully')
                : apiResponse.validationError(response, assignHolidays?.message??'Holiday Failed to assigned');


    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error assignHolidays in holidays controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

//checking validation when mapping holidays branch or dept or desg level
export const checkingValidations=async(request,response,next)=>{
    try{
        const checkingValidations=await holidaysModel.checkingValidations(request.body)
       
        if(checkingValidations.status){
           
            request.body.assignmentIds=checkingValidations.assignmentIds
            console.log(".....request.body.assignmentIds...",request.body.assignmentIds)
            return next()
        }
        return apiResponse.validationError(response, checkingValidations?.message??'Holiday Failed to assigned');
       



    }catch(error){
        console.log("....error.....",error?.message)
        request.logger.error("Error assignHolidays checkingValidations in holidays controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

//assign holidays to branchwise,departmentwise.designationwise
export const assignBranchWiseOrDeptOrDesgHolidays=async(request,response,next)=>{
    try{
        const assignBranchWiseOrDeptOrDesgHolidays=await holidaysModel.assignBranchWiseOrDeptOrDesgHolidays(request.body)
        return assignBranchWiseOrDeptOrDesgHolidays.status
                ? apiResponse.successResponseWithData(response, assignBranchWiseOrDeptOrDesgHolidays?.message ?? 'Holidays assigned  Successfully')
                : apiResponse.validationError(response, assignBranchWiseOrDeptOrDesgHolidays?.message??'Holidays Failed to assigned');


    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error assignBranchWiseHolidays in holidays controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const unmapBranchWiseOrDeptOrDesgHolidays = async (request, response, next) => {
    try {
        const unmapResult = await holidaysModel.unmapBranchWiseOrDeptOrDesgHolidays(request.body);
        return unmapResult.status
            ? apiResponse.successResponseWithData(response, unmapResult?.message ?? 'Holidays unassigned successfully')
            : apiResponse.validationError(response, unmapResult?.message ?? 'Holidays failed to unassign');
    } catch (error) {
        console.log("..error......", error?.message);
        request.logger.error("Error unmapBranchWiseOrDeptOrDesgHolidays in holidays controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};

//get holidays based on branch/dept/desg
export const getHolidaysOnBranchDeptDesg=async(request,response,next)=>{
    try{
        const getHolidaysOnBranchDeptDesg=await holidaysModel.getHolidaysOnBranchDeptDesg(request.body)
        return getHolidaysOnBranchDeptDesg.status
                ? apiResponse.successResponseWithData(response, getHolidaysOnBranchDeptDesg?.message ?? 'Holidays Found Successfully',getHolidaysOnBranchDeptDesg.data)
                : apiResponse.validationError(response, getHolidaysOnBranchDeptDesg?.message??'No Data found');

    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error getHolidaysOnBranchDeptDesg in holidays controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

//get holidays based on branch/dept/desg
export const updateHolidaysOnBranchDeptDesg=async(request,response,next)=>{
    try{
        const updateHolidaysOnBranchDeptDesg=await holidaysModel.updateHolidaysOnBranchDeptDesg(request.body)
        return updateHolidaysOnBranchDeptDesg.status
                ? apiResponse.successResponseWithData(response, updateHolidaysOnBranchDeptDesg?.message ?? 'updated Successfully')
                : apiResponse.validationError(response, updateHolidaysOnBranchDeptDesg?.message??'failed to update');

    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error updateHolidaysOnBranchDeptDesg in holidays controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

// this below function used in get shift router date list api middleware used
export const getHoliday = (request, response, next) => {
    try {
        const year = new Date().getFullYear()
        request.body.year = year; // Set the current year
        request.body.limit = 100;
        request.body.isActive = true; // Only fetch active holidays
        holidaysModel.getHolidays(request.body)
            .then(res => {
                if (res.status && res.data.length > 0) {
                    request.body.holidayData = res.data;

                    if (!request.body.extractedProcessedData) {
                        request.body.extractedProcessedData = {};
                    }

                    request.body.extractedProcessedData["holidays"] = {};
                    request.body.orgHolidays = {};


                    res.data.forEach(holiday => {
                        // Convert to YYYY-MM-DD key
                        const dateKey = new Date(holiday.date).toISOString().split("T")[0];

                        // Store holiday details under date key
                        request.body.orgHolidays[dateKey] = {
                            holidayId: holiday._id,
                            orgId: holiday.orgId,
                            name: holiday.name,
                            date: holiday.date,
                            description: holiday.description,
                            holidayType: holiday.holidayType,
                            duration: holiday.duration
                        };

                        request.body.extractedProcessedData["holidays"][ holiday._id.toString()] = {
                            _id: holiday._id,
                            orgId: holiday.orgId,
                            name: holiday.name,
                            date: holiday.date,
                            description: holiday.description,
                            holidayType: holiday.holidayType,
                            duration: holiday.duration
                        };
                    });

                    return next();
                }

                // return apiResponse.notFoundResponse(response, 'No holidays found for this date');
                request.body.orgHolidays = {};
                return next()
            })
            .catch(error => {
                request.logger.error("Error getHoliday in holidays controller ", { stack: error.stack });
                return apiResponse.somethingResponse(response, error.message);
            });


    } catch (error) {
        console.log("..error......", error?.message)
        request.logger.error("Error updateHolidaysOnBranchDeptDesg in holidays controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}