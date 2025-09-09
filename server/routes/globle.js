import {  Router } from 'express';
const router = Router();

import * as apiResponse  from '../helper/apiResponse.js';
import * as global from "../controllers/globle/globle.js";
import { celebrate } from 'celebrate';
import {validation} from '../helper/validationSchema.js';



router.get(
    "/language/list",
    global.getSavedLanguage,
    (request,response) => {
        return  apiResponse.successResponseWithData(response, "Language fetched successfully",request.body.language)
    }
);

router.post('/leave/create',
    global.isLeaveExist,
    global.createGlobalLeave,
    (request,response,next) =>{
        apiResponse.successResponseWithData(response, "Global levae created successfully!", request.body.leave)
    }
)

router.get('/orgType/list',
    global.listOrgType,
    (request,response,next) =>{
        return apiResponse.successResponseWithData(response,"success",request.body.orgTypes);
    }
)

//create address types
router.post('/add/address/type',
    celebrate(validation.addressType),
    global.isAddressTypeExist,
    global.addAddressType,
    (request,response,next) =>{
        apiResponse.successResponseWithData(response, "Address Types created successfully!")
    }
)

// get address types
router.get('/address/type/list',
    global.getAddressType,
    (request,response,next) =>{
        apiResponse.successResponseWithData(response, "Address Types created successfully!",request.body.addressType)
    }
)

export default router;