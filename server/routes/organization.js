import { Router } from 'express';
import * as auth from '../controllers/auth/auth.js';
import * as user from '../controllers/user/user.js';
import * as org from '../controllers/organization/organization.js';
import * as branch from '../controllers/branch/branch.js'
import * as assignment from '../controllers/assignment/assignment.js'
import * as apiResponse  from '../helper/apiResponse.js';
import { celebrate } from 'celebrate';
import {validation} from '../helper/validationSchema.js';
import * as department from '../controllers/department/department.js';
import * as designation from '../controllers/designation/designation.js';
import * as shift from '../controllers/shift/shift.js';
import * as subscription from '../controllers/subscription/subscription.js';
import * as salary from '../controllers/salary/salary.js'
const router = Router(); 

router.use((request,response,next)=>{
    console.log('\norganization middleware');
    console.log(request.originalUrl)
    //request.body.endpoint = request.originalUrl
    console.log('-------------------------------------------------------');
    return next();
 })


router.post('/add/group',
    celebrate(validation.addGroup),
    auth.isAuth,
    user.isUserValid,
    org.isOrgExist,
    org.addOrgStructureParameters,
    org.addOrganization,
    org.addSubOrganization,
    department.addDefaultDepartments,
    designation.addDefaultDesignations,
    shift.AddDefaultShifts,
    salary.addDefaultSalaryComponents,

    (request, response, next) => {
        return apiResponse.successResponse(response, "Group Added successfully")
    }
)

router.post('/add',
    celebrate(validation.createOrg),
    auth.isAuth,
    user.isUserValid,
    org.isOrgExist,
    org.addOrgStructureParameters,
    org.addOrganization, 
    // user.mapOrganization,
    // org.addSubOrganization, // add sub organization default when add org
    branch.addDefaultBranch, // add default branch
    department.addDefaultDepartments,
    designation.addDefaultDesignations,
    shift.AddDefaultShifts,
    salary.addDefaultSalaryComponents,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Organization Added successfully")
    }
)

router.post('/wizard/add',
    // celebrate(validation.addGroup),
    (request, response, next) => {
        request.body.wizardAdd = true // in wizard flow sub org will be true
        return next();
    },
    auth.isAuth,
    user.isUserValid,
    org.isOrgExist,
    org.updateOrgDetails,
    org.addSubOrganization,
    department.addDefaultDepartments,
    designation.addDefaultDesignations,
    // shift.AddDefaultShifts,
    salary.addDefaultSalaryComponents,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Organization and Branch Details Added successfully")
    }
)

router.post(
    "/get",
    // celebrate(validation.updateOrg),
    auth.isAuth,
    user.isUserValid,
    assignment.getAssignment,
    org.getOrgList,
    (request,response) => {
        return apiResponse.responseWithPagination(response,"Found sucessfully",request.body.orgDetails)
    }
);

router.post(
    "/update",
    celebrate(validation.updateOrg),
    (request,response,next) => {
        request.body.updateOrg = true // to identify update org details
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    org.isOrgExist,
    org.isSubOrgExist,
    org.addSubOrganization,
    org.updateOrgDetails,
    (request,response) => {
        return apiResponse.successResponse(response,"Updated successfully")
    }
)

router.post(
    "/update/structure",
    // celebrate(validation.updateOrg),
    (request,response,next) => {
        request.body.updateOrg = true // to identify update org structure
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    org.isOrgExist,
    org.isSubOrgExist,
    org.addOrgStructureParameters,
    org.updateOrgDetails,
    (request,response) => {
        return apiResponse.successResponse(response,"Updated successfully")
    }
)

router.post(
    "/structure/get",
    auth.isAuth,
    user.isUserValid,  
    user.getAdminUser,
    subscription.getActiveFeatures,
    org.getOrgStructure,
    (request,response) => {
        return apiResponse.successResponseWithData(response,"Structure Found successfully",request.body.structureOrg)
    }
)

router.post(
    "/get/details",
    auth.isAuth,
    user.isUserValid, 
    org.isOrgExist,
    (request,response) => {
        return apiResponse.successResponseWithData(response,"Org Details Found successfully",request.body.orgDetails)
    }
)
export default router;


