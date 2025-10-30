//packages
import * as express from 'express';
import * as auth from '../controllers/auth/auth.js';
import * as apiResponse from '../helper/apiResponse.js';
import * as user from '../controllers/user/user.js';
import * as branch from '../controllers/branch/branch.js';
import {celebrate} from "celebrate";
import { validation } from '../helper/validationSchema.js';
import * as org from "../controllers/organization/organization.js";
import * as assignment from "../controllers/assignment/assignment.js";
import * as client from '../controllers/client/client.js';
import * as roles from '../controllers/role/role.js';
import * as department from '../controllers/department/department.js';
import * as designation from '../controllers/designation/designation.js';
import * as shift from '../controllers/shift/shift.js';
import * as overtime from '../controllers/overtime/overtime.js';
import * as salary from '../controllers/salary/salary.js';
import * as leavePolicy from '../controllers/leavePolicy/leavePolicy.js';


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
    celebrate(validation.addBranch),
    (request, response, next) => {
        if(request.body.isDefaultOrg) {
            request.body.addSubOrg = false // if defaultOrgCreate is true then addSubOrg should be false (for 1st structure)
            request.body.addBranch = false // if defaultOrgCreate is true then addSubOrg should be false (for 1st structure)
        }
        return next();
    },
    auth.isAuth,
    user.isUserValid,
    org.isOrgExist,
    (request, response, next) => {
        request.body.isFirstBranch=request.body.orgExist===true
        return next()
    },
    branch.getDefaultBranch, // to check default branch exist or not
    org.addOrganization,
    branch.isBranchAlreadyExists,
    client.isClient,
    branch.addBranch,
    // department.addDefaultDepartments,
    // designation.addDefaultDesignations,
    // shift.AddDefaultShifts,
    (request, response, next) => {
        return apiResponse.successResponseWithData(response, `Branch Created successfully`,request.body.branchResponse)
    },

)

//get branch by Id
router.post('/get',
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    branch.getBranchDetails,
    (request,response) => {
        return  apiResponse.successResponseWithData(response, "Branch Details", request.body.branchDetails)
    }

)

//edit branch
router.post('/edit/:branchId',
    celebrate(validation.updatingBranch),
    auth.isAuth,
    user.isUserValid,
    // branch.addChecks,
    branch.checkSubOrgId, //  if edit suborgId need to check suborgId exist under parentorgId or not
    branch.editBranch,

)

//list branches
router.post('/list',
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    user.getAllUsers,
    roles.roleBasedModules,
    roles.checkModulePermission('branch', 'r'),
    assignment.getAssignment,
    branch.getBranchList,
    (request,response) => {
        return  apiResponse.responseWithPagination(response, "Branch found successfully",request.body.branch)
    }
)

//activate or deactivate the branch
router.post('/update/status',
    auth.isAuth,
    user.isUserValid,
    org.isOrgExist,
    branch.updateBranchStatus,

)

router.post('/radius/get',
    celebrate(validation.getBranchRadius),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    branch.getBranchRadius,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Branch Radius fetched successfully", request.body.branchDetails);
    }
)

router.post('/radius/update',
    celebrate(validation.updateBranchRadius),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    branch.isBranchExist,
    branch.updateBranchRadius,
    (request, response) => {
        return apiResponse.successResponse(response, "Branch Radius updated successfully");
    }
)

router.post('/setting/boundary',
    celebrate(validation.updateBranchBoundary),
    auth.isAuth,
    user.isUserValid,
    branch.isBranchExist,
    branch.isBoundaryPointsValid,
    branch.updateBranchBoundary,
    (request, response) => {
        return apiResponse.successResponse(response, "branch boundary  updated successfully");
    }

)

router.post('/default/get',
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    branch.getDefaultBranch,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Default Branch fetched successfully", request.body.branchDetails);
    }
)

router.post('/wizard/add',
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    branch.addDefaultBranch,
    (request, response) => {
        return apiResponse.successResponse(response, "Branch Details Added successfully");
    }
)

router.post('/wizard/get/all',
    (request, response, next) => {
        request.body.wizardGetAllData = true // in wizard flow all data will be true
        return next();
    },
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    branch.getDefaultBranch,
    shift.getShiftList,
    overtime.getOvertimeList,
    leavePolicy.getPolicy,
    salary.listSalaryComponents,
    user.getUserList,
    (request, response, next) => {
        return apiResponse.successResponseWithData(response, "All Details fetched successfully", request.body.allDataRes);
    }
)

router.post('/client/req/get',
    // celebrate(validation.getBranchClientReq),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    branch.getBranchClientReq,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Branch Client Requirement Found successfully", request.body.clientReqDetails);
    }
)
export default router;