// import * as apiResponse from '../../helper/apiResponse.js'
// import * as roleModel from '../../models/role/role.js'
// import { ObjectId } from 'mongodb';


// export const getRole = async (request, response, next) => {
//     try {
//         roleModel.getRole(request.body).then(res => {
//             if (res.status) {
//                 // request.body.role = Object.assign({}, ...res.data)
//                 request.body.role = res.data
//                 return next()
//             }
//             return next()
//         }).catch(error => {
//             request.logger.error("Error while getting role", { stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         })
//     }
//     catch (error) {
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }

// export const createRole = async (request, response, next) => {
//     try {
//         if (request.body.role[0]) return apiResponse.duplicateResponse(response, "Role already exixts with this name!")
//         roleModel.createRole(request.body).then(res => {
//             if (res.status) {
//                 request.body.roleId = res.data.insertedId
//                 return next()
//             }
//             else throw {}
//         }).catch(error => {
//             request.logger.error("Error while creating role", { stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         })
//     }
//     catch (error) {
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }

// export const editRole = async (request, response, next) => {
//     try {
//         if (!request.body.role[0]) return apiResponse.duplicateResponse(response, "Role doesn't exists!")
//         roleModel.editRole(request.body).then(res => {
//             if (res.status) {
//                 return next()
//             }
//             else throw {}
//         }).catch(error => {
//             request.logger.error("Error while creating role", { stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         })
//     }
//     catch (error) {
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }

// export const checkPermission = async (request, response, next) => {
//     try {
//         if (request.body.user.owner === true) return next()
//         roleModel.getRole(request.body.user).then(res => {
//             if (res.status) {
//                 // Extract user data and validate permissions
//                 const userData = res.data[0];
//                 if (!userData.modules || typeof userData.modules !== "object") {
//                     return apiResponse.notFoundResponse(response, "Modules data not found!");
//                 }
//                 let hasCreatePermission = false;
//                 // Iterate over modules to check for desired module and its permissions
//                 for (const [moduleId, moduleData] of Object.entries(userData.modules)) {
//                     if (moduleData.name === "role" && moduleData.permissions && moduleData.permissions.includes("c")) {
//                         hasCreatePermission = true;
//                         break;
//                     }
//                 }
//                 if (!hasCreatePermission) {
//                     return apiResponse.notFoundResponse(response, "You do not have permission to create roles!");
//                 }

//                 return next()
//             }
//         }).catch(error => {
//             request.logger.error("Error while getting role", { stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         })
//     }
//     catch (error) {
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }


import { ObjectId } from "mongodb";

//models
import * as roleModel from "../../models/role/role.js";
import * as moduleModel from "../../models/modules/modules.js";

//helpers
import * as apiResponse from "../../helper/apiResponse.js";
import { descriptionSchema, nameSchema, numOneToTenSchema, requiredSchema } from "../../helper/joiSchema.js";
import { allPermissions } from '../../helper/constants.js';
import { logger } from '../../helper/logger.js';
import * as designationModel from '../../models/designation/designation.js';

export const addValidation = async (request, response, next) => {
  try {
    let nameValidation = nameSchema.validate(request.body.name);
    if (nameValidation.error)
      return apiResponse.validationError(response, "Please enter a valid role name");

    let descriptionValidation = descriptionSchema.validate(request.body.description);
    if (descriptionValidation.error)
      return apiResponse.validationError(response, "Please enter a valid role description");

    
    // let priorityValidation = numOneToTenSchema.validate(request.body.priority);
    // if (priorityValidation.error)
    //   return apiResponse.validationError(response, "Please enter a valid role priority");
    
    let modulesValidation = requiredSchema.validate(request.body.modules);
    if (modulesValidation.error)
      return apiResponse.validationError(response, "Please add one or more modules to the roles");

    return next();

  } catch (error) {
    console.log(error);
    return apiResponse.somethingResponse(response);
  }
  
};

