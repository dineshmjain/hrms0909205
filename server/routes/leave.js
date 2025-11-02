import { Router } from 'express'
const router = Router();

import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";
import * as user from '../controllers/user/user.js'
import { LeaveController } from '../controllers/leave/leave.js';
import * as leave  from '../controllers/leave/leave.js';
import * as leavePolicy from '../controllers/leavePolicy/leavePolicy.js';
import moment from 'moment';
import {celebrate} from 'celebrate';
import {validation} from '../helper/validationSchema.js';

const controllerMiddleware = (ControllerClass, method) => {
    return (request, response, next) => {
        const controller = new ControllerClass(request, response, next);
        return controller[method]();
    }
};

router.post('/create',
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    controllerMiddleware(LeaveController,"getOne"),
    (request,response,next) => {
        if(request.body.Leave.status) {
            return apiResponse.duplicateResponse(response,"Leave already exist with this name.")
        }
        return next()
    },
    controllerMiddleware(LeaveController,"create"),
    (request,response) => {
        return apiResponse.successResponse(response,"Leave created succefully");
    }
)

router.get('/get',
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    controllerMiddleware(LeaveController,"get"),
    (request,response) => {
        if(request.body.Leave.status) {
            return apiResponse.responseWithPagination(response,"Leave details fetched successfully!",request.body.Leave)
        }
    }
)

router.post('/edit/:id',
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    controllerMiddleware(LeaveController, "getOne"),
    (request, response, next) => {
        if (!request.body.Leave.status) {
            return apiResponse.notFoundResponse(response, "Leave not found!")
        } else {
            return next()
        }
    },
    controllerMiddleware(LeaveController, "edit"),
    (request, response) => {
        if (request.body.Leave.status) {
            return apiResponse.successResponse(response, "Leave details updated successfully!")
        }
    }

)

router.post('/apply',
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
)

// apply leave
router.post('/applied',
    celebrate(validation.applyLeave),
    auth.isAuth,
    user.isUserValid,
    // leavePolicy.getPolicy,
    leavePolicy.isPolicyExists,
    leave.validateLeaveApplication,
    leave.checkPolicyRules, 
    leave.calculateLeaveDays,
    leave.applyLeave,
    leave.getUserLeaveBalance,
    leave.createUserLeaveBalance,
    (request,response,next)=>{
        return apiResponse.successResponse(response,'leave applied successfully')
    }

)

// get user leaves
router.post('/get/user',
    celebrate(validation.userLeaves),
    auth.isAuth,
    user.isUserValid,
    leave.getUserLeaves,
    (request,response)=>{
        return apiResponse.successResponseWithData(response,'Data found Successfully',request.body.transactions)
    }
)

//get user leave balance
router.post('/balance',
    celebrate(validation.userLeaveBalance),
    auth.isAuth,
    user.isUserValid,
    leave.getUserLeaveBalance, // if user has leave balance he get
    leavePolicy.getPolicy,
    leave.createUserLeaveBalance, // here  leave balance will create to  user if he doesn't have
    leave.getUserLeaveBalance,
    (request,response)=>{
        return apiResponse.successResponseWithData(response,'Data found Successfully',request.body.userBalance)
    }
)

// update the status of user leave by admin
router.post('/aprove/reject',
    celebrate(validation.updateApproveRejectLeave),
    auth.isAuth,
    user.isUserValid,
    leave.getUserLeaves,
    (request,response,next)=>{
        request.body.leavePolicyId=request.body.transactions?.data[0].leavePolicyId
        const{paidDays,unpaidDays,noOfDaysAppliedLeave,days }=request.body.transactions?.data[0]
        request.body.noOfDaysAppliedLeave=noOfDaysAppliedLeave
        request.body.paidDays=paidDays
        request.body.unpaidDays=unpaidDays
        request.body.existingDBDays=days
        return next()
    },
    leave.getUserLeaveBalance,
    (request,response,next)=>{
        request.body.userLeaveBalance=request.body.userBalance[0]
        return next()
    },
    leave.updateApplyLeaveStatus,
    leave.updateUserLeaveBalance,
    (request,response)=>{
        return apiResponse.successResponse(response,'updated Succesfully')
    }
)


router.post('/generate/list/pdf/excel',
    celebrate(validation.leaveListBalance),
    auth.isAuth,
    user.isUserValid,
    user.getEmployeesBranchId,           // Step 1: Get employees
    leave.getUserLeaveBalance,           // Step 2: Try to fetch balance
    leavePolicy.getPolicy,               // Step 3: Get branch policies
    leave.createUserLeaveBalanceReports,        // Step 4: Create missing balances
    leave.getUserLeaveBalance,           // Step 5: Re-fetch (now all exist)
    leave.generateLeaveBalancePdf,     // Step 6: Generate PDF
    leave.generateLeaveBalanceExcel,
    (request,response)=>{
        return apiResponse.successResponseWithData(response,'generated pdf successfully',request.body.result)
    }
)

export default router;
