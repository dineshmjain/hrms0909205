import { request, response, Router } from 'express';
const router = Router();

import * as apiResponse from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";

import * as user from "../controllers/user/user.js";
import * as client from "../controllers/client/client.js"
import * as modules from '../controllers/modules/modules.js';
import * as branch from "../controllers/branch/branch.js"
router.post(
    "/overall", ((request, response, next) => {
        request.body.role = request.query.role
        return next()
    }),
    auth.isAuth,
    user.isUserValid,
    user.getUserModules,
    user.checkDisabledModules,
    modules.format,
    client.clientCount,
    branch.branchCount,
    user.userCount,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Data fetched successfully", { clients: request.body.clientDetails, branches: request.body?.branchDetails, users: request.body?.userDetails })
    }
);

export default router;