//packages
import * as express from 'express';
import * as auth from '../controllers/auth/auth.js';
import * as apiResponse from '../helper/apiResponse.js';
import * as user from '../controllers/user/user.js';
import * as org from "../controllers/organization/organization.js";
import * as salary from "../controllers/salary/salary.js";

const router = express.Router();


router.use((request, response, next) => {
    console.log('\nmessage middleware');
    console.log(request.originalUrl)
    //request.body.endpoint = request.originalUrl
    console.log('-------------------------------------------------------');
    return next();
})

router.post(
   "/component/create",
//    celebrate(validation.addingUser),
   auth.isAuth,
   user.isUserValid,
   org.getOrg,
   salary.createSalaryComponent,
   (request,response) => {
      return  apiResponse.successResponse(response, "Component Created Successfully")
   }
)

router.post(
  "/component/update",
  auth.isAuth,
  user.isUserValid,
  org.getOrg,
  salary.updateSalaryComponent,
  (request, response) => {
    return apiResponse.successResponse(response, "Component Updated Successfully");
  }
);

router.post(
   "/component/toggle",
//    celebrate(validation.addingUser),
   auth.isAuth,
   user.isUserValid,
   org.getOrg,
   salary.toggleSalaryComponents,
   (request,response) => {
      return  apiResponse.successResponse(response, "Component Updated Successfully")
   }
)

router.post(
    "/component/list",
    // celebrate(validation.getDepartment),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    salary.listSalaryComponents,
    (request,response) => {
        return  apiResponse.responseWithPagination(response, "Data found successfully",request.body.components)
    }
);

router.post(
   "/template/create",
//    celebrate(validation.addingUser),
   auth.isAuth,
   user.isUserValid,
   org.getOrg,
   salary.createSalaryTemplate,
   (request,response) => {
      return  apiResponse.successResponse(response, "Template Created Successfully")
   }
)

router.post(
    "/template/list",
    // celebrate(validation.getDepartment),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    salary.listSalaryTemplates,
    (request,response) => {
        return  apiResponse.responseWithPagination(response, "Data found successfully",request.body.components)
    }
);

router.post(
    "/template/preview",
    // celebrate(validation.getDepartment),
    auth.isAuth,
    user.isUserValid,
    org.getOrg,
    salary.previewSalaryTemplate,
    (request,response) => {
        return  apiResponse.responseWithPagination(response, "Data found successfully",request.body.components)
    }
);

export default router;