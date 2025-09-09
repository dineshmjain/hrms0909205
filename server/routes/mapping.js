import express from 'express';
import * as mappingController from '../controllers/mapping/mapping.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from '../controllers/user/user.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Middleware to validate request data
const validateMappingRequest = (req, res, next) => {
    const { branchId, user,departmentId } = req.body;
    if (!branchId ||!user?.orgId || !departmentId) {
        return res.status(400).json({ status:400,meaage: 'Branch ID and Org ID are required' });
    }
    next();
};

router.post('/department',
 auth.isAuth,
 user.isUserValid, 
 validateMappingRequest,
 mappingController.checkingOrganisationId,
 mappingController.checkingBranchId,
 mappingController.checkingDepartmentId,
 mappingController.mapDepartmentToBranch
);

router.post('/designation', 
auth.isAuth, 
user.isUserValid,
(request,response,next)=>{
  const {user,branchId,designationId,departmentId}=request.body
  if(!user?.orgId || !branchId || !designationId || !departmentId){
    return response.status(400).json({status:400,message:"parameters are missing"})
  }
  return next()
},
mappingController.checkingOrganisationId,
mappingController.checkingBranchId,
mappingController.checkingDepartmentId,
mappingController.checkingDesignationId,
mappingController.mapDesignationToBranch);

router.post('/department/unmap', 
auth.isAuth, 
user.isUserValid, 
validateMappingRequest, 
mappingController.checkingOrganisationId,
mappingController.checkingBranchId,
mappingController.checkingDepartmentId,
mappingController.unmapDepartmentFromBranch);

router.post('/designation/unmap', 
auth.isAuth, 
user.isUserValid, 
validateMappingRequest, 
mappingController.checkingOrganisationId,
mappingController.checkingBranchId,
mappingController.checkingDepartmentId,
mappingController.checkingDesignationId,
mappingController.unmapDesignationFromBranch);


// mapping baranch and department designatioon to user
router.post('/dep/desg/user',
auth.isAuth,
user.isUserValid, // this is validation for admin userId
(request,response,next)=>{
    const {branchId, orgId,departmentId,designationId,employeeUserId}=request.body
    const validData=[branchId, orgId,departmentId,designationId,employeeUserId]
    if(validData.includes(undefined) ){
        return response.status(400).json({status:400,message:"parameters missing"})
    }
    return next()
},
mappingController.checkingOrganisationId,
mappingController.checkingBranchId,
mappingController.checkingDepartmentId,
mappingController.checkingDesignationId,
mappingController.checkingAllFileds, //all fileds should be in assignmnet collection then only create new one
// mappingController.assignAllFileds, //here create new assignment if all fileds not present
user.isEmployeeUserValid,
(request,response,next)=>{
    if(!ObjectId.isValid(request.body.assignmentId))return response.status(400).json({status:400,message:'Unable to Assign branch,department,designation to Userrr'})
    request.body.userEmployee['assignmentId']=request.body.assignmentId
    request.body.addParameter=true
    return next()
},
user.updateEmployeeUserDetails,
(request,response)=>{
   return  response.status(200).json({status:200,message:"Assigned branch,department,designation to User Successfully"})
}

)

//unmap branch,dept,desg to user
router.post('/unmap/dept/desg/user',
auth.isAuth,
user.isUserValid, // this is validation for admin userId
(request,response,next)=>{
    const {branchId, orgId,departmentId,designationId,employeeUserId}=request.body
    const validData=[branchId, orgId,departmentId,designationId,employeeUserId]
    if(validData.includes(undefined) ){
        return response.status(400).json({status:400,message:"parameters missing"})
    }
    return next()
},
mappingController.checkingOrganisationId,
mappingController.checkingBranchId,
mappingController.checkingDepartmentId,
mappingController.checkingDesignationId,
mappingController.checkingAllFileds, //all fileds should be in assignmnet collection then only create new one
// mappingController.assignAllFileds, //here create new assignment if all fileds not present
user.isEmployeeUserValid,
(request,response,next)=>{
    if(!ObjectId.isValid(request.body.assignmentId))return response.status(400).json({status:400,message:'Unable to remove branch,department,designation to User'})
    request.body.userEmployee['assignmentId']=request.body.assignmentId
    request.body.addParameter=false // this parameter used for updateEmployeeUserDetails need to remove  
    return next()
},
user.updateEmployeeUserDetails,
(request,response)=>{
   return  response.status(200).json({status:200,message:"UnMapped branch,department,designation to User Successfully"})
}

)

export default router;
