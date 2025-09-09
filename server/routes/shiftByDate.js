import {  Router } from 'express';
const router = Router();

import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";
import * as shift from "../controllers/shift/shift.js";
import {celebrate} from "celebrate";
import * as user from "../controllers/user/user.js"
import { validation } from '../helper/validationSchema.js';
import * as ShiftDateController from '../controllers/shiftByDate/shiftByDate.js';
import * as shiftGroup from '../controllers/shiftGroup/shiftGroup.js'


router.post("/create",
    celebrate(validation.shiftDateCreate),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    ShiftDateController.getAllShiftDate,
    ShiftDateController.shiftDateCreate,
    (request,response) => {
        return apiResponse.successResponse(response,"Shift Date created succefully")
    }
)

router.post("/list",
    celebrate(validation.shiftDateList),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    ShiftDateController.getListShiftDate,
    (request,response) => {
        return apiResponse.responseWithPagination(response,"Shift by date fetched succefully",request.body.shiftDateList);
    }
);

router.post("/update",
    celebrate(validation.shiftDateUpdate),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    ShiftDateController.getOneShiftDate,
    ShiftDateController.updateShiftDate,
    (request,response) => {
        return apiResponse.responseWithPagination(response,"Shift by date fetched succefully",request.body.shiftDateList);
    }
)

router.post('/roster',
    // celebrate(validation.shiftDateRoster),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    user.getUserList,
    shift.getShiftList,
    shiftGroup.getShiftGroupList,
    ShiftDateController.getAllShiftDate,
    ShiftDateController.getRosterShiftDate,
    (request,response) => {
        return apiResponse.successResponseWithData(response,"Shift by date roster fetched succefully",request.body.shiftRosterList);
    }
)


export default router;