export const updateRoles = async (request, response, next) => {
  try {
    let roles = request.body.roles;

    if (roles && roles.length > 0) {
      let rolePromises = [];

      rolePromises = roles.map((role) =>
        roleModel.addtoExistingModule({
          ...role,
          moduleId: request.body.moduleId,
        })
      );

      let rolePromiseResult = await Promise.all(rolePromises);

      //check promise results
      //if any promise failed returned with error
      if (rolePromiseResult.filter((rpr) => rpr.status === false).length > 0) {
        let deleteAddedModule = await moduleModel.deleteModule(request.body);
        if (!deleteAddedModule.status) throw {};

        throw new Error("Rejected Promise found");
      }
    }

    return next();
  } catch (error) {
    return apiResponse.somethingResponse(response, error.message);
  }
};

export const addRole = async (request, response, next) => {
  try {
    const module = request.body.modules.map((m) => {
      return {
        moduleId: new ObjectId(m.moduleId),
        permissions: m.permissions.filter(
          (permission) => permission.trim() !== ""
        ),
      };
    });
    console.log(module, "Module");
    // request.body.modules = request.body.modules.filter(
    //   (module) => module.permissions.length > 0
    // );
    const updateModule=module.filter(
        (module) => module.permissions.length > 0
      );
    request.body.modules=updateModule
    roleModel
      .addRole(request.body)
      .then((res) => {
        if (res.status) {
          return apiResponse.successResponse(
            response,
            "Role added successfully"
          );
        } else throw {};
      })
      .catch((error) => {
        return apiResponse.somethingResponse(response);
      });
  } catch (error) {
    console.log(error);
    return apiResponse.somethingResponse(response);
  }
};

//checking role Id 
// export const isRoleValid = async (req, res, next) => {
//   try {
//     const isRoleValidation = await roleModel.isRoleValid(req.body);
//     console.log(".....isRoleValidation....",isRoleValidation)
//     if (isRoleValidation.status) {
//       req.body.isActive = isRoleValidation.data.isActive;
//       req.body.roleDetails = isRoleValidation.data;
//       req.body.objectRoleID = isRoleValidation.data._id;
//       return next();
//     } else {
//       return apiResponse.notFoundResponse(res, "Role Id not found!");
//     }
//   } catch (error) {
//     return apiResponse.somethingResponse(res, error.message);
//   }
// };

export const isRoleValid = async (request, response, next) => {
  try {
    // const roleIds = req.body.roleIds;
    if(request.body.updateUser) {
      if(request.body.roles == undefined || request.body.roles.length == 0) return next()
    }
    let roles = request.body.roles || request.body.userDetails?.role || request.body.user?.roleId || request.body.authUser?.role;   // Assuming roleIds is an array  like ["12333aee", "wer45566"]
    let allValid = true;
    let roleDetailsArray = [];
    let invalidRoles = [];
    roles = Array.isArray(roles) ? roles : [roles]; // Ensure roles is an array
    for (const role of roles) {
      const isRoleValidation = await roleModel.isRoleValid(role);
      if (isRoleValidation.status) {
        roleDetailsArray.push(isRoleValidation.data);
      } 
      else {
        allValid = false;
      //   invalidRoles.push(role); // Collect invalid role IDs
      }
    }
    
    if (allValid) {
      if(request.body.addUser || request.body.updateUser) {
        roleDetailsArray[0].modules = roleDetailsArray[0].modules.reduce((acc, mod) => {
          acc[mod.moduleId.toString()] = mod.permissions
          return acc
        }, {})
      }
      request.body.roleDetailsArray = roleDetailsArray; // Store the details of all valid roles
      return next();
    } else {
      return apiResponse.notFoundResponse(response, `Invalid roles found! Please select valid roles.`);
    }
  } catch (error) {
    return apiResponse.somethingResponse(response, error.message);
  }
};



