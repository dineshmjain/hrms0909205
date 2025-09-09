import {  Router } from 'express';
const router = Router();

import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";
import * as user from "../controllers/user/user.js"
import * as designation from "../controllers/designation/designation.js";
import * as assignment from "../controllers/assignment/assignment.js";
import { celebrate } from 'celebrate';
import { validation } from '../helper/validationSchema.js';

router.post(
    "/create",
    (request,response,next)=>{
        if(!request.body.name){
            return apiResponse.validationError(response,"Name is required");
        }
        return next();
    },
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    (request,response,next) => {
        request.body.query = {
            name:request.body.name,
        }
        return next();
    },
    designation.getOneDesignation,
    designation.createDesignation,
    (request,response) => {
        return  apiResponse.successResponse(response, "Designation Added successfully")
    }
);

router.post(
    "/get",
    celebrate(validation.getDepartment),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    assignment.getAssignment,
    designation.getDesignation,
    (request,response) => {
        return  apiResponse.responseWithPagination(response, "Data found successfully",request.body.designation)
    }
);


router.post(
    "/update",
    auth.isAuth,
    (request,response,next) => {
        if(!request.body.designationId) return apiResponse.validationError(response,"designationId is required");
        return next();
    },
    user.isUserValid,
    org.getOrg,
    // (request,response,next) => {
    //     let update = {};
    //     if(request.body.name){
    //         update.name = request.body.name
    //     }
    //     if(request.body.isActive !== undefined){
    //         update.isActive = request.body.isActive;
    //     }
    //     if(request.body.global !== undefined){
    //         update.global = request.body.global;
    //     }//TODO: handle change respective ids.
    //     request.body.update = update;
    //     return next();
    // },
    designation.updateDesignation,
    (request,response) => {
        return  apiResponse.successResponse(response, "Designation updated successfully")
    }
)
export default router;

