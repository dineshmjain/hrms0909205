import { response, Router } from 'express';
const router = Router();

import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";
import * as shiftGroup from "../controllers/shiftGroup/shiftGroup.js";
import * as user from "../controllers/user/user.js"
import * as assignment from '../controllers/assignment/assignment.js';
import { celebrate } from 'celebrate';
import { validation } from '../helper/validationSchema.js';
// import { ShiftController } from '../controllers/shift/shift.js';

/**
 * creating shift group
 */
router.post(
    "/create",
    // celebrate(validation.shiftGroupCreate),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    assignment.getAssignmentbyHirearchy,
    shiftGroup.buildShiftGroupObject,
    shiftGroup.getOverlappingShift,
    shiftGroup.handleOverlappingShift,
    shiftGroup.createShiftGroup,
    (request,response) => { 
        return  apiResponse.successResponse(response, "Shift Assigned To Employees")
    }
)

router.get(
    "/list",
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    shiftGroup.listShiftGroup,
    (request,response) => {
        return apiResponse.responseWithPagination(response,"Shift group fetched successfully",request.body.shiftGroup);
    }
)

router.post(
    "/assign",
    celebrate(validation.shiftGroupAssign),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    shiftGroup.assignShiftGroup,
    (request,response) => {
        return apiResponse.responseWithPagination(response,"Shift group assigned successfully",request.body.shiftGroup);
    }
)

export default router;