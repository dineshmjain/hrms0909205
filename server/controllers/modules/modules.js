// import { ObjectId } from 'mongodb';
// import * as moduleModel from '../../models/modules/modules.js'
// import * as apiResponse from '../../helper/apiResponse.js'


// export const createModule = async (request, response, next) => {
//     try {

//         const { modules, moduleDetails } = request.body;

//         if (!Array.isArray(modules) || modules.length === 0) {
//             return apiResponse.badRequestResponse(response, "Modules array is missing or invalid");
//         }

//         // Check for duplicate modules
//         const duplicates = modules.filter(module =>
//             moduleDetails.some(existingModule => existingModule.name === module)
//         );

//         if (duplicates.length > 0) {
//             return apiResponse.duplicateResponse(response, `Module(s) already exist: ${duplicates.join(", ")}`);
//         }
//         moduleModel.createModule(request.body).then(res => {
//             if (!res.status) throw {}
//             request.body.moduleData = res.data;
//             return next()
//         }).catch(error => {
//             request.logger.error("Error while createModule in modules controller ", { stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         })
//     }
//     catch (error) {
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }


// export const getModule = async(request, response, next) => {
//     try {
//         moduleModel.getModule(request.body).then(res => {
//             if(!res.status) throw {}
//             request.body.moduleDetails = res.data;
//             return next()
//         }).catch(error => {
//             request.logger.error("Error while getModule in modules controller ",{ stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         })
//     }
//     catch (error) {
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }

// export const addModules = async(request, response, next) => {
//     try {
//         moduleModel.addModules(request.body).then(res => {
//             if(!res.status) throw {}
//             request.body.moduleData = res.data;
//             return next()
//         }).catch(error => {
//             request.logger.error("Error while addModule in modules controller ",{ stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         })
//     }
//     catch (error) {
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }


// export const isValidModule = async(request, response, next) => {
//     try {
//         moduleModel.isValidModule(request.body).then(res => {
//             if(!res.status) throw {}
//             request.body.validModules = res.data;
//             return next()
//         }).catch(error => {
//             request.logger.error("Error while addModule in modules controller ",{ stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         })
//     }
//     catch (error) {
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }

// export const updateModule = async(request, response, next) => {
//     try {
//         moduleModel.updateModule(request.body).then(res => {
//             if(!res.status) throw {}
//             // request.body.moduleData = res.data;
//             return next()
//         }).catch(error => {
//             request.logger.error("Error while updateModule in modules controller ",{ stack: error.stack });
//             return apiResponse.somethingResponse(response, error.message)
//         })
//     }
//     catch (error) {
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }



import { ObjectId } from "mongodb";

//models
import * as moduleModel from '../../models/modules/modules.js'

//helpers
import * as apiResponse from "../../helper/apiResponse.js";
import { nameSchema, descriptionSchema } from "../../helper/joiSchema.js";
import * as helper from '../../helper/formatting.js';

export const addValidation = async (request, response, next) => {
  try {
    let nameValidation = nameSchema.validate(request.body.name);
    if (nameValidation.error)
      return apiResponse.validationError(response, "Please enter a valid module name");
    let descriptionValidation = descriptionSchema.validate(request.body.description);
    if (descriptionValidation.error)
      return apiResponse.validationError(response, "Please enter a valid module description");
    return next();
  } catch (error) {
    console.log(error);
    return apiResponse.somethingResponse(response);
  }
}

