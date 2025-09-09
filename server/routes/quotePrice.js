import {Router} from 'express';
import * as auth from '../controllers/auth/auth.js';
import * as user from '../controllers/user/user.js';
import * as quote from '../controllers/quotePrice/quotePrice.js';
import * as apiResponse from '../helper/apiResponse.js';
import { celebrate } from 'celebrate';
import { validation } from '../helper/validationSchema.js';

const router = Router();

router.use((request,response,next)=>{
    console.log(request.originalUrl)
    return next();

})

// admin adding quote prices for services
router.post('/add/charges/service',
    celebrate(validation.addQuoteServiceCharge),
    auth.isAuth,
    user.isUserValid,
    quote.existServiceCharges,
    quote.createCharges
)


// api for  quote price get charges 
router.post('/get/service/charges',
    celebrate(validation.getServiceCharge),
    auth.isAuth,
    user.isUserValid,
    quote.getServiceCharges,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Data found successfully!", request.body.response)
    }
)


//api for edit quote price  on service  charge
router.post('/edit/service/charge',
   celebrate(validation.editServiceCharge),
    auth.isAuth,
    user.isUserValid,
    quote.existServiceCharges,
    quote.editServiceCharges,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "updated successfully!")
    }
)



// delete the rule on service charge
router.post('/delete/service/charge',
    celebrate(validation.deleteServiceCharge),
    auth.isAuth,
    user.isUserValid,
    quote.existServiceCharges,
    quote.deleteServiceCharge,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "deleted successfully!")
    }
)


// calculate cost on selected employees along with params skilled ,duration
router.post('/get/service/calculate-cost',
    celebrate(validation.serviceQuotePrice),
    auth.isAuth,
    user.isUserValid,
    quote.existServiceCharges,
    quote.getEmployeesQuotePrice,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Data found successfully!",request.body.response)
    }
)


// Updated API route to process array input
router.post('/get/service/array/calculate-cost',
    celebrate(validation.serviceQuotePriceArray),
    auth.isAuth,
    user.isUserValid,
    quote.existServiceChargesArray,
    quote.getEmployeesQuotePriceArray,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Data found successfully!", request.body.response);
    }
);


export default router;



