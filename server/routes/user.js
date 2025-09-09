import { celebrate } from 'celebrate';
import { response, Router } from 'express';
import { validation } from '../helper/validationSchema.js';

import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as org from "../controllers/organization/organization.js";
import * as user from "../controllers/user/user.js"
import * as designation from "../controllers/designation/designation.js";
import * as department from "../controllers/department/department.js";
import * as assignment from '../controllers/assignment/assignment.js'
import * as roles from '../controllers/role/role.js'
import * as modules from '../controllers/modules/modules.js'
import * as client from '../controllers/client/client.js'
import * as clientBranch from '../controllers/client/clientBranch.js'
import * as attendance from '../controllers/attendence/attendence.js'

// import * as organization from '../controllers/organization/organization.js';
import * as branch from '../controllers/branch/branch.js';
import { role } from '../helper/constants.js';
// import * as warehouse from '../controllers/warehouse/warehouse.js';
// import * as roles from '../controllers/access/role.js';
// import * as item from '../controllers/warehouse/item.js';
// import * as subscription from '../controllers/subscription/subscription.js';
const router = Router();


//controllers
router.use((request,response,next)=>{
   console.log('\nuser middleware');
   console.log(request.originalUrl)
   // request.body.endpoint = request.originalUrl
   // request.body.featureKey = 'users'
   console.log('-------------------------------------------------------');
   return next();
})

// router.post('/forgotPassword', 
// // user.updatePassword
// )

// router.post('/add',
// (request,response,next) => {
//    request.body.addUser = true
//    request.body.warehouses = true
//    return next()
// },
// auth.isAuth,
// user.isUserValid,
// subscription.getFeatureUsage,
// auth.registerChecks,
// auth.isMobileDuplicate,
// roles.isRoleValid,
// organization.isOrgValid,
// branch.isMultipleBranchValid,
// branch.branchList,
// item.getItemLogs,
// item.getCategories,
// item.isCategoryValid,
// item.getGroupItems,
// item.isGroupValid,
// roles.getModules,
// roles.checkRoleModules,
// user.addUser,
// subscription.addFeatureUsage,
// (request, response) => {
//    return apiResponse.successResponse(response, `user added successfully`)
// }
// )

// router.post('/upload/profile/image',
// (request,response,next) => {
//    request.body.folderPath=`assets/images/profileImages`
//    request.body.dbfolderPath=`/images/profileImages`
//    return next()
// },
// auth.isAuth,
// user.uploadImage,
// user.updateImagePath,
// (request, response, next) => {
//    return apiResponse.successResponse(response, "Profile Image Updated Succesfully")
// }
// )

// router.post('/update/profile',
// auth.isAuth,
// user.isUserValid,
// user.isUpdatingUserValid,
// user.updateProfile,
// )

// //activate user / deactivate user
// router.post('/status/:actionType',
// user.userStatusChecks,
// auth.isAuth,
// user.updateUserIdAndAuthId,
// user.isUserValid,
// user.toggleUserStatus,
// )

// router.post('/list',
// auth.isAuth,
// user.isUserValid,
// roles.isRoleValid,
// user.getUserList,
// (request, response, next) => {
//    let userList = request.body.userList
//    return apiResponse.successResponseWithData(response, `user list found`, userList)
// }
// )

// router.post('/update',
//    (request,response,next) => {
//       request.body.updateUser = true
//       request.body.warehouses = true
//       return next()
//    },
//    auth.isAuth,
//    user.isUserValid,
//    user.isUpdatingUserValid,
//    auth.isMobileDuplicate,
//    roles.isRoleValid,
//    organization.isOrgValid,
//    branch.isMultipleBranchValid,
//    branch.branchList,
//    item.getItemLogs,
//    item.getCategories,
//    item.isCategoryValid,
//    item.getGroupItems,
//    item.isGroupValid,
//    user.updateUser,
//    roles.getModules,
//    roles.checkRoleModules,
//    (request, response, next) => {
//       return apiResponse.successResponse(response, `user updated successfully`)
//    },
//    )

// router.post('/details',
// auth.isAuth,
// user.isUserValid,
// user.updateUserIdAndAuthId,
// user.getUserById,
// roles.isRoleValid,
// roles.getRolesList,
// roles.getRolesWithMapStatus,
// roles.getModules,
// branch.getUserBranch,
// branch.branchList,
// item.getItemLogs,
// item.getCategories,
// item.isCategoryValid,
// item.getGroupItems,
// item.isGroupValid,
// (request, response, next) => {
//    let body = request.body
//    let roles = request.body.rolesResult
//    return apiResponse.successResponseWithData(response, "user Details found successfully", {id : body.id, name : body.userDetails.name, mobile : body.userDetails.mobile, password : body.userDetails.password, roles : roles, branch : body.userBranch, warehouse : body.userWarehouse?.sort(), category : body.mappedCategory?.sort(), group : body.mappedGroup?.sort()  })
// }

