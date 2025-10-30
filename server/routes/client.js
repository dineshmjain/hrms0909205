import { Router } from 'express';
import * as auth from '../controllers/auth/auth.js'
import * as user from '../controllers/user/user.js';
import * as client from '../controllers/client/client.js'
import * as org from '../controllers/organization/organization.js'
import * as apiResponse from '../helper/apiResponse.js'
import { celebrate } from 'celebrate';
import { validation } from '../helper/validationSchema.js';
import * as branch from '../controllers/branch/branch.js'
import * as global from '../controllers/globle/globle.js'
import clientBranch from './clientBranch.js'
import * as clientBranchController from '../controllers/client/clientBranch.js'
import * as shift from '../controllers/shift/shift.js';


const router = Router();

router.use('/branch',clientBranch)

router.use((request, response, next) => {
    console.log('\nAuth middleware');
    console.log(request.originalUrl)
    //request.body.endpoint = request.originalUrl
    console.log('-------------------------------------------------------');
    return next();
})

//Map client with organization 
router.post('/map',
    celebrate(validation.clientMap),
    auth.isAuth,
    user.isUserValid,
    client.isClientExist,
    client.mapClient,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Client added successfully!", request.body.clientData)
    }
)

router.post('/add',
    celebrate(validation.createClientOrg),
    auth.isAuth,
    user.isUserValid,
    // user.getOneUser,
    // (request,response,next) => {
    //     if (request.body.existingUser) return apiResponse.duplicateResponse(response, "Already exist")
      
    //     delete request.body.existingUser
    //     return next();
    //  },
    // org.isOrgExist,
    org.addClientOrganization,
    // org.addClientSubOrg,
    // user.addUser,
    client.mapClient,
    (request,response,next)=>{
        request.body.isClient=true
        return next()
    },
    shift.AddDefaultShifts,
    // branch.addClientBranch, // add default branch
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Client added successfully!", request.body.clientOrgDetails)
    }
)

router.post('/wizard/add',
    // celebrate(validation.createClientOrg),
    auth.isAuth,
    user.isUserValid,
    // creating client
    (request, response, next) => {
        request.body.name = request.body.client.name;
        request.body.orgTypeId = request.body.client.orgTypeId;
        request.body.clientSince = request.body.client.clientSince;
        delete request.body.client;
        next();
    },
    org.addClientOrganization,
    client.mapClient,
    // create owner
    (request, response, next) => {
        request.body.clientId = request.body.clientOrgDetails.data.insertedId;
        request.body.mobile = request.body.registeredBy.mobile;
        request.body.name = request.body.registeredBy.name;
        request.body.relationshipToOrg = request.body.registeredBy.relationshipToOrg;
        delete request.body.registeredBy;
        next();
    },
    user.addUser,
    // create default branch
    (request, response, next) => {
        request.body.clientMappedId = request.body.clientData.insertedId;
        request.body.name = request.body.branch.name;
        request.body.gstNo = request.body.branch.gstNo;
        request.body.panNo = request.body.branch.panNo;
        request.body.address = request.body.branch.address;
        request.body.geoLocation = request.body.branch.geoLocation;
        request.body.geoJson = request.body.branch.geoJson;
        delete request.body.branch;
        next();
    },
    client.getClient,
    branch.addBranch,
    // assign field officer
    (request, response, next) => {
        request.body.clientBranchIds = [String(request.body.insertedBranchId)];
        request.body.clientMappedId = [request.body.clientMappedId];
        request.body.id = request.body.fieldOfficer.id;
        delete request.body.fieldOfficer;
        console.log(request.body);
        next();
    },
    user.isUpdatingUserValid,
    client.isMultipleClientValid,
    clientBranchController.isMultipleBranchValid,
    user.filterExistingClientIds,
    user.multipleClientMapping,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Client added successfully!", request.body.clientOrgDetails)
    }
)

router.post('/import/excel',
    auth.isAuth,
    user.isUserValid,
    client.decodeClientExcel,
    client.prepareImportData,
    client.addClientComplete,
    (request, response, next) => {
        return apiResponse.successResponseWithData(response,'Clients Imported Successfully',request.body.importData)
    }
)

router.post('/add/owner',
    celebrate(validation.addClientOwner),
    auth.isAuth,
    user.isUserValid,
    client.isClientOrg, // get client organization
    client.isClientOwner,
    user.addUser,
    client.updateClientOwner,
    (request, response) => {
        return apiResponse.successResponse(response, "Client Details updated successfully!")
    }
)

router.post('/get/owner',
    auth.isAuth,
    user.isUserValid,
    client.getOwner,
    (request,response) => {
        return  apiResponse.successResponseWithData(response, "Owner Details", request.body.clientDetails)
    }

)

router.post('/add/fieldOfficer',
    // celebrate(validation.createClientOrg),
    auth.isAuth,
    user.isUserValid,
    // assign field officer
    user.isUpdatingUserValid,
    client.isMultipleClientValid,
    clientBranchController.isMultipleBranchValid,
    user.filterExistingClientIds,
    user.multipleClientMapping,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Field Officer assigned successfully!", request.body.clientOrgDetails)
    }
)

