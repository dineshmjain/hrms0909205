import express, { request, response } from 'express';
import * as auth from '../controllers/auth/auth.js';
import * as user from '../controllers/user/user.js';
import * as employAttendenceController from '../controllers/attendence/attendence.js'
import * as shiftGroup from '../controllers/shiftGroup/shiftGroup.js';
import * as shift from '../controllers/shift/shift.js';
import * as assignment from '../controllers/assignment/assignment.js';
import * as apiResponse  from '../helper/apiResponse.js';
import { validation } from '../helper/validationSchema.js';
import { celebrate } from 'celebrate';
import * as ShiftDateController from '../controllers/shiftByDate/shiftByDate.js';
import * as client from '../controllers/client/client.js';
import * as clientbranch from '../controllers/client/clientBranch.js';
import * as branch from '../controllers/branch/branch.js';
import * as notification from '../controllers/messages/notification.js';
import { attendanceNotification } from '../helper/constants.js';

const router=express.Router()

// this below api for daily check in and check out
// router.post('/check/in/out',
//     auth.isAuth,
//     user.isUserValid, 
//     employAttendenceController.checkingEmployeeCurrentShift,
//     // employAttendenceController.findExistingCheckIn,
//     employAttendenceController.checkingEmployeeCheckIn, //adding,checking employee checkin/check out   
// )

const conditionalMiddleware = (condition, middleware) => {
  return (req, res, next) => {
    if (condition(req)) {
      return middleware(req, res, next);
    }
    next();
  };
};

// // Daily checkIn amd checkOut api
// router.post('/add',
//     celebrate(validation.addAttendence),
//     auth.isAuth,
//     user.isUserValid,
//     // Call only if type === "checkin"
//     //   conditionalMiddleware(
//     //     req => req.body.type === 'checkIn',
//     //     employAttendenceController.checkingEmployeeCurrentShift
//     //   ),
//     //   conditionalMiddleware(
//     //     req => req.body.type === 'checkIn',
//     //     employAttendenceController.getEmployeeNearestShift
//     //   ),

//     (request, response, next) => {
//         request.body.clientCheckIn = true
//         return next()
//     },
//     client.isClientExist,
//     branch.isBranchExist, // check branch(both client branch or hrms barnch)exist or not
//     employAttendenceController.checkingEmployeeCurrentShift,
//     employAttendenceController.getEmployeeNearestShift,
//     employAttendenceController.findExistingCheckIn,
//     employAttendenceController.addAttendenceData,
//     employAttendenceController.getMessage,
//     employAttendenceController.generateTransactionLog,

//     (request, response) => {
//         return apiResponse.successResponseWithData(response, `${request.body.message}`, { isCheckIn: request.body.type === 'checkIn' });
//     }
// );



router.post('/add',
    celebrate(validation.addAttendence),
    auth.isAuth,
    user.isUserValid,
    (request, response, next) => {
        request.body.clientCheckIn = true;
        return next();
    },

    client.getClientIds,
    employAttendenceController.getNearestClientBranchLocation,
    //   client.isClientExist,
    ShiftDateController.getShiftByDate,
    employAttendenceController.getEmployeeNearestShift2,
    employAttendenceController.findExistingCheckIn,
    employAttendenceController.findExistingCheckInLog,
    shift.getOneShift, 
    employAttendenceController.addAttendenceData,
    employAttendenceController.getMessage,
    // employAttendenceController.isAuthorized,
    employAttendenceController.generateTransactionLog,
    (request, response, next) => {
        next(); // Call next middleware to handle the response
        return apiResponse.successResponseWithData(response, `${request.body.message}`, { isCheckIn: request.body.type === 'checkIn' });
    },
    (request, response, next) => {

        const deviceTokens = Object.values(request.body.user.device).map(device => device.deviceToken).filter(token => token);
        let getContent = attendanceNotification(request.body.type, request.body.message)
        request.body.notifyUsers = [{ userId: request.body.user._id, title: getContent.title, description: getContent.description, deviceTokens: deviceTokens }]
        return next()
    },
    notification.sendNotification
);

// router.post('/add',
//   celebrate(validation.addAttendence),
//   auth.isAuth,
//   user.isUserValid,
//   (request, response, next) => {
//     request.body.clientCheckIn = true;
//     return next();
//   },
  
// //   branch.isBranchExist,
//   client.getClientIds,
//   employAttendenceController.getNearestClientBranchLocation,
//   client.isClientExist,
//   employAttendenceController.checkingEmployeeCurrentShift,
//   employAttendenceController.getEmployeeNearestShift,
//   employAttendenceController.findExistingCheckIn,
//   employAttendenceController.addAttendenceData,
//   employAttendenceController.getMessage,
// //   employAttendenceController.validateCheckInOutSequence,
//  employAttendenceController.isAuthorized,
//   employAttendenceController.generateTransactionLog,
// //   employAttendenceController.addEmployeeAttendenceStats,
//   (request, response) => {
//     return apiResponse.successResponseWithData(response, `${request.body.message}`, { isCheckIn: request.body.type === 'checkIn' });
//   }
// );

