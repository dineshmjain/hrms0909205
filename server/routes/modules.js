// import { response, Router } from 'express';
// import * as auth from '../controllers/auth/auth.js'
// import * as user from '../controllers/user/user.js'
// import * as role from '../controllers/role/role.js'
// import * as apiResponse from '../helper/apiResponse.js'
// import * as modules from '../controllers/modules/modules.js'
// const router = Router();

// router.post('/create',
//     modules.getModule,
//     modules.createModule,
//     (request, response, next) => {
//         return apiResponse.successResponse(response, "module created sucessfully!")
//     }
// )

// router.post('/get',
//     modules.getModule,
//     (request, response, next) => {
//         return apiResponse.successResponseWithData(response, "module fetched sucessfully!", request.body.moduleData)
//     }
// )

// router.post('/edit',
//     modules.getModule,
//     modules.updateModule,
//     (request, response, next) => {
//         return apiResponse.successResponse(response, "module updated sucessfully!")
//     }
// )

// export default router;


import { Router } from "express";
//helpers
import * as apiResponse from "../helper/apiResponse.js";
//controllers
import * as auth from "../controllers/auth/auth.js";
import * as roles from "../controllers/role/role.js";
import * as modules from "../controllers/modules/modules.js";
import * as user from "../controllers/user/user.js";
const router = Router();

router.post(
  "/add",
  // auth.isAuth,
  modules.addValidation,
  modules.addModule,
  roles.updateRoles,
  (request, response) => {
    return apiResponse.successResponse(response, "Module added successfully");
  }
);


router.get('/get',
auth.isAuth,
modules.getAllModules,
(request, response, next) => {
  return apiResponse.successResponseWithData(response, "Modules found succesfully", request.body.modules)
}
)

router.get('/user/get',
auth.isAuth,
// roles.isRoleValid,
user.getUserModules,
(request, response, next) => {
  return apiResponse.successResponseWithData(response, "Role Modules Found Succesfully", request.body.assignedModules)
}
)

router.post('/update',
  auth.isAuth,
  user.isUserValid,
  modules.addValidation,
  modules.isModuleValid,
  roles.revertModuleIds,
  modules.updateModule,
  (request, response, next) =>{
     request.body.RoleSkip = true
     return next()
  },
  roles.isMultipleMappedRoleValid,
  roles.updateModulesinRoles,
  (request,response) => {
     return apiResponse.successResponse(response, "Module updated successfully")
  }
  )

router.get('/user/footer',
  auth.isAuth,
  user.getUserModules,
  modules.getFootBaarByUserModule,
  (request, response, next) => {
    return apiResponse.successResponseWithData(response, "Role Modules Found Succesfully", request.body.footBar)
  }
)

export default router