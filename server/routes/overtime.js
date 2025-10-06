import { Router } from 'express';
const router = Router();

//controllers
import * as roles from '../controllers/role/role.js';
import * as modules from '../controllers/modules/modules.js';

//helpers
import { getClientIP } from '../helper/formatting.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from '../controllers/user/user.js';
import * as overtime from '../controllers/overtime/overtime.js';
import * as apiResponse from '../helper/apiResponse.js';
import * as designation from "../controllers/designation/designation.js";
import { celebrate } from "celebrate";
import { validation } from '../helper/validationSchema.js';

router.use((request, response, next) => {
    console.log('\novertime Route');
    console.log(request.originalUrl);
    request.body.endpoint = request.originalUrl
    request.body.ModuleKey = 'overtime'
    request.body.IP = getClientIP(request)
    console.log('-------------------------------------------------------');
    return next();
})

router.post('/add',
    // celebrate(validation.addOvertime),
    auth.isAuth,
    user.isUserValid,
    overtime.addOvertime,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Overtime Added successfully")
    }
)

router.post('/get/list',
    auth.isAuth,
    user.isUserValid,
    overtime.getOvertimeList,
    (request, response, next) => {
        return apiResponse.successResponseWithData(response, "Overtime list Found successfully", request.body.overtimeData)
    }
)

router.post('/get',
    // celebrate(validation.addOvertime),
    auth.isAuth,
    user.isUserValid,
    overtime.getOvertime,
    (request, response, next) => {
        return apiResponse.successResponseWithData(response, "Overtime Details Found successfully!", request.body.overtimeDetails)
    }
)

router.post('/update',
    // celebrate(validation.addOvertime),
    auth.isAuth,
    user.isUserValid,
    overtime.getOvertime,
    overtime.updateOvertime,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Overtime Updated successfully")
    }
)

export default router;