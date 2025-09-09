import { Router } from 'express';
import * as auth from '../controllers/auth/auth.js'
import * as user from '../controllers/user/user.js';
import * as lead from '../controllers/leads/lead.js';
import * as meeting from '../controllers/leads/meeting.js'
import * as org from '../controllers/organization/organization.js'
import * as apiResponse from '../helper/apiResponse.js'
import { celebrate } from 'celebrate';
import { validation } from '../helper/validationSchema.js';
import * as branch from '../controllers/branch/branch.js'
import { request } from 'http';

const router = Router();

router.use((request, response, next) => {
    console.log('\nLead Meeting middleware');
    console.log(request.originalUrl)
    //request.body.endpoint = request.originalUrl
    console.log('-------------------------------------------------------');
    return next();
})

router.post('/get',
    auth.isAuth,
    user.isUserValid,
    meeting.getMeetingDetails,
    (request, response) => {
        return apiResponse.successResponseWithData(response, `Lead Meeting Details Found successfully!`, request.body.meetingDetails)
    }
)
router.post('/get/all',
    auth.isAuth,
    user.isUserValid,
    meeting.getList,
    (request, response) => {
        return apiResponse.successResponseWithData(response, `Lead Meeting list Found successfully!`, request.body.LeadData)
    }
)

router.post('/:type', //create and update
    // celebrate(validation.addLeadMeeting),
    (request, response, next) => {
        if (!['create', 'update'].includes(request.params.type)) return apiResponse.validationError(response, "Invalid Params!")
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    lead.isLeadValid,
    meeting.isMeetingIdValid,
    meeting.addLeadMeeting,
    lead.updateStatus,
    (request, response) => {
        return apiResponse.successResponse(response, `Lead Meeting ${request.params.type}d successfully!`)
    }
)

export default router