// )

// router.post('/image/upload', 
//    user.isAuthoriseUser
// )


router.post(
   "/create",
   celebrate(validation.addingUser),
   (request,response,next) => {
      request.body.addUser = true;
      request.query = {
         branchId:request.body.branchId,
         designationId:request.body.designationId,
         departmentId:request.body.departmentId,
      }
      return next();
   },
   auth.isAuth,
   user.isUserValid,
   org.getOrg,
   user.getOneUser,
   branch.isMultipleBranchIdValid,
   assignment.checkingDepartmentId,
   assignment.checkingDesignationId,
   assignment.getAssignmentUser,
   assignment.createAssignment,
   user.addUser,
   (request,response) => {
      return  apiResponse.successResponse(response, "User Added successfully")
   }
)

// UPDATE USER'S DETAILS
router.post('/update',
   celebrate(validation.updatingUser),
   (request,response,next) => {
      request.body.updateUser = true
      return next()
   },
   auth.isAuth,
   user.isUserValid,
   roles.isRoleValid,
   user.isUpdatingUserValid,
   org.getOrg,
   roles.getModules,
   roles.checkRoleModules,
   user.updateUserDetails,
   (request, response) => {
      return apiResponse.successResponse(response, "User's details updated successfully!")
   }
)

router.post('/update/official',
   celebrate(validation.updatingUserOfficial),
   (request,response,next) => {
      request.body.updateUser = true
      return next()
   },
   auth.isAuth,
   user.isUserValid,
   roles.isRoleValid,
   user.isUpdatingUserValid,
   org.getOrg,
   roles.getModules,
   roles.checkRoleModules,
   assignment.getIdBasedAssignment,
   assignment.mergeAssignmentFields,
   assignment.getAssignmentUser,
   assignment.createAssignment,
   user.updateUserDetails,
   (request, response) => {
      return apiResponse.successResponse(response, "User's Official Details updated successfully!")
   }
)

router.post('/update/address',
   celebrate(validation.updatingUserAddress),
   (request,response,next) => {
      request.body.updateUser = true
      return next()
   },
   auth.isAuth,
   user.isUserValid,
   roles.isRoleValid,
   user.isUpdatingUserValid,
   org.getOrg,
   roles.getModules,
   roles.checkRoleModules,
   user.updateUserDetails,
   (request, response) => {
      return apiResponse.successResponse(response, "User's Address updated successfully!")
   }
)


// Get USER'S DETAILS
router.post('/get',
   celebrate(validation.getUser),
   auth.isAuth,
   user.isUserValid,  
   // assignment.getSingleAssignment,
   (request, response, next)=>{
      request.body.clientId = request.query.clientId
      return next()
   }, 
   org.getOrg, 
   assignment.getAssignmentUser,
   user.getUserDetails,
   (request,response) => {
      return  apiResponse.responseWithPagination(response, "Data found successfully",request.body.designation)
  }
)

router.post('/client/list',
   celebrate(validation.clientUser),
   auth.isAuth,
   user.isUserValid,  
   // assignment.getSingleAssignment,
   // (request, response, next)=>{
   //    request.query.clientId = request.body.clientId
   //    return next()
   // }, 
   org.getOrg,
   client.isClient,
   assignment.getAssignmentbyHirearchy,
   attendance.getAllUserAttendance,
   user.getClientUserList
)

// get specific user array details
router.post('/get/user/array',
   celebrate(validation.getUserInfoDetails),
   auth.isAuth,
   user.isUserValid,  
   user.getUserInfoDetails,
   (request,response) => {
      return  apiResponse.responseWithPagination(response, "Data found successfully",request.body.designation)
  }
)

router.post('/get/:type', // for official, personal, address, password 
   auth.isAuth,
   user.isUserValid,
   (request, response, next) => {
      request.body.userId = request.params.id
      return next()
   },
   user.getUserModules,
   user.checkDisabledModules,
   user.getUserById,
   assignment.getIdBasedAssignment,
   (request, response, next)=>{
      return apiResponse.successResponseWithData(response, "User details fetched successfully!", request.body.userDetails)
   }
)

