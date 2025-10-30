import { ObjectId } from 'mongodb';

//models
import * as orgModel from '../../models/organization/organization.js';
import * as userModel from '../../models/user/user.js'

//helpers
import * as apiResponse from '../../helper/apiResponse.js'
import { getCurrentDateTime } from '../../helper/formatting.js';
import { locationSchema, nameSchema } from '../../helper/joiSchema.js';
import { KafkaService } from '../../utils/kafka/kafka.js'
import { logger } from '../../helper/logger.js';
const kafka = new KafkaService();


export const isOrgExist = async(request, response, next) => {
    try {
        orgModel.isOrgExist(request.body).then(res => {
            if(!res.status) throw {}
            request.body.orgDetails = res.data;
            request.body.orgId = res.data._id;
            if(request.body.wizardAdd || request.body.updateOrg) request.body._id = res.data._id// in wizard flow if org exist then skip this middleware
            request.body.orgExist = true
            return next()
        }).catch(error => {
            // return apiResponse.somethingResponse(response, error.message)
            return next()
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const isOrgValid = async(request, response, next) => {
    try {
        orgModel.isOrgExist(request.body).then(res => {
            if(!res.status) return apiResponse.notFoundResponse(response, "Invalid Organization")
            request.body.orgDetails = res.data;
            request.body.orgExist = true
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, error.message)
            // return next()
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const checkPending = async(request, response, next) => {
    try {
        request.body.pending = {
            organization:false,
            subOrganization:false,
            branch:false,
            // department:false
        }
        if(request.body.orgExist) request.body.pending['organization']=true
        else request.body.sendLoginResponse = true
        return next()
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const addOrganization = async(request, response, next) => {
    try {
        // if(!request.body.isDefaultOrg) return next() // if isDefaultOrg is false then skip this middleware
        if(request.body.isFirstBranch)return next()
        if(!request.body.user?.owner && !request.body.register  ) return apiResponse.unauthorizedResponse(response,"Only owner can create organization");
        if(request.body.orgExist) {
            // request.body.orgId = request.body.orgDetails._id;
            // return next()
            request.body.parentOrg = request.body.orgDetails._id;
        }
        if(request.body.orgExist && ((request.body.orgDetails.structure==='branch' && request.body.branchDetails) || request.body.orgDetails.structure==='organization')){
            return apiResponse.validationError(response,'branch or oranization subscription cant create  suborganization,please upgrade group')
        }
        const orgDetails = await orgModel.addOrganization(request.body)
        if (!orgDetails.status) return apiResponse.notFoundResponse(response, orgDetails.message)
        request.body.orgId = orgDetails.data.insertedId
        if(!request.body.register) request.body.user['orgId']=orgDetails.data.insertedId // this paramter for default branch used in createby
        if(request.body.orgExist) return next();
        request.body.update = {
            orgId:orgDetails.data.insertedId,
            updatedAt:new Date(),
            modifiedBy:new ObjectId(request.body.userId)
        }
        request.body.stage = "branch"
        let message = [
            {key:"body" , value: JSON.stringify(request.body)}
        ]
        logger.info("orgDetails",message)
        await kafka.sendMessage("user-update",message)
        return next()
        
    } catch (error) {
        request.logger.error("Error while addOrganization in organization controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const getOrg = async(request, response, next) => {
    try {
        if(request.query.subOrgId) {
            request.body.subOrgId = request.query.subOrgId;
        }
        orgModel.get(request.body).then(async result=>{
            if(!result.status && !request.body.getOrgResponseSkip && !request.body.wizardGetAllData) return apiResponse.notFoundResponse(response, "No organization")
            if(request.body.wizardGetAllData) {
                request.body.allDataRes = {}

                if(result.status && result.data) request.body.allDataRes['organization'] = result.data
            }
            request.body.orgDetails = result.data
            
            return next()
        }).catch(error=>{
            request.logger.error("Error while getOrg in organization controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while createDepartment in departmnet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getOrgList = async (request,response,next) => {
    try{
        request.body.query = request.query;
        if(request.body.assignment?.status) request.body.query.assignment = request.body.assignment.data 
        orgModel.listOrg(request.body).then(res => {
            request.body.orgDetails = res;
            return next()
        }).catch(error => {
            request.logger.error("Error while getOrgList in organization controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while getOrgList in organization controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const updateOrgDetails = async (request,response,next) => {
    try{
        // request.body.orgIdToUpdate = request.body.orgId ? request.body.orgId : request.body.user.orgId
        // if(!request.body.orgExist)return apiResponse.notFoundResponse(response,'No Data Found')
        if(!request.body.subOrgExist&& !request.body.orgExist )return apiResponse.notFoundResponse(response,'No Data Found')
        orgModel.updateOrg(request.body).then(res => {
            if(res.status){
                request.body.result = res;
                return next()
            }
        }).catch(error => {
            request.logger.error("Error while updateOrg in organization controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }catch(error){
        request.logger.error("Error while updateOrg in organization controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

// add client organization 
export const addClientOrganization=async(request,response,next)=>{
    try {
        // if(!request.body.user.owner) return apiResponse.unauthorizedResponse(response,"Only owner can create organization");
        // if(request.body.orgExist) {
        //     request.body.parentOrg = request.body.orgDetails._id;
        // }
    
        const orgDetails = await orgModel.addOrganization(request.body)
        if (!orgDetails.status) return apiResponse.notFoundResponse(response, orgDetails.message)
        request.body.orgId = orgDetails.data.insertedId
        request.body.clientOrgDetails=orgDetails // this is for client creation api to send final middleware respnse
        // if(request.body.orgExist) return next();
        // request.body.update = {
        //     orgId:orgDetails.data.insertedId,
        //     updatedAt:new Date(),
        //     modifiedBy:new ObjectId(request.body.userId)
        // }
        // request.body.stage = "branch"
        // let message = [
        //     {key:"body" , value: JSON.stringify(request.body)}
        // ]
        // logger.info("orgDetails",message)
        // await kafka.sendMessage("user-update",message)
        return next()
        
    } catch (error) {
        request.logger.error("Error while addOrganization in organization controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

// add suborganiation defaultely
export const addSubOrganization=(request,response,next)=>{
    try{
        if(request.body.structure != 'group' || request.body.orgDetails?.structure != 'group' ) return next() // in wizard flow if org exist then skip this middleware
        // if(request.body.subOrgExist) return next();
        orgModel.addSubOrg(request.body).then(result=>{
            if(!result.status) return apiResponse.notFoundResponse(response, "Invalid organization")
            request.body.subOrgId=result.data.insertedId
            // request.body.orgDetails = result.data 
            return next()
        }).catch(error=>{
            request.logger.error("Error while addSubOrganization in organization controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        logger.error("Error while addSubOrganization in organization controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

// add client sub org defaultely
export const addClientSubOrg=(request,response,next)=>{
    try{
        orgModel.addSubOrg(request.body).then(result=>{
            if(!result.status) return apiResponse.notFoundResponse(response, "Invalid organization")
            request.body.subOrgId=result.data.insertedId
            return next()
        }).catch(error=>{
            logger.error("Error while addSubOrganization in organization controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        logger.error("Error while addSubOrganization in organization controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const isSubOrgExist = async(request, response, next) => {
    try {
        if(request.body.orgDetails.addSubOrg == false) return next()
        orgModel.isSubOrgExist(request.body).then(res => {
            if(!res.status || res.data.length <= 0) throw {}
            request.body.subOrgDetails = res.data;
            request.body.subOrgExist = true
            return next()
        }).catch(error => {
            // return apiResponse.somethingResponse(response, error.message)
            return next()
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const isMultipleSubOrgValid = async(request, response, next) => {
    try {
        if(!request.body.subOrg || !request.body.subOrg?.length) return next()
        orgModel.isMultipleSubOrgValid(request.body).then(res => {
            if(!res.data || res.data.length != request.body.subOrg.length) return apiResponse.validationError(response, "Invalid Sub-Organization!")

            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, error.message)
            // return next()
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const checkSubOrgPending = async(request, response, next) => {
    try {
        if(request.body.orgDetails.addSubOrg == false || request.body.subOrgExist) request.body.pending['subOrganization']=true
        else request.body.sendLoginResponse = true
        return next()
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

// add org parameters
export const addOrgStructureParameters=(request,response,next)=>{
    try{
        if(request.body.orgExist && !request.body.updateOrg) return next()
        if( !request.body.orgExist && !request.body.structure) return apiResponse.validationError(response,'structure parameter is required in body')
        const structure=request.body.structure
        if(structure==='branch'){
            request.body.addSubOrg=false
            request.body.addBranch=false
            return next()
        }else if(structure==='organization'){
            request.body.addSubOrg=false
            request.body.addBranch=true
            return next()
        }else if(structure==='group'){
            request.body.addSubOrg=true
            request.body.addBranch=true
            return next()
        }else{
            return apiResponse.validationError(response,'structure is not valid')
        }
        
    }catch (error) {
        logger.error("Error while addOrgStructureParameters in organization controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const findOrgData = (request,response,next) => {
    try {
        if(request.body.extractedData?.userIds?.length > 0) {
            orgModel.findOrgData({subOrgIds: request.body.extractedData.subOrgId, branchIds: request.body.extractedData.branchId, user:request.body.user}).then(res => {
                if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
                if(!request.body["extractedProcessedData"]) request.body.extractedProcessedData = {}
                request.body.extractedProcessedData["orgId"] = {}
                res.data.forEach(org => {
                    if(!request.body.extractedProcessedData["orgId"][org._id]){
                        request.body.extractedProcessedData["orgId"][org._id] = {
                            _id:org._id,
                            name:org.name,
                            parentOrgId:org.parentOrg
                        }
                    }
                    if(org?.matchedBranches?._id){
                        if(!request.body.extractedProcessedData["orgId"][org._id]['branch']) request.body.extractedProcessedData["orgId"][org._id]['branch'] = {}
                        request.body.extractedProcessedData["orgId"][org._id]['branch'][org.matchedBranches._id] = {
                            _id:org.matchedBranches._id,
                            name:org.matchedBranches.name,
                            subOrgId:org.matchedBranches.subOrgId
                        }
                    }
                }) 
                return next();
            }).catch(error => {
                request.logger.error("Error while findOrgData in organization controller ",{ stack: error.stack });
                return apiResponse.somethingResponse(response, error.message)
            })
        }else return next()
    } catch (error) {
        logger.error("Error while findOrgData in organization controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getOrgStructure = async (request, response, next) => {
    try {
        let activeFeat = request.body.activeFeatures

        request.body.structureOrg = ""

        let structureObj = {
            branch : "structure1",
            organization : "structure2",
            group : "structure3",
        }

        for(const sObj in structureObj) {
            let val = structureObj[sObj]

            if(activeFeat[val]) request.body.structureOrg = sObj
        }

        return next()

    }
    catch (error) {
        logger.error("Error while get structure in organization controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}