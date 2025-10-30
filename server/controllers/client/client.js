import * as clientModel from '../../models/client/client.js'
import * as apiResponse  from '../../helper/apiResponse.js'
import { logger } from '../../helper/logger.js'
import { isValidMobileNumber } from '../../helper/validator.js';
import * as orgModel from '../../models/organization/organization.js';
import * as userModel from '../../models/user/user.js';
import * as designationModel from "../../models/designation/designation.js"
import * as helper from '../../helper/formatting.js';
import * as branch from '../branch/branch.js';
import * as branchModel from '../../models/branch/branch.js';
import * as shiftModel from '../../models/shift/shift.js';
import { ObjectId } from 'mongodb';
import * as globalModel from '../../models/globle/globle.js';
import { create } from '../../helper/mongo.js';

export const isClientExist = async(request, response, next) => {
    try{
        if(!request.body.clientId && !request.body.clientMappedId )return next()
        clientModel.isClientExist(request.body).then(res => { 
            if (res.status&&(request.body.clientCheckIn || request.body.teamAttendance || request.body.extendAttendance)) {
                request.body.clientData = res.data
                request.body.clientId = res.data.clientId
                request.body.clientMappedId = res.data._id
                return next()
            }  // if client not exist then next
            if (res.status) return apiResponse.ErrorResponse(response, "Client already exist!")
            return next()
        }).catch(error => {
            logger.error("Error mapClient in client controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })

    }
    catch(error){
        logger.error("Error while isClientExist in client controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const mapClient = async (request, response, next) => {
    try{
        clientModel.mapClient(request.body).then(res => { 
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to map client!")
            request.body.clientData = res.data
            return next()
        }).catch(error => {
            logger.error("Error mapClient in client controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    }
    catch(error){
        logger.error("Error while mapClient in client controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const addClient = async (request, response, next) => {
    try
    {
        // Validate mobile number if provided
        if (request.mobile) 
        {
            if (request.mobile === "" || !isValidMobileNumber(request.mobile)) 
            {
                return apiResponse.notFoundResponse(response, "Please enter a valid mobile number");
            }
        }

        clientModel.addClient(request.body).then(res => { 
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to add client!")
            request.body.clientData = res.data
            return next()
        }).catch(error => {
            logger.error("Error addClient in client controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error addClient in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

//Get client data by id
export const getClient = async (request,response,next) => {
    try{
        if(!request.body.clientId) return apiResponse.validationError(response, 'clientId is required.') 
       
        clientModel.getOneClient(request.body).then(res => {
            if(!res.status)
            {
                // return apiResponse.unauthorizedResponse(response, "Unauthorized")
                return apiResponse.notFoundResponse(response,'client data not found')
                
            }
            logger.debug(JSON.stringify(res));
            request.body.clientDetails = res.data;
            return next();
        }).catch(error => {
            logger.error("Error while getOneClient in client controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        request.logger.error("Error while getOneClient in client controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)    
    }
};

export const getOwner = async (request,response,next) => {
    try{
        if(!request.body.clientId) return apiResponse.validationError(response, 'clientId is required.') 
       
        userModel.getUserByClientOrg(request.body).then(res => {
            if(!res.status)
            {
                // return apiResponse.unauthorizedResponse(response, "Unauthorized")
                return apiResponse.notFoundResponse(response,'client data not found')
                
            }
            logger.debug(JSON.stringify(res));
            request.body.clientDetails = res.data;
            return next();
        }).catch(error => {
            logger.error("Error while getOneClient in client controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        request.logger.error("Error while getOneClient in client controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)    
    }
};

//Update client details
export const   updateClientDetails = async (request, response, next) => {
    try 
    {
         // Validate mobile number if provided
         if (request.mobile) 
        {
            if (request.mobile === "" || !isValidMobileNumber(request.mobile)) {
                return apiResponse.notFoundResponse(response, "Please enter a valid mobile number");
            }
        }
        const clientDetails = await clientModel.updateClient(request.body, request.params)
        if (!clientDetails.status) throw {}
        return apiResponse.successResponse(response, "Client details Updated successfully.")
    } catch (error) {
        console.log(error)
        console.log(error.message, "error.message")
        return apiResponse.ErrorResponse(response, error.message ?? "Failed to upadte client details.")
    }
}

//Client List
export const getClientList = async (request, response, next) => {
    try {
        request.body.query = request.body;
        const client = await clientModel.getClient(request.body)
        if (!client.status)  return apiResponse.ErrorResponse(response,"Something went worng",res.error);
        request.body.clientData = client
        return next()

    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Failed to get client List")
    }
}

export const getClientWithBranchAndFieldOfficer  = async (request, response, next) => {
    try {
        request.body.query = request.body;
        const client = await clientModel.getClientWithBranchAndFieldOfficer(request.body)
        if (!client.status)  return apiResponse.ErrorResponse(response,"Something went worng",res.error);
        request.body.clientData = client
        return next()

    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Failed to get client List")
    }
}


//Update client status 
export const updateClientStatus = async (request, response, next) => {
    try {
        if(request.body.status == undefined || request.body.status == null) return apiResponse.validationError(response, 'status is required.')
        const clientDetails = await clientModel.updateClientStatus(request.body)
        if (!clientDetails.status) throw {}
        return apiResponse.successResponse(response, `Client ${request.body.status == false ? 'Deacticvated' : 'Activated'} successfully`)
    } catch (error) {
        console.log(error)
        return apiResponse.ErrorResponse(response, "Failed to delete client")
    }
}

//update client organization
export const updateClientOrganization=(request,response,next)=>{
    try{
        clientModel.updateClientOrganization(request.body)
        .then(res=>{
            if(res.status){
                return next()
            }
            return apiResponse.validationError(response,'failed to update')
        })
        .catch(error=>{
            logger.error("Error while updateClientOrganization in client controller ",{ stack: error.stack });
            return apiResponse.ErrorResponse(response, error?.message || "Failed to updateClientOrganization")
        })

    }catch (error) {
        logger.error("Error while updateClientOrganization in client controller ",{ stack: error.stack });
        return apiResponse.ErrorResponse(response, error?.message ||"Failed to updateClientOrganization")
    }
}

// get client  details
export const isClientOrg=(request,response,next)=>{
    try{
        if(!request.body.clientId)return next()
        clientModel.isClient(request.body)
        .then(res=>{
            if(res.status){
                request.body.clientData=res.data
                return next()
            }
            return apiResponse.notFoundResponse(response,"client  details not found")

        })
        .catch(error=>{
            logger.error("Error while isClientOrg in client controller ",{ stack: error.stack });
            return apiResponse.ErrorResponse(response, error?.message )
        })

    }catch (error) {
        logger.error("Error while updateClientOrganization in client controller ",{ stack: error.stack });
        return apiResponse.ErrorResponse(response, error?.message )
    }
}

// check isClientOwner
export const isClientOwner=(request,response,next)=>{
    try{
        clientModel.isClientOwner(request.body)
        .then(res=>{
            if(res.status){
                request.body.existingOwner=res.data
                if(request.body._id) return next() // this _id for edit client
                return apiResponse.validationError(response,"client owner already registered")
            }
            // if(request.body._id) return apiResponse.notFoundResponse(response,"client owner data not found")
            return next()
            // return apiResponse.validationError(response,"client owner details not found")

        })
        .catch(error=>{
            logger.error("Error while isClientOwner in client controller ",{ stack: error.stack });
            return apiResponse.ErrorResponse(response, error?.message || "Failed to updateClientOwner")
        })

    }catch (error) {
        logger.error("Error while isClientOwner in client controller ",{ stack: error.stack });
        return apiResponse.ErrorResponse(response, error?.message)
    }
}

// update client owner
export const updateClientOwner=(request,response,next)=>{
    try{
        if(!request.body._id)return next()
        clientModel.updateClientOwner(request.body)
        .then(res=>{
            if(res.status){

                return next()
            }
            return apiResponse.validationError(response,"Failed to update")

        })
        .catch(error=>{
            logger.error("Error while updateClientOwner in client controller ",{ stack: error.stack });
            return apiResponse.ErrorResponse(response, error?.message || "Failed to updateClientOwner")
        })

    }catch (error) {
        logger.error("Error while updateClientOwner in client controller ",{ stack: error.stack });
        return apiResponse.ErrorResponse(response, error?.message ||"Failed to updateClientOwner")
    }
}

// get client list wth owner
export const getClientOwner=async(request,response,next)=>{
    try{
        clientModel.getClientOwner(request.body)
        .then(res=>{
            if(res.status){
                // request.body.owner=res.data
                // const data=helper.mergeClientOrgContacts(request.body.clientData,request.body.contacts)
                // request.body.result={...request.body.clientData,owner:request.body.owner}
                request.body.result=res.data
                return next()
            }
            return apiResponse.notFoundResponse(response,"No Data found")
      

        })
        .catch(error=>{
            logger.error("Error while getClientContacts in client controller ",{ stack: error.stack });
            return apiResponse.ErrorResponse(response, error?.message )
        })

    }catch (error) {
        logger.error("Error while getClientContacts in client controller ",{ stack: error.stack });
        return apiResponse.ErrorResponse(response, error?.message )
    }
}


// get client kyc
export const getClientKYC=(request,response,next)=>{
    try{
        clientModel.getClientKYC(request.body)
        .then(res=>{
            if(res.status&& res.data.length==1){
                request.body.clientKyc=res.data[0]
                return next()
            }
            return apiResponse.validationError(response,"client kyc details not found")

        })
        .catch(error=>{
            logger.error("Error while getClientKYC in client controller ",{ stack: error.stack });
            return apiResponse.ErrorResponse(response, error?.message )
        })


    }catch (error) {
        logger.error("Error while getClientKYC in client controller ",{ stack: error.stack });
        return apiResponse.ErrorResponse(response, error?.message )
    }
}

export const isClient = async (request,response,next) => {
    try{
        if(!request.body.clientId && !request.body.clientMappedId) return next() 
       
        clientModel.getOneClient(request.body).then(res => {
            if(!res.status)
            {
                // return apiResponse.unauthorizedResponse(response, "Unauthorized")
                return apiResponse.notFoundResponse(response,'client data not found')
                
            }
            // logger.debug(JSON.stringify(res));
            request.body.clientDetails = res.data;
            return next();
        }).catch(error => {
            logger.error("Error while isClient in client controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        request.logger.error("Error while isClient in client controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)    
    }
};

export const isMultipleClientValid = async (request,response,next) => {
    try{
        if(!request.body.clientMappedId || !request.body.clientMappedId?.length) return apiResponse.validationError(response, "Please add clients!")
       
        clientModel.isMultipleClientValid(request.body).then(res => {
            if(!res.status || res.data.length != request.body.clientMappedId.length) return apiResponse.validationError(response, "Invalid Clients!")

            // logger.debug(JSON.stringify(res));
            request.body.clientDetails = res.data;
            request.body.clientIds = request.body.clientDetails.reduce((acc, obj) => {
                acc[obj.clientId?.toString()] = []
                return acc
            }, {})
            return next();
        }).catch(error => {
            logger.error("Error while isClient in client controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)  
        })
    }catch(error){
        request.logger.error("Error while isClient in client controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)    
    }
};


export const createMissingOrgTypes = async (request, response, next) => {
    try {
        // extract keys orgbusiness type Id
        if(!request.body.excelData || !request.body.excelData.validData) return apiResponse.validationError(response, 'No data found in excel to add client organization');
        
        request.body.existOrgType={}
        request.body.orgTypes.forEach(element => {
            request.body.existOrgType[element.name] = element._id;
        });

        const clientOrgType=request.body.excelData.validData.filter(row=>!request.body.existOrgType[row.businessType.trim()]).map(row=>row.businessType.trim())
        if (clientOrgType.length > 0) {
            let res = await globalModel.createOrgType({orgType:clientOrgType})
            if(res.status && res.data && Array.isArray(res.data) && res.data.length > 0) {
                res.data.forEach(org => {
                    request.body.existOrgType[org.name]=org._id;
                });
            }
        }
        return next()
    } catch (error) {
        request.logger.error("Error while createClientOrg in client controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)    
    }
}

export const initateRecords = async (request, response, next) => {
    try {

        request.body.excelReords = {
            new:request.body.excelData.validData || [],
            duplicateOrg:[],
            duplicateClientOwner:[],
            count:0
        }

        return next()
    } catch (error) {
        request.logger.error("Error while validateOrg in client controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)    
    }
}

export const createClientOwner = async (request, response, next) => {
    try {
        let existingOwnerKeySet = new Set(); 
        if(request.body.excelReords.new.length>=1){
            const clientOwnerData=request.body.excelReords.new.map(row => ({
                mobile: row.mobile.toString().trim(),
            }));

            const clientOwnerExisting=await userModel.getUserbyMobile({...request.body,clientOwnerData,multiple:true})
            if (clientOwnerExisting.status && Array.isArray(clientOwnerExisting.data)) {
                existingOwnerKeySet = new Set(
                  clientOwnerExisting.data.map(r => `${r.mobile}`)
                );
            }

            const newClientOwnerRecords = [];

            for (const row of request.body.excelReords.new) {
                const key = `${row.mobile}`;
                const alreadyExists = existingOwnerKeySet.has(key);

                if (alreadyExists) {
                    const isOrgValid = row['status'] === 'valid Data';
                    request.body.excelReords.duplicateClientOwner.push({
                        ...row,
                        // status: isOrgValid ? 'mobile already existed' : 'organization and mobile already existed'
                        status:'mobile already existed'
                    });
                } else {
                    newClientOwnerRecords.push({
                        ...row
                        // status: row['status'] === 'valid Data' ? 'valid Data' : row['status']
                    });
                }
            }
            if (newClientOwnerRecords.length > 0) {
                // Group data by organization + mobile
                const groupedByOrgUser = {};
            
                for (const item of newClientOwnerRecords) {
                    const key = `${item.name}-${item.mobile}`;
                    if (!groupedByOrgUser[key]) {
                        groupedByOrgUser[key] = {
                            orgInfo: item,
                            branches: []
                        };
                    }
                    groupedByOrgUser[key].branches.push(item);
                }
                request.body.excelReords.count=newClientOwnerRecords.length
            
                for (const key in groupedByOrgUser) {
                    const { orgInfo, branches } = groupedByOrgUser[key];
            
                    try {
                        const result = await orgModel.addOrganization({
                            ...request.body,
                            // orgTypeId: "68395dbe99d4a7849eb57202",
                            orgTypeId: request.body.existOrgType[orgInfo.businessType] || null,
                            name: orgInfo.name,
                            panNo: orgInfo.panNo,
                            gstNo: orgInfo.gstNo
                        });
            
                        const clientId = result.data.insertedId;
                        let orgIndex = request.body.excelReords.new.findIndex((item) => item.name === orgInfo.name && item.mobile === orgInfo.mobile);
                        request.body.excelReords.new[orgIndex].clientId = clientId;
                        const mapClientData = await clientModel.mapClient({
                            ...request.body,
                            clientId,
                            name: orgInfo.name
                        });
            
                        await userModel.createUser({
                            name: orgInfo.ownerName,
                            mobile: orgInfo.mobile.toString().trim(),
                            clientId
                        });
            
                        if (mapClientData.status) {
                            for (const branch of branches) {
                                const branchData = {
                                    orgId: new ObjectId(mapClientData.data.insertedId),
                                    name: branch.branchName,
                                    noOfShifts: branch.NoOfShifts,
                                    noOfMaleSupervisors: branch.noOfMaleSupervisors,
                                    noOfFemaleSupervisors: branch.noOfFemaleSupervisors,
                                    noOfMaleGuards: branch.noOfMaleGuards,
                                    noOfFemaleGuards: branch.noOfFemaleGuards,
                                    dutyPoint: branch.dutyPoint,
                                    checkPoint: branch.checkPoint,
                                    address: branch.address,
                                    isActive: true,
                                    createdDate: new Date(),
                                    client: true,
                                    createdBy: new ObjectId(request.body.userId)
                                };
            
                                await branchModel.addBranch({ branchData });
                            }
                        }
                    } catch (error) {
                        request.logger.error("Error while insert in db of client excel in client controller ", { stack: error.stack });
                        throw error;
                    }
                }

            }
            next()
            if (request.body.excelReords.duplicateClientOwner.length >=1 ) {
                const clientExcelFormatData = await helper.clientResponseExcelFormat([...request.body.excelReords.duplicateClientOwner,...request.body.excelData.inValidData,...request.body.excelData.duplicates])
                return apiResponse.validationErrorWithData(response, `failed to add ${request.body.excelReords.duplicateClientOwner.length +
                    request.body.excelData.inValidData.length
                    } invalid data ${request.body.excelReords.count > 0 ? ` and ${request.body.excelReords.count} valid data added` : ''}`, clientExcelFormatData)
            }

            if (request.body.excelReords.duplicateClientOwner.length >=1 || request.body.excelData.inValidData.length>=1) {
                const clientExcelFormatData = await helper.clientResponseExcelFormat([
                    ...request.body.excelReords.duplicateClientOwner,
                    ...request.body.excelData.inValidData,
                    ...request.body.excelData.duplicates
                ])

                return apiResponse.validationErrorWithData(response, `failed to add ${request.body.excelReords.duplicateClientOwner.length +
                    request.body.excelData.inValidData.length
                    } invalid data ${request.body.excelReords.count > 0 ? ` and ${request.body.excelReords.count} valid data added` : ''}`, clientExcelFormatData)
            }
        
            
            return apiResponse.successResponseWithData(response,'Data added successfully') 
                
        }
    } catch (error) {
        request.logger.error("Error while createClientOwner in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const createClientShifts = async (request, response, next) => {
    try {
        if (request.body.excelReords && request.body.excelReords.new && request.body.excelReords.new.length >= 1) {

            console.log("-------------Client Shifts-------------");
            console.log(JSON.stringify(request.body.excelReords.new));
            console.log("---------------------------------------");
            
            if (request.body.excelReords.new.length >1){
                const result = await shiftModel.createClientDefaultShifts({ ...request.body ,clientShifts:request.body.excelReords.new });
                if (result.status) {
                    console.log("Client shifts created successfully");
                }
            }
        }
    } catch (error) {
        console.log("Error while createClientShifts in client controller ", error);

    }
}
// import client in excel and upload
export const decodeClientExcel = async (request, response, next) => {
    try {
        const {employExtractData=[],inValidData=[],duplicates=[]} = await helper.extractImportClientExcel(request,response,next)
        const validData=employExtractData
        if(validData.length<1 && duplicates.length>0){
            const result=await helper.clientResponseExcelFormat(duplicates)
            return apiResponse.validationErrorWithData(response,'failed to Add',result)
        }

        if(validData.length<1 && inValidData.length>0){
            const result= await helper.clientResponseExcelFormat(inValidData)
            return apiResponse.validationErrorWithData(response,'failed to Add',result)
        }
        
        if(validData.length<1){
            return apiResponse.validationError(response,'No Data in excel,provide Data')
        }
        
        request.body.excelData = {
            validData,
            inValidData,
            duplicates
        }

        return next()
        
        // if(duplicateOrgData.length>=1){
        //     const clientExcelFormatData=await helper.clientResponseExcelFormat([...duplicateOrgData,...inValidData,...duplicates])
        //     return apiResponse.validationErrorWithData(response,'Data failed to add',clientExcelFormatData) 
        // }


          
    } catch (error) {
        request.logger.error("Error while importclientExcel in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

// get client excel format
export const getclientExcelFormat=async(request,response,next)=>{
    try{
        const clientExcelFormatData=await helper.clientExcelFormat(request.body)
        if(clientExcelFormatData.status){
            request.body.filePath=clientExcelFormatData.data
            return next()
        }
        return apiResponse.ErrorResponse(response,'unable to import')

    }catch (error) {
        request.logger.error("Error while clientExcelFormat in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getIdBasedClient=async(request,response,next)=>{
    try{
        const clientResponse = await clientModel.getIdBasedClient(request.body)
        if(clientResponse.status){
            request.body.clientDetails = clientResponse.data
            return next()
        }
        return apiResponse.ErrorResponse(response,'invalid client Id')

    }catch (error) {
        request.logger.error("Error while clientExcelFormat in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const findClientData = async (request, response, next) => {
    try {
        if(request.body.extractedData?.clientId?.length > 0) {
            let clientId = request.body.extractedData.clientId
            let clientMappedId = request.body.extractedData.clientMappedId
            let clientBranchId = request.body.extractedData.clientBranchId
            clientModel.getClientByIds({ clientId, clientMappedId, clientBranchId , user: request.body.user}).then(res => {
                if(res.data?.length > 0) {
                    if(!request.body["extractedProcessedData"]) request.body.extractedProcessedData = {}
                    request.body.extractedProcessedData["clientId"] = {}
                    res.data.forEach(client => {
                        console.log(client);
                        if(!request.body.extractedProcessedData["clientId"][client._id.toString()]){
                            request.body.extractedProcessedData["clientId"][client._id.toString()] = {
                                clientMappedId: client._id,
                                clientId: client.matchedOrganization._id,
                                name: client.matchedOrganization.name,
                            }
                        }
                        
                        if(client.matchedBranches && client.matchedBranches._id) {
                            if (!request.body.extractedProcessedData["clientId"][client._id.toString()]["branch"]) request.body.extractedProcessedData["clientId"][client._id.toString()]["branch"] = {}
                            request.body.extractedProcessedData["clientId"][client._id.toString()]["branch"][client.matchedBranches._id] = {
                                name: client.matchedBranches.name,
                            }
                        }
                        
                    })
                    return next()
                }else return next()
            }).catch(error => {
                request.logger.error("Error while findUserData in user controller ", { stack: error.stack });
                return apiResponse.somethingResponse(response, error.message)
            })
        } else return next()
    } catch (error) {
        logger.error("Error while findClientData in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
}

// get clinet
export const getClientIds = (request, response, next) => {
    try {
        clientModel.getClientIds(request.body).then(res => {
            if (res.status) {
                request.body.clientIds = res.data;
                return next()
            }
            else throw {}
        }).catch(error => {
            request.logger.error("Error while getClientByIds in client controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while getClientByIds in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

//activate or deactivate client 
export const activateOrDeactivateClient = (request, response, next) => {
    try {
        clientModel.activateOrDeactiveClient(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "Something went wrong", res.error);
            return next()
        }).catch(error => {
            logger.error("Error while activateOrDeactivateClient in client  controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        logger.error("Error while activateOrDeactivateClient in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const clientCount = (request, response, next) => {
      try {
            request.body.modules = ["client"];
            // const checkModules = request?.body?.modules?.some(d => d === 'client');
            const checkModules=request?.body?.assignedModules?.some(d=>d?.name?.toLowerCase()==="client")
            if(checkModules)
            {
            clientModel.clientCount(request.body).then(res => {
                if (!res.status) throw {}
                request.body.clientDetails = res.data
                return next()
            }).catch(error => {
                request.logger.error("Error while userClientCount in user controller ", { stack: error.stack });
                return apiResponse.somethingResponse(response, error.message)
            })
        }
        else{
           return next()
        }
       
    } catch (error) {
        logger.error("Error while activateOrDeactivateClient in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const prepareImportData = (request, response, next) => {
  try {
    const importData = helper.prepareImportData(request)
    request.body.importData = importData;
    next();
  } catch (error) {
    logger.error("Error while importing client from excel", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
};

export const addClientComplete = async (request, response, next) => {

  const createOrganization = async (client) => {
    request.body.name = client.clientName;
    request.body.clientSince = client.contractStartDate;

    const orgDetails = await orgModel.addOrganization(request.body);
    if (!orgDetails.status) throw new Error(orgDetails.message);
    return orgDetails;
  };

  const mapClient = async () => {
    request.body.clientId = request.body.clientOrgDetails.data.insertedId;
    const mapData = await clientModel.mapClient(request.body);
    if (!mapData.status) throw new Error("Unable to map client!");
    return mapData.data;
  };

  const createOwner = async (client) => {
    request.body.mobile = client.incharge.mobile;
    request.body.name = client.incharge.name;
    request.body.relationshipToOrg = client.incharge.designation;

    const insertedUser = await userModel.createUser(request.body);
    if (!insertedUser.status) throw new Error(insertedUser.message);

    return insertedUser.data.insertedId;
  };

  const createBranch = async (branch) => {
    const branchData = {
      orgId: new ObjectId(request.body.clientMappedId),
      client: true,
      name: branch.name,
      isActive: true,
      createdDate: new Date(),
      createdBy: new ObjectId(request.body.userId),
      gstNo: branch.gstNo,
      panNo: branch.panNo,
      address: {
        address: branch.address,
        state: branch.state,
        city: branch.city,
        pincode: branch.pincode,
      },
      radius: 500,
    };

    request.body.branchData = branchData;
    const branchDetails = await branchModel.addBranch(request.body);
    if (!branchDetails.status) throw new Error("Failed to create branch");
    return branchDetails.data.insertedId;
  };

  const createRequirements = async (
    shiftId,
    requirements,
    clientOrgId,
    clientMappedId,
    branchId
  ) => {
    if (!requirements) return;

    const requirementPayload = [];

    for (let designationName in requirements) {
      const genders = requirements[designationName];
      for (let gender in genders) {
        const count = genders[gender];
        if (count > 0) {
          const { data: designation } = await designationModel.getDesignationByName(
            designationName,
            request.body.authUser.orgId
          );

          requirementPayload.push({
            shiftId,
            designationId: designation._id,
            gender,
            count,
          });
        }
      }
    }

    if (requirementPayload.length > 0) {
      const requirementData = {
        clientId: clientOrgId,
        clientMappedId,
        branchId,
        requirements: requirementPayload,
      };

      const requirementRes = await branchModel.addRequirements(requirementData);
      if (!requirementRes.status) throw new Error("Failed to add requirements");
    }
  };

  const createShifts = async (
    branchId,
    branch,
    clientOrgId,
    clientMappedId
  ) => {
    const shifts = branch.shifts || [];

    for (let shift of shifts) {
      request.body.branchIds = [branchId];
      request.body.name = shift.name;
      request.body.startTime = shift.startTime;
      request.body.endTime = shift.endTime;
      request.body.bgColor = null;
      request.body.textColor = null;

      const shiftData = await shiftModel.createShift(request.body);
      if (!shiftData.status) throw new Error("Failed to create shift");

      const shiftId = shiftData.data.insertedIds["0"];
      await createRequirements(
        shiftId,
        shift.requirements,
        clientOrgId,
        clientMappedId,
        branchId
      );
    }
  };

  try {
    const clients = request.body.importData || [];
    if (!clients.length)
      return apiResponse.ErrorResponse(response, "No client data provided");

    for (const client of clients) {
      // create client org
      const orgDetails = await createOrganization(client);
      request.body.clientOrgDetails = orgDetails;

      // map client
      const clientData = await mapClient();
      request.body.clientData = clientData;

      // create owner
      const userId = await createOwner(client);
      request.body.userId = userId;

      // create branches + shifts + requirements
      const branches = client.branches || [];
      for (let branch of branches) {
        request.body.clientMappedId = clientData.insertedId;
        const branchId = await createBranch(branch);
        await createShifts(
          branchId,
          branch,
          orgDetails.data.insertedId,
          clientData.insertedId
        );
      }
    }

    next();
  } catch (error) {
    logger.error("Error while importing client from excel", {
      stack: error.stack,
    });
    return apiResponse.somethingResponse(response, error.message);
  }
};