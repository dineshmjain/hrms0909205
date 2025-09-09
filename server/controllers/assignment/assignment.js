import * as assignmentModel from '../../models/assignment/assignment.js';
import * as apiResponse from '../../helper/apiResponse.js';
import { ObjectId } from 'mongodb';
import * as organisation from '../../models/organization/organization.js';
import * as department from '../../models/department/department.js';
import * as designation from '../../models/designation/designation.js';
import * as branch from '../../models/branch/branch.js';
import * as user from '../../models/user/user.js'
import {matchesConditions} from '../../helper/formatting.js'



export const createAssignment = async (request, response, next) => {
  try {
    if (request.body.assignment) {
      request.body.assignmentIds = request.body.assignment.data.map(d => d._id);
      return next();
    }

    const assignmentIds = await assignmentModel.assignment(request.body);

    if (!assignmentIds.length) {
      return apiResponse.error(response, "No assignment created or found");
    }

    request.body.assignmentIds = assignmentIds;
    return next();

  } catch (error) {
    request.logger.error("Error while creating an assignment", { stack: error.stack });
    return apiResponse.somethingResponse(response, "Something went wrong");
  }
};


export const assignDepartmentToBranch = async (request,response,next) => {
    try{
        request.body.assignmentData = {
            branchId:new ObjectId(request.body.branchId),
            departmentId:new ObjectId(request.body.departmentId),
        };
        request.body.missingBranchIds=[request.body.branchId] // this condition added for madhu added missing branchIds in assignment model  for get assignment user 
        assignmentModel.assignment(request.body).then(res => {
            // if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng");
            // request.body.data = res.data;
            if(!res?.length>0) return apiResponse.ErrorResponse(response,"Something went worng");
            request.body.data = res;
            return next();
        }).catch(error => {
            request.logger.error("Error while cassignDepartmentToBranch in assignment controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, "Something went worng")
        })
    }catch(error){
        request.logger.error("Error while cassignDepartmentToBranch in assignment controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, "Something went worng")
    }
};

export const getSingleAssignment = async (request,response,next) => {
    try{
        if(request.query){
            for(let field in request.query){
                request.body[field] = request.query[field]
            }
        }
        assignmentModel.getSingleAssignment(request.body).then(res => {
            if(!res.status) return next();
            
            request.body.assignment = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while getSingleAssignment in assignment controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, "Something went worng")
        })
    }catch(error){
        request.logger.error("Error while getSingleAssignment in assignment controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, "Something went worng")
    }
};

export const assignDesignation = async (request,response,next) => {
    try{
        
        request.body.assignmentData = {
            branchId:new ObjectId(request.body.branchId),
            designationId:new ObjectId(request.body.designationId),
        };
        if(request.body.departmentId) request.body.assignmentData.departmentId = new ObjectId(request.body.departmentId);
        request.body.missingBranchIds=[request.body.branchId] // this condition added for madhu added missing branchIds in assignment model  for get assignment user 
        assignmentModel.assignment(request.body).then(res => {
            // if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng");
            // request.body.data = res.data;
            // return next();
            if(!res?.length>0) return apiResponse.ErrorResponse(response,"Something went worng");
            request.body.data = res;
            return next();
        }).catch(error => {
            request.logger.error("Error while assignDesignation in assignment controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, "Something went worng")
        })
    }catch(error){
        request.logger.error("Error while assignDesignation in assignment controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, "Something went worng")
    }
};


export const getAssignment  = async (request,response,next) => {
    try{
        request.body.query = request.body.params || {...request.body.query};
        if(request.query.orgLevel) {
            request.body.assignment = {
                status:false
            }
            return next()
        }
        // request.body.query = request.query;
        assignmentModel.getAssignment(request.body).then(res => {
            if(!res.data?.length) return next()//apiResponse.notFoundResponse(response,"Assigment not found");

            request.logger.debug(JSON.stringify(res));
            request.body.assignment = res;
            return next()
        }).catch(error => {
            request.logger.error("Error while getAssignment in assignment controller.",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.toString())
        })
    }catch(error){
        request.logger.error("Error while assignDesignation in assignment controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
}

export const getAssignmentbyHirearchy  = async (request,response,next) => {
    try{
        request.body.query = request.query;
        if(request.query.orgLevel) {
            request.body.assignment = {
                status:false
            }
            return next()
        }
        // request.body.query = request.query;
        assignmentModel.getAssignmentbyHirearchy(request.body).then(res => {
            if(!res.status) throw {}//apiResponse.notFoundResponse(response,"Assigment not found");

            // request.logger.debug(JSON.stringify(res));
            request.body.assignment = res.data;
            return next()
        }).catch(error => {
            request.logger.error("Error while getAssignment in assignment controller.",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.toString())
        })
    }catch(error){
        request.logger.error("Error while assignDesignation in assignment controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
}

export const getAssignmentByRaman  = async (request,response,next) => {
    try{
        if(request.query.orgLevel) {
            request.body.assignment = {
                status:false
            }
            return next()
        }
        request.body.query = request.query;
        assignmentModel.getAssignmentByRaman(request.body).then(res => {
            if(!res.data.length) return next()//apiResponse.notFoundResponse(response,"Assigment not found");

            request.logger.debug(JSON.stringify(res));
            request.body.assignment = res;
            return next()
        }).catch(error => {
            request.logger.error("Error while getAssignment in assignment controller.",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.toString())
        })
    }catch(error){
        request.logger.error("Error while assignDesignation in assignment controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
}


export const getAssignmentUser = async (request, response, next) => {
  try {

    request.body.query = request.query;

    if (request.query.orgLevel) {
      request.body.assignment = { status: false };
      return next();
    }

    

    assignmentModel.getAssignmentForUser(request.body)
      .then(res => {
        if (!res.data.length) {
          request.body.assignmentIds = [];
          request.body.missingBranchIds = request.query.branchId || [];
          return next();
        }

        // If multiple branches are sent
        if (Array.isArray(request.query.branchId)) {
          const existingAssignments = new Map(res.data.map(a => [a.branchId.toString(), a._id]));
          const allBranchIds = request.query.branchId.map(id => id.toString());

          const missingBranchIds = allBranchIds.filter(id => !existingAssignments.has(id));
          request.body.assignmentIds = [...existingAssignments.values()];
          request.body.missingBranchIds = missingBranchIds;
        } else {
          // Single branchId case
          request.body.assignmentIds = [res.data[0]._id];
          request.body.missingBranchIds = [];
        }

        return next();
      })
      .catch(error => {
        request.logger.error("Error while getAssignment in assignment controller.", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
      });

  } catch (error) {
    request.logger.error("Error while assignDesignation in assignment controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.toString());
  }
};


export const checkingOrganisationId=async(request,response,next)=>{
    try{
        const checkingOrganisationStatus=await organisation.isOrgExist(request.body)
        if(checkingOrganisationStatus.status){
            return next()
        }
        return apiResponse.validationError(response,"Organisation Not Found")

    }catch(error){
        console.log("....error in checkingOrganisationId controller .....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}

//checking  branch details  under organisation exists or not
export const checkingBranchId=async(request,response,next)=>{
    try{
        if(request.body.branchId == undefined)return next()
        const checkingBranchStatus=await branch.getBranchOne(request.body)
        if(checkingBranchStatus.status){
            return next()
        }
        return apiResponse.validationError(response,"Branch Not Found")

    }catch(error){
        console.log("....error in checkingBranchId controller .....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}

//checking  department details  under organisation exists or not
export const checkingDepartmentId=async(request,response,next)=>{
    try{
        if(request.body.departmentId==undefined) return next()
        const checkingDepartmentStatus=await department.getOneDepartment(request.body)
        console.log(".....checkingDepartmentStatus....",checkingDepartmentStatus)
        if(checkingDepartmentStatus.status){
            return next()
        }
        return apiResponse.validationError(response,"Department Not Found")

    }catch(error){
        console.log("....error in checkingDepartmentId controller.....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}

//checking  designation details  under organisation exists or not
export const checkingDesignationId=async(request,response,next)=>{
    try{
        const checkingDesignationStatus=await designation.getOneDesignation(request.body)
        if(checkingDesignationStatus.status){
            request.body.roleId=checkingDesignationStatus.data.roles ?? null // getting roleId from designation and adding in body for creating user
            return next()
        }
        return apiResponse.validationError(response,"Designation Not Found")

    }catch(error){
        console.log("....error in checkingDesignationId controller.....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}


export const unmapDepartmentFromBranch = async (req, res) => {
    const { branchId, departmentId, user } = req.body;

    try {
        const result = await assignmentModel.deleteMapping(branchId, departmentId, null, user);
        if (result.status) {
            return apiResponse.successResponse(res, "Department unmapped from branch successfully");
        } else {
            return apiResponse.validationError(res, "failed to unmap department/no department from branch");
        }
    } catch (error) {
        console.error('Error in unmapDepartmentFromBranch controller:', error?.message);
        return apiResponse.somethingResponse(res, error?.message);
    }
};


export const unmapDesignationFromBranch = async (req, res) => {
    const { branchId,departmentId, designationId, user } = req.body;

    try {
        const result = await assignmentModel.deleteMapping(branchId, departmentId, designationId, user);
        if (result.status) {
            return apiResponse.successResponse(res, "Designation unmapped from branch with department successfully");
        } else {
            return apiResponse.validationError(res, "failed to unmap designation from branch with department");
        }
    } catch (error) {
        console.error('Error in unmapDesignationFromBranch controller:', error?.message);
        return apiResponse.somethingResponse(res, error?.message);
    }
};


//checking all fileds in assignment collection 
export const checkingAllFileds=async(request,response,next)=>{
    try{
        const checkingAllFiledsStatus=await assignmentModel.checkingAllFileds(request.body)
        if(checkingAllFiledsStatus.status){
            request.body.assignmentData=checkingAllFiledsStatus.result
            request.body.assignmentId=checkingAllFiledsStatus?.result?._id // this is assignmentId has org/branch/dept/desg ids maitained under in assignment collection 
            return next()
        }
        return apiResponse.validationError(response,checkingAllFiledsStatus?.message??"branch/department/designation not found  under organisation");


    }catch(error){
        console.log("....error.in checkingAllFileds assignment Controller....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}

//checking whether mapped in assignment collection or not

export const checkingMappedData=async(request,response,next)=>{
    try{
        const checkingMapped=await assignmentModel.checkingAllFileds(request.body)
        if(checkingMapped.status){
            const assignmentIds=checkingMapped.result.map((assignment)=>(new ObjectId(assignment._id)))
            request.body.assignmentIds=assignmentIds
            const checkingMappedAssignmentId=await user.checkingMappedAssignmentId(request.body) //here checking assignmentId mapped to users or not
            if(checkingMappedAssignmentId.status && checkingMappedAssignmentId.data.length>=1 ){
                return apiResponse.customResponse(response,'This designation under department is mapped to users,please unmap those users before proceeding.',checkingMappedAssignmentId.data)
            }
            return next()
        }
        return apiResponse.notFoundResponse(response,'No Data Mapped under organisation/branch/departmet')

    }catch(error){
        console.log("....error.in checkingDeaprtmentMapped assignment Controller....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}
export const getIdBasedAssignment =async(request,response,next)=>{
    try{
        if(!['/api/v1/user/update/official', '/api/v1/user/get/official'].includes(request.originalUrl)) return next()
        const checkingMapped=await assignmentModel.getIdBasedAssignment(request.body)
        if(checkingMapped.status){
            request.body.assignmentDetails = checkingMapped.data
            const branchIds = request.body.assignmentDetails.map(a => a.branchId)
            if(request.body.detailsType == 'official') {
                let {assignmentId, ...rest} = request.body.userDetails
                request.body.userDetails = {roleId : rest.role[0],joinDate:rest.joinDate} 
                let fields = ['branchId', 'subOrgId', 'departmentId', 'designationId']

                fields.forEach(f => {
                    if(request.body.assignmentDetails[0][f]) {
                        if(f == 'branchId' && branchIds.length > 0) request.body.userDetails[f] = branchIds
                        else request.body.userDetails[f] = request.body.assignmentDetails[0][f]
                    }
                })
            }
            return next()
        }
        return apiResponse.notFoundResponse(response,'No Data Mapped under organisation/branch/departmet')

    }catch(error){
        console.log("....error.in checkingDeaprtmentMapped assignment Controller....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}

export const getBranchesByAssignment = async (request, response, next) => {
    try
    {
        const branch = await assignmentModel.getBranchesByAssignment(request.body)
        if (!branch.status)  return apiResponse.ErrorResponse(response,"Something went worng");
        request.body.branch = branch;
        return next()
    }
    catch (error) {
        console.log("....error.in getBranchesByAssignment assignment Controller....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}

export const mergeAssignmentFields = async(request,response,next)=>{
    try{
        
        let assignmentDetails = request.body.assignmentDetails
        let fields = ['subOrgId', 'branchId', 'designationId', 'departmentId' ]
        fields.forEach(f => {
            if (!request.body[f]) {
                request.body[f] = assignmentDetails[f]?.toString() // add in body
                request.query[f] = assignmentDetails[f]?.toString()  //add in query params
            }
            else {
                request.query[f] = request.body[f]
            }
        });

        return next()

    }catch(error){
        console.log("....error.in merging assignment fields assignment Controller....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}

export const destructureCombinations = async(request,response,next)=>{
    try{
        
        let struct = {
            subOrg :['department', 'designation'],
            branch : ['department', 'designation'],
            department: ['subOrg', 'branch', 'designation'],
            designation: ['subOrg', 'branch', 'department']
        }
        request.body.struct = struct

        let keyDic = {designation: "designationId", department: "departmentId", subOrg : "subOrgId", branch : "branchId"}

        request.body.keyDic = keyDic

        let assignmentArray = []

        struct[request.body.hierarchy].forEach(s => {
            if(request.body[s]) {
                assignmentArray.push({key:keyDic[s], value : request.body[s]})
            }
        })

        const combinations = assignmentArray.reduce(
            (acc, curr) => acc.flatMap(a => curr.value.map(b => ({ ...a, [curr.key]: new ObjectId(b) }))),
            [{}]
        ).map(combo => ({orgId: request.body.user.orgId,[`${request.body.hierarchy}Id`] : new ObjectId(request.body[`${request.body.hierarchy}Id`]), ...combo}));

        request.body.combinations = combinations
        return next()

    }catch(error){
        console.log("....error.in merging assignment fields assignment Controller....",error?.message)
        return apiResponse.ErrorResponse(response,error?.message)
    }
}

export const checkMultipleAssignment = async (request, response, next) => {
  try {
   
    const res = await assignmentModel.checkMultipleAssignment(request.body)
    if (!res.status) throw {}
    if(request.body.unmap) { // dont want to check while un-map (picking just data)
            request.body.assignmentData = res.data
            return next()
    }
    const checkExisting = request.body.combinations
      .map(assign => {
        let filter = undefined
        switch (request.body.hierarchy) {
            case 'subOrg':
                filter = res.data.filter(compareItem =>
                    assign.subOrgId?.toString() == compareItem.subOrgId?.toString() &&
                    assign.departmentId?.toString() == compareItem.departmentId?.toString() &&
                    assign.designationId?.toString() == compareItem.designationId?.toString()
                )[0];

                if(!filter) return assign
                break;
            case 'branch':
                filter = res.data.filter(compareItem =>
                    assign.branchId?.toString() == compareItem.branchId?.toString() &&
                    assign.departmentId?.toString() == compareItem.departmentId?.toString() &&
                    assign.designationId?.toString() == compareItem.designationId?.toString()
                )[0];

                if(!filter) return assign
                break;
            case 'designation':
                filter = res.data.filter(compareItem =>
                    assign.subOrgId?.toString() == compareItem.subOrgId?.toString() &&
                    assign.branchId?.toString() == compareItem.branchId?.toString() &&
                    assign.departmentId?.toString() == compareItem.departmentId?.toString() &&
                    assign.designationId?.toString() == compareItem.designationId?.toString()
                )[0];

                if(!filter) return assign
                break;
            case 'department':
                filter = res.data.filter(compareItem =>
                    assign.subOrgId?.toString() == compareItem.subOrgId?.toString() &&
                    assign.branchId?.toString() == compareItem.branchId?.toString() &&
                    assign.departmentId?.toString() == compareItem.departmentId?.toString() &&
                    assign.designationId?.toString() == compareItem.designationId?.toString()
                )[0];

                if(!filter) return assign
                break;

            default:
                return assign        }
      }).filter(f => f !== undefined);

    request.body.addAssignmentData = checkExisting.map(ce => ({...ce,createdDate: new Date(),createdBy: new ObjectId(request.body.userId)}));

    return next()

  } catch (error) {
    console.log("....error while check multiple assignments assignment Controller....", error?.message)
    return apiResponse.ErrorResponse(response, error?.message)
  }
}

export const addMultiple = async (request, response, next) => {
    try {

        if(request.body.addAssignmentData.length <= 0) return apiResponse.validationError(response, "assignment already exist!")

        assignmentModel.addMultiple(request.body).then(res => {
            if (!res.status) throw {}
            else return next()
        }).catch(error => {
            request.logger.error("Error while add multiple assignments assignment Controller. ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, "Something went worng")
        })
        // return next()

    } catch (error) {
        console.log("....error while add multiple assignments assignment Controller....", error?.message)
        return apiResponse.ErrorResponse(response, error?.message)
    }
}

export const removeMultiple = async (request, response, next) => {
    try {
        if(request.body.assignmentData.length <= 0) return apiResponse.validationError(response, "assignment already don't exist!")
        assignmentModel.removeMultiple(request.body).then(res => {
            if (!res.status) throw {}
            else return next()
        }).catch(error => {
            request.logger.error("Error while remove multiple assignments assignment Controller. ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, "Something went worng")
        })
        // return next()

    } catch (error) {
        console.log("....error while change status multiple assignments assignment Controller....", error?.message)
        return apiResponse.ErrorResponse(response, error?.message)
    }
}


export const getAssignmentIdBasedDesignation=(request,response,next)=>{
    try{
        if(request.body.userEmployee && request.body.userEmployee.assignmentId&& request.body.userEmployee.assignmentId.length>0){
            request.body.assignmentIdS = request.body.userEmployee.assignmentId.map(id=>new ObjectId(id)) // this is assignmentId has org/branch/dept/desg ids maitained under in assignment collection
            request.body.userDetails={assignmentId:request.body.assignmentIdS}
        } 
        if(request.body.userDetails.assignmentId.length<1) return apiResponse.validationError(response, "User is not assigned to any branch!")
        assignmentModel.getIdBasedAssignment(request.body).then(res => {
            if(!res.status) return apiResponse.notFoundResponse(response, "No Designation found for this assignmentId!")
            request.body.designatedAssignmentCoolection = res.data.find(d => d?.designationId != null);
            request.body.designationId = request.body.designatedAssignmentCoolection?.designationId;
            return next()
        }).catch(error => {
            request.logger.error("Error while getAssignmentIdBasedDesignation in assignment controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.toString())
        })
    }catch(error){
        request.logger.error("Error while getAssignmentIdBasedDesignation in assignment controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString())
    }
}