router.post('/getDetails',
   auth.isAuth,
   user.isUserValid,
   // (request, response, next) => {
   //    if(request.body.user?.owner || request.body.user?.isClient){
   //       return apiResponse.successResponseWithData(response, "User details fetched successfully!", request.body.user)
   //    }
   //    return next()
   // },
   user.getUserModules,
   modules.getOwnerModules,
   user.checkDisabledModules,
   modules.format,

   org.isOrgExist,
   org.checkPending,
   user.useGetResponse,

   org.isSubOrgExist,
   org.checkSubOrgPending,
   modules.formatBranchOrgModules,
   roles.getRoleDetails,
   user.useGetResponse,

   branch.getBranchList,
   branch.checkPending,
   user.useGetResponse,

   // department.getDepartmentByOrgId,
   // department.checkPending,
   // user.useGetResponse
)

router.post('/get/assigned/users',
   auth.isAuth,
   user.isUserValid,
   user.getAssignedUsers,
   (request, response, next) => {
      return apiResponse.successResponseWithData(response, "Assigned users fetched successfully!", request.body.assignedUsers)
   }
)

router.post('/pending/actions',
   auth.isAuth,
   user.isUserValid,
   org.isOrgExist,
   org.checkPending,
   org.isSubOrgExist,
   org.checkSubOrgPending,
   branch.getBranchList,
   branch.checkPending,
   (request, response, next) => {
      return apiResponse.successResponseWithData(response, "Pending actions", request.body.pending)
   }
)

router.post('/upload/profile/image',
(request,response,next) => {
   request.body.folderPath=`assets/images/profileImages`
   request.body.dbfolderPath=`/images/profile`
   return next()
},
auth.isAuth,
user.uploadImage,
user.updateImagePath,
(request, response, next) => {
   return apiResponse.successResponseWithData(response, "Profile Image Updated Succesfully", {imagePath: request.body.imagePath})
}
)

router.post('/client/multiple/mapping',
   auth.isAuth,
   user.isUserValid,
   user.isUpdatingUserValid,
   client.isMultipleClientValid,
   clientBranch.isMultipleBranchValid,
   user.filterExistingClientIds,
   user.multipleClientMapping,
   (request, response, next) => {
      return apiResponse.successResponse(response, "Multiple Clients assigned successfully")
   }
)

router.post('/client/multiple/un-map',
   auth.isAuth,
   user.isUserValid,
   user.isUpdatingUserValid,
   client.isMultipleClientValid,
   clientBranch.isMultipleBranchValid,
   user.filterExistingClientIds,
   user.multipleClientUnMap,
   (request, response, next) => {
      return apiResponse.successResponse(response, "Multiple Clients un-assigned successfully")
   }
)

router.get('/excel/format',
    auth.isAuth,
    user.isUserValid,
    org.isOrgExist,
    user.getEmployeeExcelFormat,
    (request,response,next)=>{
        return apiResponse.successResponseWithData(response,'imported successfully',request.body.filePath)
    }
)


router.post('/import/excel',
    auth.isAuth,
    user.isUserValid,
    org.isOrgExist,
    user.importEmployeeExcel,
)


router.post('/designation/role/modules',
  celebrate(validation.getDesignationRolesModules),
   auth.isAuth,
   user.isUserValid,
   user.isEmployeeUserValid,
   assignment.getAssignmentIdBasedDesignation,
   designation.getOneDesignation,
   (request, response, next) => {
      request.body.roles = request.body.designation.roles || []
      return next()
   },
   roles.isRoleValid,
   modules.getModules,
   (request, response) => {
      return apiResponse.successResponseWithData(response, "Designation roles and modules fetched successfully!",request.body.result ?? {})
   }

)

router.post('/update/disabled/modules',
celebrate(validation.updateDisableModules),
   auth.isAuth,
   user.isUserValid,
   (request,response,next)=>{
      request.body.employeeUserId=request.body.employeeId
      return next()
   },
   user.isEmployeeUserValid,
   user.getUserModules,
   user.isCheckDisabledModulesValid,
   user.updateDisabledModules,
   (request, response, next) => {
      return apiResponse.successResponseWithData(response, "Disabled modules fetched successfully!", request.body.disabledModules)
   }
)


router.post('/clients',
celebrate(validation.getUserClients),
   auth.isAuth,
   user.isUserValid,
   user.getUserClients,
   (request, response, next) => {
      return apiResponse.successResponseWithData(response, "Clients fetched successfully!", request.body.userClients)
   }
)






export default router;