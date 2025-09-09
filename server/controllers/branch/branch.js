// import * as orgModel from '../../models/organization/organization.js'
import * as branchModel from '../../models/branch/branch.js'
import * as apiResponse from '../../helper/apiResponse.js'
import { ObjectId } from 'mongodb';
import { convertToYYYYMMDD, getCurrentDateTime } from '../../helper/formatting.js';
import { locationSchema, nameSchema, requiredSchema } from '../../helper/joiSchema.js';
import {logger } from "../../helper/logger.js";
import * as orgModel from '../../models/organization/organization.js';
import { KafkaService } from '../../utils/kafka/kafka.js'
const kafka = new KafkaService();

//Validation for Branch
export const addChecks = async (request, response, next) => {
    try {
        if (!request.body.name) return apiResponse.notFoundResponse(response, "Please provide branch name")
        if (!request.body.location) return apiResponse.notFoundResponse(response, "Please provide branch location")

        if (!request.body.user.orgId) return apiResponse.notFoundResponse(response, "Please create organization first!")

        let nameValidation = nameSchema.validate(request.body.name);
        if (nameValidation.error)
            return apiResponse.validationError(response, "Please enter a valid branch name");

        let locationValidation = locationSchema.validate(request.body.location);
        if (locationValidation.error)
            return apiResponse.validationError(response, "Please enter a valid location");


        return next()
    } catch (error) {
        console.log(error)
        return apiResponse.ErrorResponse(response, "Failed to add branch")
    }
}
//create branch
export const addBranch = async (request, response, next) => {
    try {
        // if(request.body.orgExist) return next();
        // if(!request.body.addBranch) return next()
        if(request.body.branchByDefault == false) return next()
        if(request.body.orgExist && request.body.orgDetails.structure==='branch'){
            return apiResponse.validationError(response,'branch subscription cant add branch,please upgrade either organization or group')
        }
        //error on without company
        request.body.clientMappedId = request.body?.clientDetails?._id
        let fields = ['clientMappedId', 'patrolling', 'area', 'employeesRequired', 'floors', 'mobile', 'inchargeName', 'name', 'location', 'landmark', 'office', 'isActive', 'createdDate', 'createdBy', 'businessTypeId','panNo','gstNo','address','geoLocation','geoJson','subOrgId']
     
        let branchData = {orgId:new ObjectId(request.body.user.orgId)}
        let body = request.body
        fields.forEach(f => {
            if (body[f]) {
                if (f == 'office') {
                    let officeFields = ['startTime', 'endTime', 'weekoff']
                    branchData[f] = {}
                    officeFields.forEach(of => {
                        if (body[f][of]) {
                            branchData[f][of] = body[f][of]
                        }
                    });

                }
                else if(f === "address" || f === "geoLocation" ) {
                    let locationFields = ["address","addressTypeId","addressType", "hno","city", "street", "village", "state", "taluk", "district","country", "pincode", "latitude" ,"longitude","landmark"];
                    branchData[f] = {};
                    locationFields.forEach(of => {
                        if (body[f][of]) {
                            branchData[f][of] = body[f][of]
                        }
                    });
                }
                else if (f === 'geoJson' && body[f]?.type === 'Point' && Array.isArray(body[f].coordinates)) 
                {
                    branchData[f] = {
                        type: "Point",
                        coordinates: body[f].coordinates
                    };
                }
                // if(f === "clientId") branchData[f] = new ObjectId(body[f])
                else if(f === "clientMappedId"){
                    branchData['orgId'] = new ObjectId(body[f])
                    branchData['client'] = true
                }
                else if(f==='subOrgId')branchData[f] = new ObjectId(body[f])
                else if(f === "address") branchData[f] = {...body[f],addressTypeId:new ObjectId(body["address"]["addressTypeId"])}
                else branchData[f] = body[f]
            }
            else {
                if (f == 'isActive') branchData[f] = true
                if (f == 'createdDate') branchData[f] = new Date()
                if (f == 'createdBy') branchData[f] = new ObjectId(body.userId)
            }
        });
        branchData['radius'] = 500
        request.body.branchData = branchData
        // request.body.branchData = {name:body.name,KYC:body.address?'completed':'pending',status:'Active',employeesRequired:body?.employeesRequired || 0,buildings:body?.buildings || 0,checkPoints:body?.checkPoints || 0,dutyPoints:body?.dutyPoints || 0,...branchData}
        const brancDetails = await branchModel.addBranch(request.body)
        if (!brancDetails.status) throw {}
        request.body.insertedBranchId = brancDetails.data.insertedId
        request.body.branchResponse = brancDetails.data
        return next()
    } catch (error) {
        console.log(error)
        return apiResponse.ErrorResponse(response, "Failed to add branch")
    }
}

