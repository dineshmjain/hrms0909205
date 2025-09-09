//packages
import * as express from 'express';
import * as auth from '../controllers/auth/auth.js';
import * as apiResponse from '../helper/apiResponse.js';
import * as user from '../controllers/user/user.js';
import * as task from '../controllers/task/task.js';
import * as branch from '../controllers/branch/branch.js';
import * as client from '../controllers/client/client.js'
import * as clientBranch from '../controllers/client/clientBranch.js'
import {celebrate} from "celebrate";
import { validation } from '../helper/validationSchema.js';
import * as org from "../controllers/organization/organization.js";
import * as assignment from "../controllers/assignment/assignment.js";



const router = express.Router();


router.use((request, response, next) => {
    console.log('\nmessage middleware');
    console.log(request.originalUrl)
    //request.body.endpoint = request.originalUrl
    console.log('-------------------------------------------------------');
    return next();
})

//add branch
router.post('/add',
    celebrate(validation.addClientBranch),
    auth.isAuth,
    user.isUserValid,
    client.getClient,
    // branch.isBranchAlreadyExists,
    branch.addBranch,
    // task.addPatrollingTask,
    (request, response, next) => {
        return apiResponse.successResponse(response, `Client's Branch Created successfully`)
    },

)

//get branch by Id
router.post('/get',
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    branch.getBranchDetailsClient,
    (request,response) => {
        return  apiResponse.successResponseWithData(response, "Branch Details", request.body.branchDetails)
    }

)

//edit branch
router.post('/edit',
    celebrate(validation.updatingBranch),
    auth.isAuth,
    user.isUserValid,
    clientBranch.getBranch,
    branch.editBranch,
    (request, response) => {
            return apiResponse.successResponseWithData(response, "Client Branch details updated successfully!", request.body.clientBranchData)
        }
    

)

//list branches
router.post('/list',
    celebrate(validation.getBranchList),
    auth.isAuth,
    user.isUserValid,
    clientBranch.getBranchList,
    (request,response) => {
        return  apiResponse.responseWithPagination(response, "Branch list", request.body.clientBranchData)
    }
)

//activate or deactivate the branch
router.post('/update/status',
    auth.isAuth,
    user.isUserValid,
    clientBranch.getBranch,
    branch.editBranch,
    (request, response) => {
            return apiResponse.successResponseWithData(response, "Client Branch details updated successfully!", request.body.clientBranchData)
        }
    

)


//activate or deactivate the branch
router.post('/active/deactivate',
    celebrate(validation.activateDeactivateBranch),
    auth.isAuth,
    user.isUserValid,
    clientBranch.isClientBranch,
    clientBranch.activateOrDeactivateClientBranch,
    (request, response) => {
        return apiResponse.successResponseWithData(response, `branch ${request.body.status?'activated':'deactivated'} successfully`, request.body.clientBranchData)
    }
)

export default router