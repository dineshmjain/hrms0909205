// import { response, Router } from 'express';
// import * as auth from '../controllers/auth/auth.js'
// import * as user from '../controllers/user/user.js'
// import * as role from '../controllers/role/role.js'
// import * as apiResponse from '../helper/apiResponse.js'
// import * as modules from '../controllers/modules/modules.js'
// const router = Router();

// // create role
// router.post('/create', 
//     auth.isAuth,
//     user.isUserValid,
//     role.getRole,
//     modules.getModule,
//     modules.isValidModule,
//     role.checkPermission,
//     role.createRole,
//     modules.addModules,
//     (request, response) => {
//         return apiResponse.successResponse(response, "Role created successfully!")
//     }
// )

// // get role
// router.post('/get', 
//     auth.isAuth,
//     user.isUserValid,
//     role.getRole,
//     (request, response) => {
//         return apiResponse.successResponseWithData(response, "Role fetched successfully!", request.body.role)
//     }
// )

// router.post('/get/user', 
//     auth.isAuth,
//     user.isUserValid,
//     role.getRole,
//     (request, response) => {
//         return apiResponse.successResponseWithData(response, "Role fetched successfully!", request.body.role)
//     }
// )

// // edit role
// router.post('/edit', 
//     auth.isAuth,
//     user.isUserValid,
//     role.getRole,
//     role.editRole,
//     (request, response) => {
//         return apiResponse.successResponse(response, "Role updated successfully!")
//     }
// )

// export default router;

import { Router } from 'express';
const router = Router();

//controllers
import * as roles from '../controllers/role/role.js';
import * as modules from '../controllers/modules/modules.js';

//helpers
import { getClientIP } from '../helper/formatting.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from '../controllers/user/user.js';
import * as apiResponse from '../helper/apiResponse.js';
import * as designation from "../controllers/designation/designation.js";
import {celebrate} from "celebrate";
import { validation } from '../helper/validationSchema.js';

router.use((request,response,next)=>{
   console.log('\nrole Route');
   console.log(request.originalUrl);
   request.body.endpoint = request.originalUrl
   request.body.ModuleKey = 'role'
   request.body.IP = getClientIP(request)
   console.log('-------------------------------------------------------');
   return next();
})

//ROUTES
router.post('/add',
auth.isAuth,
roles.addValidation,
modules.isRoleModuleValid,
roles.addRole,
)

//get list of roles
router.get('/list',
auth.isAuth,
user.getLoggedUser,
roles.getRolesList,
(request, response, next) => {
    return apiResponse.successResponseWithData(response, "Roles found successfully!", request.body.allRoles)
})

//adding Role to the User
router.post('/add/user',
// auth.isAuth,
// auth.isUserValid,
roles.isRoleValid,
roles.addRoleToUser,)

router.post('/modules/:type',
(request, response, next) => {
   if(!['add', 'remove'].includes(request.params.type)) return apiResponse.validationError(response, "Invalid Params!")

   request.body.params = request.params.type
   return next()
},
auth.isAuth,
user.isUserValid,
roles.updateRoleModules,
(request, response, next) => {
   return apiResponse.successResponseWithData(response, `Module ${request.body.params == 'add' ? "added" : "removed"} Successfully`)
}
)

router.post('/get/modules',
(request, response, next) => {
   request.body.getModules = true
   return next()
},
auth.isAuth,
user.isUserValid,
roles.getModules,
(request, response, next) => {
   return apiResponse.successResponseWithData(response, "Modules Found Sucsussfully", request.body.roleModules)
}
)


// assigning role to designation
router.post('/assign/designation',
   celebrate(validation.assignRoleToDesignation),
   auth.isAuth,
   user.isUserValid,
   designation.getOneDesignation,
   roles.isRoleValid,
   roles.isAssignRoleToDesignation,
   roles.assignRoleToDesignation,
   (request, response) => {
      return apiResponse.successResponse(response, "Role assigned to designation successfully!")
   }
)



export default router;