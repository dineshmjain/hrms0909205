import { Router } from 'express';
import * as auth from '../controllers/auth/auth.js'
import * as user from '../controllers/user/user.js';
import * as lead from '../controllers/leads/lead.js';
import * as client from '../controllers/client/client.js'
import * as org from '../controllers/organization/organization.js'
import * as apiResponse from '../helper/apiResponse.js'
import { celebrate } from 'celebrate';
import { validation } from '../helper/validationSchema.js';
import * as branch from '../controllers/branch/branch.js'

const router = Router();

router.use((request, response, next) => {
    console.log('\nLead middleware');
    console.log(request.originalUrl)
    //request.body.endpoint = request.originalUrl
    console.log('-------------------------------------------------------');
    return next();
})

router.post('/create',
    celebrate(validation.addLead),
    auth.isAuth,
    user.isUserValid,
    org.isOrgValid,
    lead.addLead,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Lead Added Successfully")
    }
)

router.post('/get',
    auth.isAuth,
    user.isUserValid,
    lead.getlist,
    (request, response, next) => {
        return apiResponse.successResponseWithData(response, "Lead List Found Successfully", request.body.LeadData)
    }
)

router.post('/get/details',
    celebrate(validation.getLead),
    auth.isAuth,
    user.isUserValid,
    lead.isLeadValid,
    lead.getDetails,
    (request, response, next) => {
        return apiResponse.successResponseWithData(response, "Lead Added Successfully", request.body.LeadDetails)
    }
)

router.post('/update',
    celebrate(validation.updateLead),
    auth.isAuth,
    user.isUserValid,
    lead.isLeadValid,
    lead.update,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Lead Added Successfully")
    }
)

router.post('/kyc/create',
    celebrate(validation.addLeadKyc),
    auth.isAuth,
    user.isUserValid,
    lead.isLeadValid,
    lead.isKYCVerified,
    lead.addLeadKyc,
    lead.updateLeadKycStatus,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Lead KYC Added Successfully")
    }
)

router.post('/kyc/entities/get',
    auth.isAuth,
    user.isUserValid,
    lead.getKYCEntities,
)

router.post('/kyc/update',
    auth.isAuth,
    user.isUserValid,
    lead.isKycDataValid,
    lead.updateKycDetails,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Lead KYC Details updated Successfully")
    }
)



export default router