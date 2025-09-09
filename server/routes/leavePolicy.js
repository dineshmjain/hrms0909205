import { Router } from 'express'
const router = Router();

import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";
import * as user from '../controllers/user/user.js'
import { celebrate } from 'celebrate'
import { validation } from '../helper/validationSchema.js'
import * as leavePolicy from '../controllers/leavePolicy/leavePolicy.js';


router.post('/create',
    celebrate(validation.createLeavePolicy),
    auth.isAuth,
    user.isUserValid,
    // org.isOrgExist,
    leavePolicy.isPolicyExists,
    leavePolicy.createLeavePolicy,
    (request, response) => {
        const leavePolicyDetails = request.body.leavePolicyDetails
        return apiResponse.successResponseWithData(response, 'Leave policy created successfully!', leavePolicyDetails)
    }
)

// router.post('/get', 
//     // celebrate(validation.getLeavePolicy),
//     auth.isAuth,
//     user.isUserValid,
//     leavePolicy.isPolicyExists,
//     // leavePolicy.getleavePolicy
// )


// create leave policy
router.post('/add',
    celebrate(validation.addPolicy),
    auth.isAuth,
    user.isUserValid,
    leavePolicy.createPolicy
)


// get policy
router.post('/get',
    celebrate(validation.getPolicy),
    auth.isAuth,
    user.isUserValid,
    leavePolicy.getPolicy,
    (request,response)=>{
        return apiResponse.successResponseWithData(response, 'Data found successfully!', request.body.policyData)
    }
)


// update leave policy
router.post('/edit',
    celebrate(validation.updatePolicy),
    auth.isAuth,
    user.isUserValid,
    leavePolicy.isPolicyExists,
    leavePolicy.updateLeavePolicy,
    (request, response) => {
        return apiResponse.successResponse(response, 'Leave policy updated successfully!')
    }
)

// activaate/deactivate policy
router.post('/active/deactivate',
    celebrate(validation.activateDeactivatePolicy),
    auth.isAuth,
    user.isUserValid,
    leavePolicy.isPolicyExists,
    leavePolicy.activeDeactivatePolicy,
    (request, response) => {
        return apiResponse.successResponse(response, `Leave policy ${request.body.isActive?'Activated':'Deactivated'}  successfully!`)
    }
)


export default router