router.post('/add/kyc',
    celebrate(validation.addClientKYC),
    auth.isAuth,
    user.isUserValid,
    client.isClientOrg, // get client organization
    client.updateClientOrganization,
    (request, response) => {
        return apiResponse.successResponse(response, "updated successfully!")
    }
)

//get client by Id
router.post('/get',
    auth.isAuth,
    user.isUserValid,
    client.getClient,
    (request,response) => {
        return  apiResponse.successResponseWithData(response, "Client Details", request.body.clientDetails)
    }

)

//edit 
router.post('/edit',
    celebrate(validation.editClient),
    auth.isAuth,
    user.isUserValid,
    client.getClient,
    // client.updateClientDetails,
    client.isClientOrg, // get client 
    client.updateClientOrganization,
    (request, response) => {
        return apiResponse.successResponse(response, "updated successfully!")
    }

)

//Clients list
router.post('/list',
    auth.isAuth,
    user.isUserValid,
    client.getClientList,
    (request,response) => {
        return  apiResponse.responseWithPagination(response, "Client list",request.body.clientData)
    }
)

router.post('/branch/fieldOfficer/list',
    auth.isAuth,
    user.isUserValid,
    client.getClientWithBranchAndFieldOfficer,
    (request,response) => {
        return  apiResponse.responseWithPagination(response, "Client list",request.body.clientData)
    }
)

// activate or deactivate the client
router.post('/update/status',
    auth.isAuth,
    user.isUserValid,
    client.getClient,
    client.updateClientDetails,
    (request,response) => {
        return  apiResponse.responseWithPagination(response, "Client status updated successfully.",request.body.clientData)
    }
)

router.post('/get/client',

    client.getClient,

    (request,response) => {
        return  apiResponse.successResponseWithData(response, "Client Details", request.body.clientDetails)
    }
   )

router.post('/updateKYC',
    celebrate(validation.updateKYC),
    auth.isAuth,
    user.isUserValid,
    client.getClient,
    client.updateClientDetails,

    (request, response) => {
        return apiResponse.successResponseWithData(response, "Client updated successfully!", request.body.clientData)
    }
)

// get client org and contacts
router.post('/get/owner',
    auth.isAuth,
    user.isUserValid,
    client.isClientOrg,
    client.getClientOwner,
    (request,response) => {
        return  apiResponse.successResponseWithData(response, "Client Owner list",request.body.result)
    }
)

// get client kyc
router.post('/get/kyc',
    auth.isAuth,
    user.isUserValid,
    client.getClientKYC,
    (request,response) => {
        return  apiResponse.successResponseWithData(response, "Data found successfully",request.body.clientKyc)
    }
)

router.post('/edit/owner',
    celebrate(validation.editClientOwner),
    auth.isAuth,
    user.isUserValid,
    client.isClientOrg, // get client organization
    client.isClientOwner,
    client.updateClientOwner,
    (request, response) => {
        return apiResponse.successResponse(response, "Client Owner Details updated successfully!")
    }

)

// import client data in excel and add clients
// router.post('/import/excel',
//     auth.isAuth,
//     user.isUserValid,
//     client.decodeClientExcel,
//     global.listOrgType,
//     client.createMissingOrgTypes, 
//     client.initateRecords, 
//     client.createClientOwner, 
//     client.createClientShifts, 

// )



// get sample client excel
router.get('/excel/format',
    auth.isAuth,
    user.isUserValid,
    client.getclientExcelFormat,
    (request,response,next)=>{
        return apiResponse.successResponseWithData(response,'imported successfully',request.body.filePath)
    }
)

router.post('/user/department/get',
    auth.isAuth,
    user.isUserValid,
    user.getUserBasedDept,
    (request,response,next)=>{
        return apiResponse.successResponseWithData(response,'Departments Found successfully',request.body.departments)
    }
)

router.post('/user/designation/get',
    auth.isAuth,
    user.isUserValid,
    user.getUserBasedDesignation,
    (request,response,next)=>{
        return apiResponse.successResponseWithData(response,'Desgination Found successfully',request.body.designations)
    }
)

router.post('/user/ids/get',
    auth.isAuth,
    user.isUserValid,
    client.getIdBasedClient,
    user.clientBasedUserIds,
    (request,response,next)=>{
        return apiResponse.successResponseWithData(response,'ids Found successfully',request.body.userIds)
    }
)


//activate or deactivate client
router.post('/active/deactivate',
    celebrate(validation.activateDeactivateClient),
    auth.isAuth,
    user.isUserValid,
    client.getClient,
    client.isClientOrg, // get client organization
    client.activateOrDeactivateClient,
    (request,response)=>{
        return apiResponse.successResponse(response, 'Client updated successfully!')
    }
)


export default router