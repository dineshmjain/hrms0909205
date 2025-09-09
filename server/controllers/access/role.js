import { ObjectId } from "mongodb";

//models
import * as roleModel from "../../models/access/role.js";
import * as moduleModel from "../../models/access/module.js";

//helpers
import * as apiResponse from "../../helper/apiResponse.js";

//get admin role for admin registration defaultely
export const getAdminRole=async(request,response,next)=>{
    try{
      // if(request.body.authUser?.owner) return next()
      const getAdminRole = await roleModel.getAdminRole(request.body)
     
      if (getAdminRole.status) {
        request.body.adminRole=getAdminRole.data._id
        return next()
      }else{
        return apiResponse.notFoundResponse(response, "Admin role not found!");
      }
  
    }catch (error) {
      request.logger.error("Error in getAdminRole",{ stack: error.stack });
      return apiResponse.somethingResponse(response);
  }
  }

export const getRoleModules = async (request, response, next) => {
  try {
    roleModel.getRoleModules(request.body).then((res) => {
      if (!res.status) throw {};
      request.body.user['modules'] = res.data?.reduce((map, obj) => {
        map[obj.moduleKey] = obj.permissions;
        return map;
      }, {});
      request.body.userRolePriority = res.data.length > 0 ? res.data[0].priority : null
      return next()
    })
      .catch((error) => {
        console.log(error);
        return apiResponse.somethingResponse(response, error.message);
      });
  } catch (error) {
    console.log(error);
    return apiResponse.somethingResponse(response, error);
  }
};