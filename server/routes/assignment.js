import {  request, response, Router } from 'express';
const router = Router();

import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";
import * as user from "../controllers/user/user.js"
import * as designation from "../controllers/designation/designation.js";
import * as department from "../controllers/department/department.js";
import * as branch from "../controllers/branch/branch.js";
import * as assignment from "../controllers/assignment/assignment.js";
import { ObjectId } from 'mongodb';
import { celebrate } from 'celebrate';
import { validation } from '../helper/validationSchema.js';



router.post(
    "/department",
    auth.isAuth,
    department.assignmentValidation,
    user.isUserValid,
    org.getOrg,
    assignment.getSingleAssignment,
    (request,response,next) => {
        if(request.body.assignment) return apiResponse.validationError(response,"This department has already assigned to this branch");
        return next();
    },
    department.getOneDepartment,
    (request,response,next) => {
        if(!request.body.department) return apiResponse.notFoundResponse(response,"Department not found.");
        return next();
    },
    branch.getBranchDetails,
    (request,response,next) => {
        if(!request.body.branchDetails.length) return apiResponse.notFoundResponse(response,"Branch not found.");
        return next();
    },
    assignment.assignDepartmentToBranch,
    (request,responce) => {
        return apiResponse.successResponse(responce,"Assigned successfully");
    }
);

router.post(
    "/designation",
    auth.isAuth,
    designation.assignmentValidation,
    user.isUserValid,
    org.getOrg,
    assignment.getSingleAssignment,
    (request,response,next) => {
        if(request.body.assignment) return apiResponse.validationError(response,"This department has already assigned to this branch");
        return next();
    },
    // branch.getBranchDetails,
    // (request,response,next) => {
    //     if(!request.body.branchDetails.length) return apiResponse.notFoundResponse(response,"Branch not found.");
    //     return next();
    // },
    designation.getOneDesignation,
    (request,response,next) => {
        if(!request.body.designation) return apiResponse.notFoundResponse(response,"Designation not found.");
        return next();
    },
    department.getOneDepartment,
    (request,response,next) => {
        
        if(request.body.departmentId && !request.body.department) return apiResponse.notFoundResponse(response,"Department not found.");
        return next();
    },
    assignment.assignDesignation,
    (request,responce) => {
        return apiResponse.successResponse(responce,"Assigned successfully");
    }
);

router.get(
    "/list",
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    assignment.getAssignment,
    (request,response) => {
        return apiResponse.successResponseWithData(response,"Data found successfully",request.body.assignment)
    }
)

router.post('/department/unmap', 
    celebrate(validation.unmapDepartment),
    auth.isAuth, 
    user.isUserValid, 
    assignment.checkingOrganisationId,
    assignment.checkingBranchId,
    assignment.checkingDepartmentId,
    assignment.checkingMappedData, // checking whether it is already mapped or not before map/unmap
    assignment.unmapDepartmentFromBranch
);

router.post('/designation/unmap', 
    celebrate(validation.unmapDesignation),
    auth.isAuth, 
    user.isUserValid, 
    assignment.checkingOrganisationId,
    assignment.checkingBranchId,
    assignment.checkingDepartmentId,
    assignment.checkingDesignationId,
    assignment.checkingMappedData, // checking whether it is already mapped or not before map/unmap
    assignment.unmapDesignationFromBranch
);


// mapping baranch and department designatioon to user
router.post('/dep/desg/user',
    celebrate(validation.mapAllfields),
    auth.isAuth,
    user.isUserValid, // this is validation for admin userId
    assignment.checkingOrganisationId,
    assignment.checkingBranchId,
    assignment.checkingDepartmentId,
    assignment.checkingDesignationId,
    assignment.checkingAllFileds, //all fileds should be in assignmnet collection
    user.isEmployeeUserValid,
    (request,response,next)=>{
        if(!ObjectId.isValid(request.body.assignmentId))return apiResponse.validationError(response,'Unable to Assign branch,department,designation to User')
        request.body.userEmployee['assignmentId']=request.body.assignmentId
        request.body.addParameter=true  // if this parameter true isused in model user.updateEmployeeUserDetails for $set otherwise $unset
        return next()
    },
    user.updateEmployeeUserDetails,
    (request,response)=>{
        return apiResponse.successResponse(response,"Assigned branch,department,designation to User Successfully");
    }

)