//check duplicate
export const isBranchAlreadyExists = async (request, response, next) => {

    try {
        const branchDetails = await branchModel.getBranchData(request.body)
        if (branchDetails.data.length !== 0) return apiResponse.duplicateResponse(response, "Branch already exists")
        return next()
    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Failed to check branch existence")
    }
}

export const isMultipleBranchIdValid = async (request, response, next) => {
    try {
        const branchDetails = await branchModel.isMultipleBranchIdValid(request.body)
        if (!branchDetails.status || branchDetails.data.length <= 0 || branchDetails.data.length != request.body.branchId?.length) return apiResponse.duplicateResponse(response, "Invalid Branch!")

        return next()
    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Failed to check branch existence")
    }
}

export const isMultipleBranchValid = async (request, response, next) => {
    try {
        if(!request.body.branch || !request.body.branch?.length) return next()
        const branchDetails = await branchModel.isMultipleBranchValid(request.body)
        if (!branchDetails.status || branchDetails.data.length != request.body.branch.length) return apiResponse.duplicateResponse(response, "Invalid Branch!")

        return next()
    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Failed to check branch existence")
    }
}

//branch Details
export const getBranchDetails = async (request, response, next) => {
    try {
        const branchDetails = await branchModel.getBranchData(request.body)
        if (!branchDetails.status) throw {}

        request.body.branchDetails = branchDetails.data;
        return next()

    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Failed to get Branch Details")
    }
}

//branch Details
export const getBranchDetailsClient = async (request, response, next) => {
    try {
        const branchDetails = await branchModel.getBranchDataClient(request.body)
        if (!branchDetails.status) throw {}

        request.body.branchDetails = branchDetails.data;
        return next()

    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Failed to get Branch Details")
    }
}

//branch edit
export const   editBranch = async (request, response, next) => {
    try {
        
        const branchDetails = await branchModel.editBranch(request.body, request.params)
        if (!branchDetails.status) throw {}
        return apiResponse.successResponse(response, "Branch Updated successfully")
    } catch (error) {
       request.logger.error("Error while editBranch in branch controller ",{ stack: error.stack });
       return apiResponse.somethingResponse(response, error.message)  
    }
}

//branch List
export const getBranchList = async (request, response, next) => {
    try {
        request.body.query = request.query;
        if(request.body.assignment?.status) request.body.query.assignment = request.body.assignment.data 
        request.body.query.orgId = request.body.orgDetails?._id
        if(request.body.query?.subOrgId){
            delete request.body.query.orgId
            // request.body.query.subOrgId =  request.body.query.subOrgId
        }

        let branch = {}
        if(request.query.limitedData)
        {
            branch = await branchModel.getBranchesLimited(request.body)
        }
        else
        {
            branch = await branchModel.getBranch(request.body)
        }
        if (!branch.status)  return apiResponse.ErrorResponse(response,"Something went worng",res.error);

        if(request.body.allUsers) {
            branch.data = branch.data.map(u => {
                if(u.createdBy){
                    u.createdBy = {id : u.createdBy, firstName : request.body.allUsers[u.createdBy].name.firstName, lastName : request.body.allUsers[u.createdBy].name.lastName} 
                }
                return u
            })
        }


        request.body.branch = branch;
        return next()

    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Failed to get Branch List")
    }
}