export const addModule = async (request, response, next) => {
  try {
    moduleModel.addModule(request.body).then((res) => {
        if (res.status && res.data) {
          // return apiResponse.successResponse(response, "Module added successfully")
          request.body.moduleId = res.data.insertedId;
          return next();
        } else throw res.error;
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

export const getAllModules = async (request, response, next) => {
  try {
    moduleModel.getAllModules(request.body).then((res) => {
        if (!res.status) throw {};
        request.body.modules = res.data
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


export const getOwnerModules = async (request, response, next) => {
    try {
        if(!request.body?.authUser?.owner && !request.body?.user?.owner) return next()       
        moduleModel.getOwnerModules(request.body).then((res) => {
            if (!res.status) throw {};
            request.body.assignedModules = res.data
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

export const format = async (request, response, next) => {
    try {
        if(request.body?.module != 'keyvalue') return next()
        else{
          let assignedModules = {}
          request.body.assignedModules.forEach(mods => {
            let permissions = {}
            // if(mods.permissions.c == 'checked') permissions['c'] = true
            // if(mods.permissions.r == 'checked') permissions['r'] = true
            // if(mods.permissions.u == 'checked') permissions['u'] = true
            // if(mods.permissions.d == 'checked') permissions['d'] = true

            if (mods.permissions.c === 'checked') {
              permissions['c'] = true
            } else {
              permissions['c'] = false
            }
          
            if (mods.permissions.r === 'checked') {
              permissions['r'] = true
            } else {
              permissions['r'] = false
            }
          
            if (mods.permissions.u === 'checked') {
              permissions['u'] = true
            } else {
              permissions['u'] = false
            }
          
            if (mods.permissions.d === 'checked') {
              permissions['d'] = true
            } else {
              permissions['d'] = false
            }

            assignedModules[mods.moduleKey]= permissions
          });
          request.body.assignedModules = assignedModules
          return next()
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingResponse(response, error);
    }
};


export const isRoleModuleValid = async (request, response, next) => {
  const modules = request.body.modules;
  try {
    let moduleIds = modules.map((module) =>new ObjectId(module.moduleId))
    let query = [
      {
        $match: {
          _id: {
            $in: moduleIds,
          },
        },
      },
    ];
    moduleModel.runQuery({...request.body,query}).then((res) => {
      if (res.status && res.data) {
        if(res.data.length != moduleIds.length) return apiResponse.validationError(response, "Invalid modules. Please provide a vaild modules.")
        request.body.modulesCollection = res.data
        return next();
      } else throw res.error;
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


export const isModuleValid = async (request, response, next) => {
  try {
      if(request.body.moduleSkip) return next()
      if (request.body.moduleId == undefined) return apiResponse.notFoundResponse(response, "Please select Module Id")
      moduleModel.isModuleValid(request.body).then(res => {
          if (res.status) {
              request.body.IsActive = res.data.IsActive
              request.body.ModuleDetails = res.data
              request.body.ObjectModuleId = res.data._id
              return next()
          }
          else return apiResponse.notFoundResponse(response, "Invalid Module")
      }).catch(planError => {
          return apiResponse.somethingResponse(response)
      })
  } catch (error) {
      console.log(error);
      return apiResponse.somethingResponse(response)
  }
}

export const updateModule = async (request, response, next) => {
  try {
      moduleModel.updateModule(request.body).then(res => {
          if (res.status) {
              return next()
          }
          else throw {}

      }).catch(error => {
          console.log(error)
          return apiResponse.notFoundResponse(response, "Failed to Update Document")
      })
  }
  catch (error) {
      console.log(error)
      return apiResponse.somethingResponse(response,  error.message)
  }
}
export const getFootBaarByUserModule = async (request,response,next) => {
  try{
      const modules = request.body.assignedModules;
      let permissions = {};
      let footBar = [];
      for(const module of modules){
        if(module.name == "Upload" || module.name == "Final submit"){
          permissions[module.name] = module.permissions.includes("c") ? true : false
          continue;
        }
        permissions[module.name] = module.permissions.includes("r") ? true : false
      }
      
      console.log(permissions)
      const footBarList = ["User","Verify","Mismatch Items","Upload","Reports","Final submit","Branch"];
      for(let i = 0; i< footBarList.length; i++){
        if(footBar.length >= 4){
          break;
        }
        if(permissions[footBarList[i]]){
          footBar.push(footBarList[i])
        }
      }
     
      footBar.splice(2,0,"Home");
      request.body.footBar = footBar;
      return next();
  }catch(error){
    console.log(error);
    return apiResponse.somethingResponse(response, error);
  }
}

// format the branch and organization modules
export const formatBranchOrgModules = async (request, response, next) => {
  try {
    if (!request.body.orgExist) return next();

    const structure = request.body.orgDetails?.structure;
    const addBranch = request.body.orgDetails?.addBranch;
    const addSubOrg = request.body.orgDetails?.addSubOrg;

    const assignedModules = request.body.assignedModules;

    if (Array.isArray(assignedModules)) {
      const updatedModules = assignedModules.map(module => {
        const updatedModule = { ...module };

        if (
          ['branch'].includes(structure) &&
          updatedModule.moduleKey === 'branch' && addBranch === false) {
          updatedModule.permissions = { c: "unchecked", r: "checked", u: "checked", d: "unchecked" };
        }

        if (
          ['organization', 'branch'].includes(structure) &&
          updatedModule.moduleKey === 'suborganization' &&
          addSubOrg === false
        ) {
          updatedModule.permissions = { c: "unchecked", r: "unchecked", u: "unchecked", d: "unchecked" };
        }

        return updatedModule;
      });

      request.body.assignedModules = updatedModules;
    }

    // Case 2: If assignedModules is an object
    else if (typeof assignedModules === 'object' && assignedModules !== null) {
      if (
        ['branch'].includes(structure) &&
        assignedModules?.branch &&
        addBranch === false
      ) {
        assignedModules.branch = { c: false, r: true, u: true, d: false };
      }

      if (
        ['organization', 'branch'].includes(structure) &&
        assignedModules?.suborganization &&
        addSubOrg === false
      ) {
        assignedModules.suborganization = { c: false, r: false, u: false, d: false };
      }

      request.body.assignedModules = assignedModules;
    }

    return next();
  } catch (error) {
    console.log(error);
    return apiResponse.somethingResponse(response, error);
  }
};


export const getModules=(request, response, next) => {
  try {
    moduleModel.getModules(request.body).then((res) => {
      if (res?.data?.length > 0) {
        request.body.modules = res.data;
        const finalData=helper.formatModulesWithNames(request.body.roleDetailsArray[0], request.body.modules,request.body.existingDisabledModules)
        request.body.result=finalData
        return next();
      }
      return apiResponse.notFoundResponse(response, "No modules found");
    })
    .catch((error) => {
      request.logger.error("Error while getModules in modules controller ", { stack: error.stack });
      return apiResponse.somethingResponse(response, error.message);
    });
  } catch (error) {
    request.logger.error("Error while getModules in modules controller ", { stack: error.stack });
    return apiResponse.somethingResponse(response, error);
  }
}