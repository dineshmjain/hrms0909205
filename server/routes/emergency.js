import { Router, response } from 'express'
const router = Router();

import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";
import * as user from '../controllers/user/user.js'
import { celebrate } from 'celebrate'
import { validation } from '../helper/validationSchema.js'
import * as emergency from '../controllers/emergency/emergency.js';
import * as client from '../controllers/client/client.js';


router.post('/contacts/add',
    celebrate(validation.addEmergecyContacts),
    auth.isAuth,
    user.isUserValid,
    client.isClientOrg, // get client organization
    client.getClient, // get client details
    (request,response,next) => {
        request.body.clientmappedId = request.body.clientDetails._id 
        next()
    },
    emergency.getEmergencyContactsListCount,
    emergency.addContacts,
    (request,response)=>{
        return apiResponse.successResponse(response, 'Emergency contact added successfully!')
    }
)


router.post('/contacts/list',
    celebrate(validation.getEmergencyContacts),
    auth.isAuth,
    user.isUserValid,
    client.isClientOrg, // get client organization
    client.getClient, // get client details
    (request,response,next) => {
        request.body.clientmappedId = request.body.clientDetails._id 
        next()
    },
    emergency.emergencyContactsList,
    (request,response)=>{
        return apiResponse.successResponseWithData(response, 'Emergency contact list', request.body.emergencyContacts)
    }
)

router.post('/contacts/update',
    celebrate(validation.updateEmergencyContacts),
    auth.isAuth,
    user.isUserValid,
    emergency.isEmergencyContactId, 
    emergency.updateContacts,
    (request,response)=>{
        return apiResponse.successResponse(response, 'Emergency contact updated successfully!')
    }
)


export default router;