//get roles list
export const getRolesList = async (request, response, next) => {
  try {
    // let parent = ["admin", "branch manager", ""]

    // if (request.body.Priority > 10) {
    //   return apiResponse.validationError(response, "Please enter Priority below or equal to 10");
    // }
    if(request.body.user?._id.toString()==request.body.userId ) return next()

    const getRoles = await roleModel.getRolesListModel(request.body)
    if (getRoles.status) {
      if(request.originalUrl == '/api/v1/user/details' || request.body.Users[0].owner) {
        request.body.allRoles = getRoles.data
        return next()
      }
      const data = getRoles.data.map(rl => {
        const RoleModules = rl.Modules;
        const modules = rl.modules;

        const Modules = modules.map(lum => {
          const matchModule = RoleModules.find(s => s.moduleId.toString() === lum._id.toString());

          if (matchModule) {
            // console.log(lum.Name, "name");
            return { moduleId: matchModule.moduleId, name: lum.name, permissions: matchModule.permissions };
          } else {
            return { moduleId: null, name: lum.name, permissions: null };
          }
        });
        if(request.body.Priority < rl.priority) {
          return { ...rl, Modules, modules: undefined, moduleNames: Modules.map(module => module.name) };
        }
      });
      return apiResponse.successResponseWithData(response, "Roles Found Successfully", data.filter(d => d != undefined));
      //return apiResponse.successResponse(response,"roles list getting successfully");
    }
    
    return response.status(404).json({
      status: 404,
      message: "list not found"
    })

  } catch (error) {
    console.log(".....error....", error)
    return apiResponse.somethingResponse(response,error);
  }
}


//adding role to the user
export const addRoleToUser=async(request,response)=>{
  try {
    const addRoleStatus = await roleModel.addRoleToUser(request.body);
    if (addRoleStatus.status) {
        return apiResponse.successResponse(response, "Role has been assigned successfully");
    } else {
      const data={
        status:409, 
        message:"adding role to the user has  been failed"
      }
      return response.status(409).json(data)
       
    }
} catch (error) {
    console.log(error);
    return apiResponse.somethingResponse(response);
}

}

//get admin role for admin registration defaultely
export const getAdminRole=async(request,response,next)=>{
  try{
    const getAdminRole = await roleModel.getAdminRole(request.body)
   
    if (getAdminRole.status) {
      request.body.adminRole=getAdminRole.data._id
      return next()
    }else{
      return apiResponse.notFoundResponse(response, "Admin role not found!");
    }

  }catch (error) {
    console.log(error);
    return apiResponse.somethingResponse(response);
}
}

