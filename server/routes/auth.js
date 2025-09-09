import { Router } from "express";
const router = Router();

import * as auth from "../controllers/auth/auth.js";
import * as user from "../controllers/user/user.js";
import * as apiResponse from "../helper/apiResponse.js";
import * as roles from "../controllers/access/role.js";
import * as modules from "../controllers/modules/modules.js";
import * as org from "../controllers/organization/organization.js";
import * as branch from "../controllers/branch/branch.js";
import * as assignment from "../controllers/assignment/assignment.js";
import * as department from "../controllers/department/department.js";
import * as designation from "../controllers/designation/designation.js";
import * as notification from "../controllers/messages/notification.js";
import { celebrate } from "celebrate";
import { validation } from "../helper/validationSchema.js";
// import * as subscription from '../controllers/subscription/subscription.js';

router.use((request, response, next) => {
    console.log("\nAuth middleware");
    console.log(request.originalUrl);
    //request.body.endpoint = request.originalUrl
    console.log("-------------------------------------------------------");
    return next();
});

router.post(
    "/login",
    // user.isexistAccount,
    // (request, response, next) => {
    //     request.body.verify = true
    //     return next()
    // },
    user.getAuthUser,
    auth.verifyOTP,
    auth.generateAuthToken,
    auth.login,
    roles.getAdminRole,
    user.getUserModules,
    modules.getOwnerModules,
    auth.updateVerfication,
    user.checkDisabledModules,
    modules.format,

    user.isUserValid,
    org.isOrgExist,
    assignment.getSingleAssignment,
    designation.getOneDesignation,
    modules.formatBranchOrgModules,
    notification.updateDeviceToken,
    org.checkPending,
    auth.loginResponse,

    org.isSubOrgExist,
    org.checkSubOrgPending,
    auth.loginResponse,

    branch.getBranchList,
    branch.checkPending,
    auth.loginResponse,

    // assignment.getAssignmentById,

    // department.getDepartmentByOrgId,
    // department.checkPending,
    // auth.loginResponse,
);

router.post(
    "/register",
    celebrate(validation.registration),
    (request, response, next) => {
        request.body.register = true; //check with MasterPortal DB
        return next();
    },

    auth.registerChecks,
    auth.isMobileExist,
    auth.isEmailExist,
    user.updateDetails,
    roles.getAdminRole,
    auth.register,
    auth.sendOTP,
    user.updateOTP,
    (request, response) => {
        return apiResponse.successResponseWithData(
            response,
            "OTP Sent Succesfully ",
            { otp: request.body.otp },
        );
    },
);

router.post(
    "/forgotPassword",
    // need to check user exist or not
    // user.updatePassword
);

router.get("/user/active/list", auth.isAuth, user.getuserActiveList);

router.get("/user/nonActive/list", auth.isAuth, user.getusernonActiveList);

router.post(
    "/verify",
    // auth.registerChecks,
    (request, response, next) => {
        request.body.verify = true;
        return next();
    },
    user.getAuthUser,
    auth.verifyOTP,
    auth.generateAuthToken,
    auth.login,
    roles.getAdminRole,
    user.getUserModules,
    auth.updateVerfication,
    notification.updateDeviceToken,
    (request, response, next) => {
        //next()
        return apiResponse.successResponseWithData(
            response,
            `Registration Successfull`,
            {
                token: request.body.token,
                _id: request.body.authUser._id,
                modules: request.body.assignedModules,
            },
        );
    },
    // subscription.addDefaultPlan
);

router.post(
    "/send/otp",
    user.getOneUser,
    auth.sendOTP,
    user.updateOTP,
    (request, response, next) => {
        return apiResponse.successResponseWithData(
            response,
            "OTP Sent Successfully",
            { otp: request.body.otp },
        );
    },
);

router.post(
    "/reset/password",
    auth.isAuth,
    user.isUserValid,
    auth.resetPwdChecks,
    user.resetPassword,
    (request, response) => {
        return apiResponse.successResponse(
            response,
            "Password has been reset successfully",
        );
    },
);

router.post(
    "/userId/verify",
    auth.isVerifyUserId, // this get userId from production and verify here
    user.isUserValid,
    (request, response) => {
        return apiResponse.successResponseWithData(
            response,
            `Verification Successfull`,
            { user: request.body.user },
        );
    },
);

export default router;
