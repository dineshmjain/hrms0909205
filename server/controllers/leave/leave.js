import * as apiResponse from '../../helper/apiResponse.js';
import { Leave } from '../../models/leave/leave.js';
import { Controller } from '../../helper/controllerService.js';
import { ObjectId } from 'mongodb';
import * as leave from '../../models/leave/leave.js';
import moment from 'moment';
import { logger } from '../../helper/logger.js';

export class LeaveController extends Controller {
    constructor(request,response,next) {
        super(request,response,next,Leave);
    }  

}

export const validateLeaveApplication = (request, response, next) => {
    try {
        const { days } = request.body;
        const policy = request.body.policyData[0]; 
        
        // if(policy.approval.type === 'post')return next() // Skip validation for post-approval policies

        if (!days || typeof days !== 'object') {
            return apiResponse.validationError(response, "Leave days must be provided and valid.");
        }

        const today = moment().startOf('day');

        for (const dateStr of Object.keys(days)) {
            const leaveDate = moment(dateStr).startOf('day');
            if (leaveDate.isBefore(today)) {
                return apiResponse.validationError(
                    response,
                    `Cannot apply for leave in the past: ${dateStr}`
                );
            }
        }

        return next();
    } catch (error) {
        logger.error("Error in validateLeaveApplication", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};

// check policy rules
export const checkPolicyRules=async(request,response,next)=>{
    try{
        const policy = request.body.policyData[0];  
        const leave = request.body.leaveData;   
    
        const fromDate = moment(request.body.from);
        const toDate = moment(request.body.to);
        const today = moment().startOf('day');

        const daysDiff = fromDate.diff(today, 'days');       // Future (for pre)
        const daysLate = today.diff(fromDate, 'days');       // Past (for post)

        const totalLeaveDays = toDate.diff(fromDate, 'days') + 1; //total leave days including from & to

        const userJoiningDate = moment(request.body.user.joinDate); 

        // 0. Cannot apply leave in the past
        // if (policy.approval.type === 'pre' && fromDate.isBefore(today)) {
        //     return apiResponse.validationError(response, "Cannot apply for leave in the past.");
        // }
    
        // 1. Validity check
        // if(fromDate.isBefore(moment(policy.validity.from)) || toDate.isAfter(moment(policy.validity.to))){
        //     return apiResponse.validationError(response,"Leave is outside policy validity period.")
        // }
    
        // // 2. Experience check (you need user's joining date here)
        // const userJoiningDate = moment(request.body.user.JoinDate); 
        // const requiredDate = userJoiningDate.clone().add(policy.minExperienceMonths, 'months');
        // if (fromDate.isBefore(requiredDate)) {
        //     return apiResponse.validationError(response,`Leave allowed only after ${policy.minExperienceMonths} months of experience.`)
        // }

        // Pre-approval check
        // if (policy.approval.type === 'pre') {
        //     if (daysDiff < policy.approval.applyBeforeDays) {
        //         return apiResponse.validationError(
        //             response,
        //             `Leave must be applied at least ${policy.approval.applyBeforeDays} day(s) in advance.`
        //         );
        //     }
        // }

        // Post-approval check
        // if (policy.approval.type === 'post') {
        //     if (daysLate > policy.approval.applyAfterDays) {
        //         return apiResponse.validationError(
        //             response,
        //             `Leave must be applied within ${policy.approval.applyAfterDays} day(s) after the leave date.`
        //         );
        //     }
        // }


        // if (totalLeaveDays > policy.eligibleNoOfDays) {
        //     return apiResponse.validationError(
        //         response,
        //         `You can only take up to ${policy.eligibleNoOfDays} day(s) leave as per this policy.`
        //     );
        // }

        // const totalDaysSinceJoin = today.diff(userJoiningDate , 'days');

        // if (totalDaysSinceJoin < policy.eligibleNoOfDays) {
        //     return apiResponse.validationError(
        //         response,
        //         `You are not eligible to apply for leave until you complete ${policy.eligibleNoOfDays} working day(s).`
        //     );
        // }
    
        // 3. Gender check
        // if (policy.genderEligibility !== 'all' && policy.genderEligibility !== request.body.user?.Gender) {
        //     return apiResponse.validationError(response,"Not eligible for this leave type based on gender.")
        // }
    
        // 4. Employment type check
        // if (!policy.employmentTypeEligibility.includes(request.body.user.employmentType)) {
        //     return apiResponse.validationError(response,"Your employment type is not eligible.")
        // }
    
        // 5. Advance notice check
        // if (fromDate.diff(today, 'days') < policy.advanceNotice) {
        //     return apiResponse.validationError(response,`Minimum ${policy.advanceNotice} day(s) advance notice required.`)
        // }
    
        // 6. Blocked date check
        // const blocked = policy.blockedDates.some(date => fromDate.isSame(moment(date), 'day') || toDate.isSame(moment(date), 'day'));
        // if (blocked) {
        //     return apiResponse.validationError(response,"Leave dates fall on blocked dates.")
        // }
    
        // 7. Min/Max day check
        // const leaveDays = toDate.diff(fromDate, 'days') + 1;
        // if (leaveDays < policy.miniLeaveLimit || leaveDays > policy.maxLeaveLimit) {
        //     return apiResponse.validationError(response,`Leave must be between ${policy.miniLeaveLimit} and ${policy.maxLeaveLimit} days.`)
        // }
    
        // 8. Max consecutive days
        // if (leaveDays > policy.maxConsecutiveDays) {
        //     return apiResponse.validationError(response,`Max consecutive days allowed: ${policy.maxConsecutiveDays}`)
        // }

        return next();

    }catch(error){
        logger.error('error while checkPolicyRules in leave controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const calculateLeaveDays = (request, response, next) => {
    try {
        const days = request.body.days;

        if (!days || typeof days !== 'object') {
            return apiResponse.validationError(response, 'days must be a valid object');
        }

        let paidDays = 0;
        let unpaidDays = 0;
        let totalAppliedDays = 0;

        for (const [date, dayInfo] of Object.entries(days)) {

            dayInfo.status = 'pending';

            const value = dayInfo.type === 'full' ? 1 : 0.5;

            if (dayInfo.paid === true) {
                paidDays += value;
            } else {
                unpaidDays += value;
            }

            totalAppliedDays += value;
        }

        // Attach to request body for later use
        request.body.paidDays = paidDays;
        request.body.unpaidDays = unpaidDays;
        request.body.noOfDaysAppliedLeave = totalAppliedDays;

        return next();
    } catch (error) {
        logger.error('Error in calculateLeaveDays middleware', { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};


// apply leave
export const applyLeave=async(request,response,next)=>{
    try{
        leave.UserApplyLeave(request.body).then(res=>{
            if(res.status){
                return next()
                // return apiResponse.successResponse(response,'leave applied successfully')
            }
            return apiResponse.validationError(response,'failed to apply leave')
        }).catch(error=>{
            request.logger.error('error while applyLeave in leave controller',{stack:error.stack});
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        logger.error('error while applyLeave in leave controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}

// get leaves
export const getUserLeaves=async(request,response,next)=>{
    try{
        leave.getUserLeaveTransaction(request.body).then(result=>{
            if(result.status && result.data.length>=1){
                request.body.transactions=result
                return next()
                // return apiResponse.successResponseWithData(response,'Data found successfully', result)
            }
            return apiResponse.notFoundResponse(response,'No data found')
        }).catch(error=>{
            request.logger.error('error while getTransactions in leave controller',{stack:error.stack});
            return apiResponse.somethingResponse(response, error.message)
        }) 

    }catch(error){
        logger.error('error while getTransactions in leave controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}

// chcecking applied leave
export const isAppliedLeave=async(request,response,next)=>{
    try{
        leave.findUserAppliedLeave(request.body).then(result=>{
            if(result?.status){
                return next()
            }
            return apiResponse.notFoundResponse(response,'No Leaves found')
        }).catch(error=>{
            request.logger.error('error while isAppliedLeave in leave controller',{stack:error.stack});
            return apiResponse.somethingResponse(response, error.message)
        }) 

    }catch(error){
        logger.error('error while isAppliedLeave in leave controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}

// update apply leave status
export const updateApplyLeaveStatus=async(request,response,next)=>{
    try{
        leave.updateLeaveStatus(request.body).then(result=>{
            if(result?.status){
                // return apiResponse.successResponse(response,'updated successfully')
                request.body.approvedDays=result.approvedDays
                return next()
            }
            return apiResponse.validationError(response,'failed to update')
        }).catch(error=>{
            request.logger.error('error while updateApplyLeaveStatus in leave controller',{stack:error.stack});
            return apiResponse.somethingResponse(response, error.message)
        }) 

    }catch(error){
        logger.error('error while updateApplyLeaveStatus in leave controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}

// get leave balance
export const getUserLeaveBalance=async(request,response,next)=>{
    try{
        leave.getLeaveBalance(request.body).then(res=>{
            if(res.status&&res.data.length>=1){
                request.body.userBalance=res.data
                request.body.userBalancePolicyIds= res.data.map(item => item.policyId.toString());
                request.body.isUserBalance=true
                return next()
            }
            request.body.isUserBalance=false
            request.body.userBalancePolicyIds= []
            return next() // reason for if not created user balance next middlewrae create userbalance
        }).catch(error=>{
            logger.error('error while getUserLeaveBalance in leave controller',{stack:error.stack});
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        logger.error('error while getUserLeaveBalance in leave controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}

// create user leave balance
export const createUserLeaveBalance=async(request,response,next)=>{
    try{
        // if(request.body.isUserBalance)return next()
        leave.createLeaveBalance(request.body).then(res=>{
            if(res.status){
                return next()
            }
            // return apiResponse.notFoundResponse(response,'No Data found')
            return next()
        }).catch(error=>{
            logger.error('error while createUserLeaveBalance in leave controller',{stack:error.stack});
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        logger.error('error while createUserLeaveBalance in leave controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}

// update user leave balance
export const updateUserLeaveBalance=async(request,response,next)=>{
    try{
        leave.updateUserBalance(request.body).then(result=>{
            if(result?.status){
                // return apiResponse.successResponse(response,'updated successfully')
                return next()
            }
            return apiResponse.validationError(response,'failed to update')
        }).catch(error=>{
            request.logger.error('error while updateUserBalance in leave controller',{stack:error.stack});
            return apiResponse.somethingResponse(response, error.message)
        }) 

    }catch(error){
        logger.error('error while createUserLeaveBalance in leave controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const getUserAppliedLeaves=async(request,response,next)=>{
    try{
        leave.getUserAppliedLeavesTransaction(request.body)
        .then(result => {
            if (result?.data.length >= 1) {
                request.body.userAppliedLeaves = result.data;
    
                if (!request.body["extractedProcessedData"]) 
                    request.body.extractedProcessedData = {};
                   
    
                request.body.extractedProcessedData["leaves"] = {};
                request.body.userIdLeaves={};
                result.data.forEach(leave => {
                    const userIdStr = leave.userId.toString();
                    const leaveIdStr = leave._id.toString();
                    const leavePolicyName=leave.leavePolicyName
    
                    // Ensure user object exists
                    if (!request.body.extractedProcessedData["leaves"][leaveIdStr]) {
                        request.body.extractedProcessedData["leaves"][leaveIdStr] = {};
                        // request.body.userIdLeaves["leaves"][userIdStr] = {};
                    }
                    if(!request.body.userIdLeaves[userIdStr])request.body.userIdLeaves[userIdStr] = {};
                    
    
                    // Merge days without overwriting existing ones
                    Object.entries(leave.days || {}).forEach(([date, dayData]) => {
                        if (!request.body.extractedProcessedData["leaves"][leaveIdStr][date]) {
                            request.body.extractedProcessedData["leaves"][leaveIdStr] = {
                                type: dayData.type,
                                paid: dayData.paid,
                                status: dayData.status,
                                remarks: dayData.remarks,
                                reason:leave.reason,
                                policyName:leavePolicyName,

                            };
                        }
                        if (!request.body.userIdLeaves[userIdStr][date]) {
                            request.body.userIdLeaves[userIdStr][date] = {
                                userLeaveId: leaveIdStr,
                                type: dayData.type,
                                paid: dayData.paid,
                                status: dayData.status,
                                remarks: dayData.remarks,
                                reason:leave.reason,
                            };
                        }
                    });
                });

                // console.log("...userId leaves...",request.body.userIdLeaves)
    
                return next();
            }
            request.body.userIdLeaves={};
            return next();
        })
        .catch(error => {
            request.logger.error('error while getTransactions in leave controller', { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message);
        });    

    }catch(error){
        logger.error('error while getTransactions in leave controller',{stack:error.stack});
        return apiResponse.somethingResponse(response, error.message)
    }
}
