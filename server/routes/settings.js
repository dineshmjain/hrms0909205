import { Router, response } from 'express'
const router = Router();

import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";
import * as user from '../controllers/user/user.js'
import { celebrate } from 'celebrate';
import { validation } from '../helper/validationSchema.js';
import * as settings from '../controllers/settings/settings.js';
import * as client from '../controllers/client/client.js';

// this api for both add and update report time settings
router.post('/client/report/time',
    celebrate(validation.clientReportTimeSettings),
    auth.isAuth,
    user.isUserValid,
    client.isClientOrg, // get client organization
    client.getClient,
    (request,response,next) => {
        request.body.clientmappedId = request.body.clientDetails._id 
        next()
    },
    settings.isClientReportTimeSettingsExist,
    settings.updateClientReportTimeSettings,
    settings.addClientReportTimeSettings,
    (request,response)=>{
        return apiResponse.successResponse(response, 'Client report time settings updated successfully!')
    }
)


router.post('/client/report/time/get',
    celebrate(validation.getClientReportTimeSettings),
    auth.isAuth,
    user.isUserValid,
    client.isClientOrg, // get client organization
    client.getClient,
    (request,response,next) => {
        request.body.clientmappedId = request.body.clientDetails._id 
        next()
    },
    settings.getClientReportTimeSettings,
    (request,response)=>{
        return apiResponse.successResponseWithData(response, 'Client report time settings', request.body.clientReportTimeSettings)
    }
)


// router.post('/client/update/report/time',
//     celebrate(validation.updateClientReportTimeSettings),
//     auth.isAuth,
//     user.isUserValid,
//     client.getClient,
//     client.isClientOrg, // get client organization
//     settings.isClientReportTimeSettingsExist,
//     settings.updateClientReportTimeSettings,
//     (request,response)=>{
//         return apiResponse.successResponse(response, 'Client report time settings updated successfully!')
//     }
// )


export default router;