router.post('/team/add',
  celebrate(validation.teamAttendance),
  auth.isAuth,
  user.swapUserIdWithEmpId, // Swap userId with employeeUserId if provided
  user.isUserValid,
  (request, response, next) => {
    request.body.teamAttendance = true;
    request.body.checkNearestShift = true; // Set this flag to check nearest shift
    return next();
  },
  client.getClientIds,
  employAttendenceController.getNearestClientBranchLocation,
  // client.isClientExist,
  ShiftDateController.getShiftByDate,
  employAttendenceController.getEmployeeNearestShift2,
  employAttendenceController.findExistingCheckIn,
  employAttendenceController.findExistingCheckInLog,
  shift.getOneShift, 
  employAttendenceController.addAttendenceData,
  employAttendenceController.getMessage,
//   employAttendenceController.validateCheckInOutSequence,
  employAttendenceController.generateTransactionLog,
//   employAttendenceController.addEmployeeAttendenceStats,
  (request, response) => {
    return apiResponse.successResponseWithData(response, `${request.body.message}`, { isCheckIn: request.body.type === 'checkIn' });
  }
);

// Attendance Extension API
router.post('/extend',
    celebrate(validation.extendAttendence),
    auth.isAuth,
    user.isUserValid,
    (request, response, next) => {
        request.body.extendAttendance = true
        request.body.checkNearestShift = true
        request.body.type = 'checkOut';
        return next()
    },
    employAttendenceController.getLatestAttendenceDoc,
    employAttendenceController.getLatestAttendanceLogs,
    client.getClientIds,
    employAttendenceController.getNearestClientBranchLocation,
    // client.isClientExist,
    employAttendenceController.findExistingCheckIn,
    employAttendenceController.findExistingCheckInLog,
    shift.getOneShift, // to get shift details of latest attendence log
    // employAttendenceController.generateTransactionLog,  // for default checkOut
    (request, response, next) => {
        request.body.type = 'checkIn' // Set type to checkIn for the next steps
        return next()
    },
    employAttendenceController.getEmployeeNearestShift2,
    // employAttendenceController.findExistingCheckIn,
    employAttendenceController.addAttendenceData,
    employAttendenceController.generateTransactionLog,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Attendance Extended Successfully", { isCheckIn: request.body.type === 'checkIn' });
    }
);

//Get current and assigned shifts
router.get('/get/user/shift',
  auth.isAuth,
  user.isUserValid,
  employAttendenceController.checkingEmployeeCurrentShift,
  employAttendenceController.getEmployeeNearestShift,
  (request, response) => {
    return apiResponse.successResponseWithData(response, "Shift details", { assignedShift: request.body.assignedShift, currentShift: request.body.nearestShift });
  }
)

router.post('/get/stats',
    celebrate(validation.getAttendenceStats),
    auth.isAuth,
    user.isUserValid,
    employAttendenceController.getEmployeeAttendenceStats,
)


//get attendence data of specifice employee based on date range
router.post('/get/data/userId',
    auth.isAuth, 
    user.isUserValid,
    user.isEmployeeUserValid,
    employAttendenceController.getAttendenceDataUserId
)


//get employees data based on branch/dept/desg/year/month
router.post('/get/employess/data',
    auth.isAuth,
    user.isUserValid,
    employAttendenceController.getEmployessAttendenceData 
)


//get attendence summary by userId
router.post('/get/summary/UserId', 
    auth.isAuth, 
    user.isUserValid,
    user.isEmployeeUserValid,
    employAttendenceController.getAttendanceSummaryDataByUserId
);


//get approve/pending/rejected attendnece data
router.post('/status/get',
    auth.isAuth, 
    user.isUserValid,
    assignment.getAssignmentbyHirearchy,
    user.getAllUsers,
    employAttendenceController.getAllUserLogStatus,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Attendance status fetched successfully", request.body.data);
    }
)


//get approve/pending/rejected attendence data
router.post('/get/pending/appprove/data/userId',
    auth.isAuth, 
    user.isUserValid,
    employAttendenceController.getAttendanceDataRejectedUserId 
)



// //admin manually approves attendence data (approved/rejected)
// router.post('/manual/:type',
//     (request, response, next) => {
//         if(['approve', 'reject'].includes(request.params.type)) {
//             request.body.type = request.params.type;
//             return next();
//         }
//         else {
//             return apiResponse.validationError(response, "Invalid type parameter. Use 'approved' or 'rejected'.");
//         }
//     },
//     auth.isAuth, 
//     user.isUserValid,
//     employAttendenceController.updateStatus
// )

//admin manually approved attendence data
router.post('/approved/manual',
    auth.isAuth, 
    user.isUserValid,
    employAttendenceController.approvedAttendenceDataManually  
)


// Get branch-wise attendance data with percentages and employee count
router.post('/get/branchwise',
    auth.isAuth, 
    user.isUserValid,
    employAttendenceController.getBranchWiseAttendanceData
);


