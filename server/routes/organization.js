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
    (request, response, next) => {
        return apiResponse.successResponse(response, "Organization Added successfully")
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
    auth.isAuth,
    user.isUserValid,
    org.isOrgExist,
    org.isSubOrgExist,
    org.updateOrgDetails,
    (request,response) => {
        return apiResponse.successResponse(response,"Updated successfully")
    }
)

export default router;