export const roleBasedModules = async (request, response, next) => {
  try {
    roleModel.roleBasedModules(request.body).then((res) => {
        if (!res.status) throw {};

        let {module, modules, ...rest} = res.data[0]
        let map = new Map(module.map(m => [m._id.toString(), m]))
        let merge = modules.map(m => {
          let getDetails = map.get(m.moduleId.toString())
          if(getDetails) {
            // console.log("Module not found for moduleId: ", m.moduleId);
            return {moduleId : m.moduleId, moduleName : getDetails.name, moduleKey : getDetails.moduleKey, permissions : m.permissions}
          }
          // console.log(getDetails)
        })
        request.body.roleModules = {...rest, modules : merge}
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

export const checkModulePermission = (moduleKey, requiredPermission) => {
  return (req, res, next) => {
    const roleModules = req.body.roleModules;

    if (roleModules &&Array.isArray(roleModules.modules)) 
    {
      const hasPermission = roleModules.modules.some((module) =>
        module.moduleKey === moduleKey &&
        Array.isArray(module.permissions) &&
        module.permissions.includes(requiredPermission)
      );

      if (hasPermission) {
        return next();
      }
    }

    return apiResponse.notFoundResponse(res, "Access Denied");
  };
};

export const getModules = async(request, response, next) => {
  try {
    if(request.body.addUser || request.body.updateUser) {
      if(!request.body.disabledModules || request.body?.disabledModules?.length == 0) return next()
    }
      roleModel.getModules(request.body).then(res => {
        if(!res.status) throw {}
        
        request.body.roleModules = res.data[0]
        
        if(request.body.getModules) {
          let mapModules = new Map(res.data[0].Modules.map(m => [m.moduleId.toString(), m]))
          request.body.roleModules = res.data[0].modules.map(m => {
            let getPermission = mapModules.get(m._id.toString())
            let permissions = {}
            allPermissions.forEach(al => {
              permissions[al] = getPermission.permissions.includes(al) ? "checked" : "disabled"
            })

             return {moduleId : m._id, name : m.name, moduleKey:m.moduleKey, permissions : permissions}
          })
        }
        return next()
      }).catch(error => {
          return apiResponse.somethingResponse(response, "Unable to get role modules")
      })
  }
  catch (error) {
      return apiResponse.somethingResponse(response, error.message)
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

export const getEnteredUserModules = async (request, response, next) => {
  try {
    roleModel.getRoleModules(request.body).then((res) => {
        if (!res.status) throw {};
        request.body.enteredUserModules = res.data?.reduce((map, obj) => {
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

export const   checkRoleModules = async(request, response, next) => {
  try {
    if(!request.body.disabledModules || request.body?.disabledModules?.length == 0) return next()
    let dbModules = request.body.roleModules.Modules
    let modules = request.body.disabledModules
    let map = new Map(dbModules.map(m => [m.moduleId.toString(), m.permissions]))
    let map2 = {}

    let disabled = {}
    let isOtherModule = false
    let isOtherPermission = false
    modules.forEach(a => {
      let getDetails = map.get(a.moduleId.toString())
      if (getDetails) {
        map2[a.moduleId.toString()] = a.permissions
        let disabledPermission = []
        a.permissions.forEach(gd => {
          if (getDetails.includes(gd)) {
            disabledPermission.push(gd)
          } else {
            isOtherPermission = true
          }
        })
        if (disabledPermission.length > 0) {
          disabled[a.moduleId.toString()] = disabledPermission
        } 
        else {
          delete disabled[a.moduleId.toString()]
        }
      } else {
        isOtherModule = true
      }
    })
    if(isOtherModule) return apiResponse.validationError(response, "Cannot add Modules")
    if(isOtherPermission) return apiResponse.validationError(response, "Cannot add Permission")
    request.body.disabledModules = disabled
    return next()
  }
  catch(error) {
    return apiResponse.somethingResponse(response, error.message)
  }
}


// export const revertModuleIds = (request, response, next) => {
//     try {
//         if (!request.body.roles) return next()
//         roleModel.revertModuleIds(request.body).then(res => {
//             //CALLED NEXT MIDDELWARE EVEN IF MODULEID NOT FOUND (modifiedcount == 0)
//             return next()
//         }).catch(userError => {
//             return apiResponse.notFoundResponse(response, "Role Id not found!")
//         })
//     } catch (error) {
//         return apiResponse.somethingResponse(response)
//     }
// }

export const revertModuleIds = async(request, response, next) => {
    try {
        if (!request.body.roles) return next()
        let roles = request.body?.roles
        if(roles?.length>0){
            let rolePromises = []
            
            rolePromises = roles.map(role => roleModel.revertModuleIds({...role,moduleId : request.body.moduleId}))
  
            let rolePromiseResult = await Promise.all(rolePromises)
            console.log(rolePromiseResult);
        }
        return next()
    } catch (error) {
        return apiResponse.somethingResponse(response)
    }
}



export const updateModulesinRoles = async(request, response, next) => {
  try {
      let roles = request.body?.roles
      if(roles?.length>0){
          let rolePromises = []
          
          rolePromises = roles.map(role => roleModel.updatetoExistingModule({...role,moduleId : request.body.moduleId}))

          let rolePromiseResult = await Promise.all(rolePromises)
          console.log(rolePromiseResult);
      }

      return next()


      
  } catch (error) {
      return apiResponse.somethingResponse(response,error.message)
  }
}

export const isMultipleMappedRoleValid = (request, response, next) => {
  try {
      if(request.body.Roles === undefined) {
          if(request.body.RoleSkip) {
              return next()
          }
          else return apiResponse.validationError(response, "Please Enter Roles")
      }
      roleModel.isMultipleMappedRoleValid(request.body).then(res => {
          if (res.status) {
              request.body.RoleDetails = res.data
              if(request.body.RoleDetails?.length !== request.body.Roles?.length)
              return apiResponse.validationError(response, "Invalid RoleId")
          
              return next()
          }
          else throw {}
      }).catch(userError => {
          return apiResponse.notFoundResponse(response, "Invalid Role!")
      })
  } catch (error) {
      return apiResponse.somethingResponse(response)
  }
}

export const getRolesWithMapStatus = async(request,response, next) => {
  try {
    
    if(request.body.user._id.toString()==request.body.userId ) return next()
    let mapRoles = new Map(request.body.roleDetailsArray.map(mr => [mr._id.toString(), mr]))
    let roles = request.body.allRoles
    let result = []
    let assignedRoles = []
    roles.forEach(r => {
      let getRole = mapRoles.get(r.roleId.toString())
      if(getRole) {
        assignedRoles.push(getRole)
      }
      result.push({roleId : r.roleId.toString(), name : r.name, priority : r.priority, assigned : request.body.userDetails.role.map(r => r.toString()).includes(r.roleId.toString()) ? true : false})
    })
    
    result = result.filter(f => f.priority > assignedRoles[0].priority )
    request.body.rolesResult = result
    return next()

  }
  catch (error) {
    return apiResponse.somethingResponse(response, error.message)
  }
}

export const updateRoleModules = async(request,response, next) => {
  try {
    roleModel.updateRoleModules(request.body).then(res => {
      if(!res.status) throw {} 

      return next()

    }).catch (error => {
      return apiResponse.somethingResponse(response, "unable to update role Module")
    })

  }
  catch (error) {
    return apiResponse.somethingResponse(response, error.message)
  }
}


export const isAssignRoleToDesignation = (request, response, next) => {
  try {
    let alreadyAssignedRoles = [];
    if(request.body.designation && request.body.designation.roles) {
      const roles=Array.isArray(request.body.designation.roles) ? request.body.designation.roles : [request.body.designation.roles];
      alreadyAssignedRoles = roles.map(role=>role.toString()) || [];
    }

    if(alreadyAssignedRoles.length === 0) {
      request.body.roles =Array.isArray( request.body.roles) ?  request.body.roles : [ request.body.roles];
      return next()
    }
    
    const requestedRoles = Array.isArray(request.body.roles)? request.body.roles : [request.body.roles];
    const unassignedRoles = requestedRoles.filter(
      role => !alreadyAssignedRoles.includes(role)
    );
    if( unassignedRoles.length === 0) {
      return apiResponse.validationError(response, "roles are already assigned to this designation");
    }
    // request.body.roles = unassignedRoles;
    request.body.roles = unassignedRoles;
    return next()
  } catch (error) {
    logger.error("Error while get assignedRoles in role controller ", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message)
  }
}

export const assignRoleToDesignation=(request,response,next)=>{
  try{
    roleModel.assignRoleToDesignation(request.body).then(res=>{
        if(res.status){
            // return apiResponse.successResponse(response, "Role assigned to designation successfully")
            return next()
        }
        return apiResponse.validationError(response, "failed to assigned role to this designation")
    }).catch(error=>{
        logger.error("Error while assigning role to designation in role controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, "Unable to assign role to designation")
    })

  }catch(error){
    logger.error("Error while get assignRoleToDesignation in role controller ",{ stack: error.stack });
    return apiResponse.somethingResponse(response, error.message)  
  }
}

export const getRoleDetails=(request,response,next)=>{
  try{
    if(request.body.authUser?.role[0]==null)return next()
    roleModel.isRoleValid(request.body.authUser.role[0]).then(res=>{
      if(res.status){
        request.body.roleName=res.data.name
        return next()
      }
      return next()
    }).catch(error=>{
      logger.error("Error while get getRoleDetails in role controller ",{ stack: error.stack });
      return apiResponse.somethingResponse(response, "Unable to get RoleDetails")
    })

  }catch(error){
    logger.error("Error while get getRoleDetails in role controller ",{ stack: error.stack });
    return apiResponse.somethingResponse(response, error.message)  
  }
}