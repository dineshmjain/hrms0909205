import {  Router } from 'express';
const router = Router();

import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";
import * as shift from "../controllers/shift/shift.js";
import * as ShiftDateController from '../controllers/shiftByDate/shiftByDate.js';
import * as shiftGroup from '../controllers/shiftGroup/shiftGroup.js'
import * as designation from '../controllers/designation/designation.js';
import {celebrate} from "celebrate";
import * as user from "../controllers/user/user.js"
import * as client from "../controllers/client/client.js";
import { validation } from '../helper/validationSchema.js';
import * as leave  from '../controllers/leave/leave.js';
import * as holiday from '../controllers/holidays/holidays.js';
import * as settings from '../controllers/settings/settings.js';


/**
 * for creating middle ware for spesific controller class
 * @param {controller to call} ControllerClass 
 * @param {function name which to call inside the controller} method 
 * @returns 
 */
const controllerMiddleware = (ControllerClass,method) => {

    return  (request,response,next) => {

        const controller = new ControllerClass(request,response,next);
        return controller[method]();
    }
};

router.post(
    "/create",
    celebrate(validation.shiftCreation),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    // shift.getOneShift, // temperary fix, will implement actual function later
    shift.createShift,
    (request,responce) => {
        return apiResponse.successResponse(responce,"Shift created succefully");
    }
)

// router.post(
//     "/create",
//     celebrate(validation.shiftCreation),
//     auth.isAuth,
//     user.isUserValid,
//     org.getOrg,
//     // controllerMiddleware(ShiftController,"getOne"),
//     (request,response,next) => {
//         if(request.body.Shift.status) {
//             return apiResponse.duplicateResponse(response,"Shift already exist with this name.")
//         }
//         return next();
//     },
//     // controllerMiddleware(ShiftController,"create"),
//     (request,response) => {
//         return apiResponse.successResponse(response,"Shift created succefully");
//     }
// )

router.post(
    "/list",
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    user.getAllUsers,
    shift.getShiftListWithPagination,
    // controllerMiddleware(ShiftController,"get"),
    (request,response) => {
        return apiResponse.responseWithPagination(response,"Shift fetched succefully",request.body.shift);
    }
);

router.post(
    "/update",
    celebrate(validation.updateShift),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    shift.isShiftValid,
    shift.updateShift,
    // controllerMiddleware(ShiftController,"edit"),
    (request,response) => {
        return apiResponse.successResponse(response,"Shift updated successfully")
    }
)


router.post("/Date/create",
    celebrate(validation.shiftDateCreate),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    ShiftDateController.getAllShiftDate,
    ShiftDateController.shiftDateCreate,
    (request,response) => {
        return apiResponse.successResponse(response,"Shift Assigned Successfully")
    }
)

router.post("/Date/list",
    celebrate(validation.shiftDateList),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    user.getUserByAssignment,
    shiftGroup.getShiftGroupListByDate,
    ShiftDateController.getListShiftDate,
    designation.findDesignations,
    user.findUserData,
    shift.generateShiftData,
    org.findOrgData,
    client.findClientData,
    leave.getUserAppliedLeaves,
    holiday.getHoliday,
    ShiftDateController.groupData,
    
    (request,response) => {
        return apiResponse.responseWithPagination(response,"Shift by date fetched succefully",request.body.responseData);
    }
)

// router.post("/Date/update",
//     celebrate(validation.shiftDateUpdate),
//     auth.isAuth,
//     user.isUserValid,
//     org.getOrg,
//     ShiftDateController.getOneShiftDate,
//     ShiftDateController.updateShiftDate,
//     (request,response) => {
//         return apiResponse.responseWithPagination(response,"Shift by date fetched succefully",request.body.shiftDateList);
//     }
// )
router.post("/Date/update",
    celebrate(validation.shiftDateUpdation),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    shiftGroup.addGroupExceptions,
    ShiftDateController.getAssignedShiftByDateIds,
    ShiftDateController.deactiveShiftDateIds,
    ShiftDateController.isNewShiftExists,
      ShiftDateController.getAllShiftDate,
    ShiftDateController.shiftDateCreate,
    (request, response) => {
        return apiResponse.successResponse(response, "Shift Date Updated succefully")
    }


)

// router.post('/Date/roster',
//     // celebrate(validation.shiftDateRoster),
//     auth.isAuth,
//     user.isUserValid,
//     org.getOrg,
//     user.getUserList,
//     shift.getShiftList,
//     shiftGroup.getShiftGroupList,
//     ShiftDateController.getAllShiftDate,
//     ShiftDateController.getRosterShiftDate,
//     (request,response) => {
//         return apiResponse.successResponseWithData(response,"Shift by date roster fetched succefully",request.body.shiftRosterList);
//     }
// )



export default router;