export const checkPending = async(request, response, next) => {
    try {
        if(request.body.branch && request.body.branch.totalRecord>0) request.body.pending['branch']=true
        request.body.sendLoginResponse = true
        return next()
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const updateBranchStatus = async (request, response, next) => {
    try {
        if(request.body.orgExist && request.body.orgDetails.structure==='branch'){
            return apiResponse.validationError(response,'branch subscription cant deactivate please upgrade to either organization or group')
        }
        const branchDetails = await branchModel.updateBranchStatus(request.body)
        if (!branchDetails.status) throw {}
        return apiResponse.successResponse(response, `Branch ${request.body.status == false ? 'Deacticvated' : 'Activated'} successfully`)
    } catch (error) {
        console.log(error)
        return apiResponse.ErrorResponse(response, "Failed to delete branch")
    }
}

export const checkSubOrgId=(request ,response,next)=>{
    try{
        if(!request.body.subOrgId) return next()
        orgModel.get(request.body).then(async result=>{
            if(!result.status) return apiResponse.notFoundResponse(response, "Invalid organization")
            request.body.orgDetails = result.data
            
            return next()
        }).catch(error=>{
            request.logger.error("Error while checkSubOrgId in organization controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch (error) {
        logger.error("error while checkSubOrgId in branch controller",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
}


// add client branch default
export const addClientBranch=async (request, response, next) => {
    try {
        request.body.clientId=request.body.clientData.insertedId
        request.body.branchData = {
            orgId: new ObjectId(request.body.clientId),
            name: request.body.name, 
            isActive: true,
            createdDate: new Date(),
            client:true,
            createdBy: new ObjectId(request.body.user._id)

        }
        const brancDetails = await branchModel.addBranch(request.body)
        if (!brancDetails.status) throw {}
        return next()
    } catch (error) {
        console.log(error)
        return apiResponse.ErrorResponse(response, "Failed to add branch")
    }
}

export const addDefaultBranch= async (request, response, next) => {
    try {
        if(request.body.orgExist) return next();
        if(request.body.structure==='organization'||request.body.structure==='group') return next()
        const branchData = {
            orgId:new ObjectId(request.body.user.orgId),
            name: request.body.name, 
            ...(request.body.address&&{address:request.body.address}),
            ...(request.body.geoLocation&&{geoLocation:request.body.geoLocation}),
            ...(request.body.geoJson&&{geoJson:request.body.geoJson}),
            isActive: true,
            createdDate: new Date(),
            createdBy: new ObjectId(request.body.user._id)

        }
        request.body.branchData = branchData
        // request.body.branchData = {name:body.name,KYC:body.address?'completed':'pending',status:'Active',employeesRequired:body?.employeesRequired || 0,buildings:body?.buildings || 0,checkPoints:body?.checkPoints || 0,dutyPoints:body?.dutyPoints || 0,...branchData}
        const brancDetails = await branchModel.addBranch(request.body)
        if (!brancDetails.status) throw {}
        return next()
    } catch (error) {
        console.log(error)
        return apiResponse.ErrorResponse(response, "Failed to add branch")
    }
}

// isbranch exists (both client and hrms barnch)
export const isBranchExist = (request, response, next) => {
    try {
        branchModel.isBranchExist(request.body)
        .then((result) => {
            if (!result.status) {
                return apiResponse.validationError(response, "Invalid Branch!")
            }
            request.body.branchDetails = result.data
            return next()
        })
        .catch((error) => {
            logger.error("Error while isBranchExist in branch controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, "Failed to check branch existence")
        })

    } catch (error) {
        logger.error("Error while isBranchExist in branch controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, "Failed to check branch existence")
    }
}

// get branch radius
export const getBranchRadius = async(request, response, next) => {
    try {
        branchModel.getBranchRadius(request.body)
        .then((result) => {
            if (!result.status) {
                return apiResponse.validationError(response, "Invalid Branch!")
            }
            request.body.branchDetails = result
            return next()
        })
        .catch((error) => {
            logger.error("Error while isBranchExist in branch controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, "Failed to check branch existence")
        })

    } catch (error) {
        logger.error("Error while isBranchExist in branch controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, "Failed to check branch existence")
    }
}
// update branch radius
export const updateBranchRadius = async(request, response, next) => {
    try {
        branchModel.updateBranchRadius(request.body)
        .then(async (result) => {
            if (!result.status) {
                return apiResponse.validationError(response, "Invalid Branch!")
            }
            let message = [
                {key:"body" , value: JSON.stringify(request.body)}
            ]
            logger.info("branch-logs",message)
            await kafka.sendMessage("branch-logs",message)
            return next()
        })
        .catch((error) => {
            logger.error("Error while isBranchExist in branch controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, "Failed to check branch existence")
        })

    } catch (error) {
        logger.error("Error while isBranchExist in branch controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, "Failed to check branch existence")
    }
}

export const branchCount = async(request, response, next) => {
       try {
            // request.body.modules = ["branch"];
            const checkModules = request?.body?.assignedModules?.some(d => d?.name?.toLowerCase()=== 'branch');
            if(checkModules)
            {
           branchModel.branchCount(request.body).then(res => {
                if (!res.status) throw {}
                request.body.branchDetails = res.data
                return next()
            }).catch(error => {
                request.logger.error("Error while userBranchCount in user controller ", { stack: error.stack });
                return apiResponse.somethingResponse(response, error.message)
            })
        }
        else{
            next()
        }
        }
        catch (error) {
            logger.error("Error while branchDetails in client controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        }
}
