import * as apiResponse from '../../helper/apiResponse.js';
import * as mappingModel from '../../models/mapping/mapping.js';
import * as organisation from '../../models/organization/organization.js'
import * as department from '../../models/department/department.js'
import * as designation from '../../models/designation/designation.js'
import * as branch from '../../models/branch/branch.js'

export const mapDepartmentToBranch = async (req, res) => {
    const { branchId, departmentId, user } = req.body;
    
    try {
        const existingMapping = await mappingModel.findMapping(branchId, departmentId, null, user);
        if (existingMapping.status) {
            return apiResponse.validationError(res, "Department is already mapped to this branch");
        }

        const result = await mappingModel.createMapping(branchId, departmentId, null, user);
        return apiResponse.successResponse(res, "Department mapped to branch successfully", result.data);
    } catch (error) {
        console.error('Error in mapDepartmentToBranch:', error?.message);
        return apiResponse.somethingResponse(res, error?.message??"something went wrong");
    }
};

export const mapDesignationToBranch = async (req, res) => {
    const { branchId, designationId, user } = req.body;

    try {
        const existingMapping = await mappingModel.findMapping(branchId, null, designationId, user);
        if (existingMapping.status) {
            return apiResponse.validationError(res, "Designation is already mapped to this branch");
        }

        const result = await mappingModel.createMapping(branchId, null, designationId, user);
        return apiResponse.successResponse(res, "Designation mapped to branch successfully", result.data);
    } catch (error) {
        console.error('Error in mapDesignationToBranch:', error);
        return apiResponse.somethingResponse(res, "Internal Server Error");
    }
};

export const unmapDepartmentFromBranch = async (req, res) => {
    const { branchId, departmentId, user } = req.body;

    try {
        const result = await mappingModel.deleteMapping(branchId, departmentId, null, user);
        console.log(".....result....",result)
        if (result.status) {
            return apiResponse.successResponse(res, "Department unmapped from branch successfully");
        } else {
            return apiResponse.notFoundResponse(res, "Mapping not found");
        }
    } catch (error) {
        console.error('Error in unmapDepartmentFromBranch:', error);
        return apiResponse.somethingResponse(res, "Internal Server Error");
    }
};

export const unmapDesignationFromBranch = async (req, res) => {
    const { branchId,departmentId, designationId, user } = req.body;

    try {
        const result = await mappingModel.deleteMapping(branchId, departmentId, designationId, user);
        if (result.status) {
            return apiResponse.successResponse(res, "Designation unmapped from branch with department successfully");
        } else {
            return apiResponse.notFoundResponse(res, "Mapping not found");
        }
    } catch (error) {
        console.error('Error in unmapDesignationFromBranch:', error);
        return apiResponse.somethingResponse(res, "Internal Server Error");
    }
};



export const checkingOrganisationId=async(request,response,next)=>{
    try{
        const checkingOrganisationStatus=await organisation.isOrgExist(request.body)
        if(checkingOrganisationStatus.status){
            return next()
        }
        return response.status(400).json({status:400,message:"Organisation Not Found"})

    }catch(error){
        console.log("....error.....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message ?? 'Something went wrong')
    }
}

export const checkingBranchId=async(request,response,next)=>{
    try{
        const checkingBranchStatus=await branch.getBranchOne(request.body)
        if(checkingBranchStatus.status){
            return next()
        }
        return response.status(400).json({status:400,message:"Branch Not Found"})

    }catch(error){
        console.log("....error.....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message ?? 'Something went wrong')
    }
}


export const checkingDepartmentId=async(request,response,next)=>{
    try{
        const checkingDepartmentStatus=await department.getOneDepartment(request.body)
        if(checkingDepartmentStatus.status){
            return next()
        }
        return response.status(400).json({status:400,message:"Department Not Found"})

    }catch(error){
        console.log("....error.....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message ?? 'Something went wrong')
    }
}


export const checkingDesignationId=async(request,response,next)=>{
    try{
        const checkingDesignationStatus=await designation.getOneDesignation(request.body)
        if(checkingDesignationStatus.status){
            return next()
        }
        return response.status(400).json({status:400,message:"Designation Not Found"})

    }catch(error){
        console.log("....error.....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message ?? 'Something went wrong')
    }
}

//adding assignmentId to User
export const updatingUserWithAssignmentId=async(request,response,next)=>{
    try{
        if(request.body.assignmentId==null)return apiResponse.validationErrorWithData(response,'unable get/create AssignmentId From Assignment Collection')
        request.body.user['assignmentId']=request.body.assignmentId
        const assignUserWithAssignmentId=await mappingModel.updatingUserWithAssignmentId(request.body)
        if(assignUserWithAssignmentId.status){
            return next()
        }

        return response.status(400).json({status:400,message:assignUserWithAssignmentId?.message??'Unable to Assign branch,department,designation to User'})
        

    }catch(error){
        console.log("....error.....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message ?? 'Something went wrong')
    }
}


//checking all fileds in collection 
export const checkingAllFileds=async(request,response,next)=>{
    try{
        const checkingAllFiledsStatus=await mappingModel.checkingAllFileds(request.body)
        if(checkingAllFiledsStatus.status){
            request.body.alreadyFieldsAssigned=true
            request.body.assignmentData=checkingAllFiledsStatus.result
            request.body.assignmentId=checkingAllFiledsStatus?.result?._id
            return next()
        }
        request.body.alreadyFieldsAssigned=false
        // return next()
        return response.status(400).json({status:400,message:checkingAllFiledsStatus?.message??"branch/department/designation not found  under organisation"})


    }catch(error){
        console.log("....error.....",error?.message??'something went wrong')
        return apiResponse.ErrorResponse(response,error?.message??'something went wrong')
    }
}

// assign all fileds branch,department,designation,org in assignmnet coolection
export const assignAllFileds=async(request,response,next)=>{
    try{
        if(request.body.alreadyFieldsAssigned) return next() // if all fileds in assignment collection then it is skip to create
        const assignAllFieldsStatus=await mappingModel.assignAllFileds(request.body)
        if(assignAllFieldsStatus.status && assignAllFieldsStatus.result.insertedId){
            request.body.assignmentId=assignAllFieldsStatus.result.insertedId
            return next()
        }
        return response.status(400).json({status:400,message:checkingAllFiledsStatus?.message??"Assigning branch,deapartment & designation failed to User"})

    }catch(error){
        console.log("...error....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}