// Get department-wise attendance data for a specific branch
router.post('/get/departmentwise',
    auth.isAuth, 
    user.isUserValid,
    employAttendenceController.getDepartmentWiseAttendanceData
);


// Get designation-wise attendance data for a specific department and branch and organisation
router.post('/get/designationwise',
    auth.isAuth, 
    user.isUserValid,
    employAttendenceController.getDesignationwiseAttendanceData
);

//get employess summary data of attendence based on orgId,branchId,department,designation
router.post('/get/employess/summary',
    auth.isAuth, 
    user.isUserValid,
    employAttendenceController.getEmployeesSummaryAttendenceData
);

//get employee attendence summary data based on employeeUserId
router.post('/get/employee/userid/summary',
    auth.isAuth, 
    user.isUserValid,
    user.isEmployeeUserValid,
    employAttendenceController.getEmployeeSummaryAttendenceDataUserId
);

router.post('/setImage',
    auth.isAuth, 
    user.isUserValid,
    employAttendenceController.setImageToAws
);

router.post('/getUserByImage',
    auth.isAuth, 
    user.isUserValid,
    employAttendenceController.searchUserByFace,
    user.isUserValid,
    (request,response) => {
        return apiResponse.successResponseWithData(response,"success",request.body.user)
    }
);

/**
 * get single current day attendence data of logdin user.
 */

router.post('/get/currentDay',
    auth.isAuth,
    user.isUserValid,
    shiftGroup.getDetailsOfCurrentShift,
    employAttendenceController.getSingleCurrentDayAttendence,
    
    (request,response) => {
        return apiResponse.successResponseWithData(response,"success",request.body.data)
    }
);

/**
 * get attendance list
 */
router.post('/list',
    auth.isAuth,
    user.isUserValid,
    employAttendenceController.getaAttendanceDetails,
    (request,response) => {
        return apiResponse.responseWithPagination(response,"success",request.body.attendanceDetails)
    }
);

/**
 * get daily attendance user wise.
 */router.post('/date/wise/log/list',
    auth.isAuth,
    user.swapUserIdWithEmpId,
    user.isUserValid,
    ShiftDateController.getShiftByDate,
    employAttendenceController.getAttendanceLogs,
    (request,response) => {
        return apiResponse.successResponseWithData(response,"Date wise Data Found Successfully",request.body.data)
    }
);

router.post('/getById',
    auth.isAuth,
    user.isUserValid,
    employAttendenceController.getLogById,
    branch.isBranchExist,
    (request, response, next) => {
      request.body.clientMappedId = undefined // while getting Shift i don't want only client shifts, i also want org shifts
      return next()
    },
    shift.getOneShift,
    (request,response) => {
        return apiResponse.successResponseWithData(response,"Attendance Log Data Found Successfully",{...request.body.logData, shiftName : request.body.shift?.name,startTime:request.body.shift?.startTime,endTime: request.body.shift?.endTime,branchName : request.body.branchDetails?.name})
    }
);

// get all users statistics
router.post('/month/analytics',
    celebrate(validation.monthAttendenceStats),
    auth.isAuth,
    user.isUserValid,
    employAttendenceController.getAllEmployeeAttendenceStats,
)

router.post('/month/logs',
    celebrate(validation.getAttendenceStats),
    auth.isAuth,
    user.isUserValid,
    // employAttendenceController.getEmployeeAttendenceTotalLogs,
    employAttendenceController.userAttendanceTransactions,
    // (request, response) => {
    //     return apiResponse.successResponseWithData(response, "Attendance logs fetched successfully", request.body.result);
    // }
)


// dashboard api for attendance status
router.post('/dashboard/status',
    // celebrate(validation.getAttendenceStats),
    (request, response, next) => {
      request.body.dashboardStatus = true
      return next()
    },
    auth.isAuth,
    user.isUserValid,
    client.getClientIds,
    employAttendenceController.findExistingCheckIn,
    ShiftDateController.getShiftByDate,
    employAttendenceController.getEmployeeNearestShift2,
    // employAttendenceController.getLatestAttendenceDoc,        
    employAttendenceController.dashboardStatus,
    // employAttendenceController.getEmployeeNearestShift,
    // shift.getOneShift,
    (request,response,next)=>{
        // return apiResponse.successResponseWithData(response,"Data found",{assignedShift:{_id:request.body.shift._id,name:request.body.shift.name,startTime:request.body.shift.startTime,endTime:request.body.shift.endTime},currentShift:request.body.currentShift|| null,isCheckIn:request.body.type??false})
        let result = {
            assignedShift:request.body.nearestShift,
            isCheckIn:request.body.type??false
        }
        if(request.body.currentShift?.lenght > 0) result.currentShift = request.body.currentShift
        return apiResponse.successResponseWithData(response,"Data found",result)
    }
)


router.post('/approve/reject',
    celebrate(validation.approveRejectAttendence),
    auth.isAuth,
    user.isUserValid,
    employAttendenceController.findExistingCheckIn,
    employAttendenceController.approveRejectAttendenceLogs,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Attendance status updated successfully", request.body.data);
    }
);



export default router;