//unmap branch,dept,desg to user
router.post('/removed/dept/desg/user',
    celebrate(validation.mapAllfields),
    auth.isAuth,
    user.isUserValid, // this is validation for admin userId
    assignment.checkingOrganisationId,
    assignment.checkingBranchId,
    assignment.checkingDepartmentId,
    assignment.checkingDesignationId,
    assignment.checkingAllFileds, //all fileds should be in assignmnet collection
    user.isEmployeeUserValid,
    (request,response,next)=>{
        if(!ObjectId.isValid(request.body.assignmentId))return apiResponse.validationError(response,'Unable to Assign branch,department,designation to User')
        request.body.userEmployee['assignmentId']=request.body.assignmentId
        request.body.addParameter=false // this parameter used for model user.updateEmployeeUserDetails need to remove  
        return next()
    },
    user.updateEmployeeUserDetails,
    (request,response)=>{
        apiResponse.successResponse(response,"unMapped branch,department,designation from User Successfully");
    }

)

router.post('/suborg/multiple/map',
    (request, response, next) => {
        request.body.hierarchy = 'subOrg'
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    department.isMultipleDepartmentValid,
    designation.isMultipleDesignationValid,
    assignment.destructureCombinations,
    assignment.checkMultipleAssignment,
    assignment.addMultiple,
    (request, response) => {
        return apiResponse.successResponse(response, "Successfully Assigned to Sub Org")
    }
)

router.post('/branch/multiple/map',
    (request, response, next) => {
        request.body.hierarchy = 'branch'
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    department.isMultipleDepartmentValid,
    designation.isMultipleDesignationValid,
    assignment.destructureCombinations,
    assignment.checkMultipleAssignment,
    assignment.addMultiple,
    (request, response) => {
        return apiResponse.successResponse(response, "Successfully Assigned to Branch")
    }
)

router.post('/department/multiple/map',
    (request, response, next) => {
        request.body.hierarchy = 'department'
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    org.isMultipleSubOrgValid,
    branch.isMultipleBranchValid,
    designation.isMultipleDesignationValid,
    assignment.destructureCombinations,
    assignment.checkMultipleAssignment,
    assignment.addMultiple,
    (request, response) => {
        return apiResponse.successResponse(response, "Successfully Assigned to Department")
    }
)

router.post('/designation/multiple/map',
    (request, response, next) => {
        request.body.hierarchy = 'designation'
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    org.isMultipleSubOrgValid,
    branch.isMultipleBranchValid,
    department.isMultipleDepartmentValid,
    assignment.destructureCombinations,
    assignment.checkMultipleAssignment,
    assignment.addMultiple,
    (request, response) => {
        return apiResponse.successResponse(response, "Successfully Assigned to Designation")
    }
)

router.post('/suborg/multiple/un-map',
    (request, response, next) => {
        request.body.hierarchy = "subOrg"
        request.body.unmap = true
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    department.isMultipleDepartmentValid,
    designation.isMultipleDesignationValid,
    assignment.destructureCombinations,
    assignment.checkMultipleAssignment,
    assignment.removeMultiple,
    (request, response) => {
        return apiResponse.successResponse(response, "Successfully Un-Assigned to Sub Organization")
    }
)

router.post('/branch/multiple/un-map',
    (request, response, next) => {
        request.body.hierarchy = "branch"
        request.body.unmap = true
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    department.isMultipleDepartmentValid,
    designation.isMultipleDesignationValid,
    assignment.destructureCombinations,
    assignment.checkMultipleAssignment,
    assignment.removeMultiple,
    (request, response) => {
        return apiResponse.successResponse(response, "Successfully Un-Assigned to Branch")
    }
)

router.post('/department/multiple/un-map',
    (request, response, next) => {
        request.body.hierarchy = "department"
        request.body.unmap = true
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    org.isMultipleSubOrgValid,
    branch.isMultipleBranchValid,
    designation.isMultipleDesignationValid,
    assignment.destructureCombinations,
    assignment.checkMultipleAssignment,
    assignment.removeMultiple,
    (request, response) => {
        return apiResponse.successResponse(response, "Successfully Un-Assigned to Department")
    }
)

router.post('/designation/multiple/un-map',
    (request, response, next) => {
        request.body.hierarchy = "designation"
        request.body.unmap = true
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    org.isMultipleSubOrgValid,
    branch.isMultipleBranchValid,
    department.isMultipleDepartmentValid,
    assignment.destructureCombinations,
    assignment.checkMultipleAssignment,
    assignment.removeMultiple,
    (request, response) => {
        return apiResponse.successResponse(response, "Successfully Un-Assigned to Designation")
    }
)



export default router;