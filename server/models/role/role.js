// import { ObjectId } from 'mongodb';
// import { aggregate, bulkWriteOperations, create, findOneAndUpdate, getMany, getOne, updateOne,aggregationWithPegination, updateOneWithupsert } from '../../helper/mongo.js';
// import {getCurrentDateTime} from "../../helper/formatting.js"
// const collection_name = "roles"


// // export const getRole = async (body) => {
// //     try {
// //         let query = {
// //             $or: [
// //                 { name: body.name },
// //                 { _id: new ObjectId(body.roleId) }
// //             ]
// //             // name : body.name,
// //             // orgId : new ObjectId(body.user.orgId)
// //         }
// //         return await getOne(query, collection_name)
// //     } catch (error) {
// //         throw error;
// //     }
// // }


// export const getRole = async (body) => {
//     try {
//         let query = {}
//         if (body.roleId || body.name) {
//             query = {
//                 $or: [
//                     body.name ? { name: body.name } : null,
//                     body.roleId ? { _id: new ObjectId(body.roleId) } : null,
//                 ].filter(Boolean) // Remove null entries from the array
//                 // name : body.name,
//                 // orgId : new ObjectId(body.user.orgId)
//             }
//         }

//         return await getMany(query, collection_name)
//     } catch (error) {
//         throw error;
//     }
// }

// export const createRole = async (body) => {
//     try {
//         let query = {
//             name: body.name,
//             isActive: true,
//             // modules : body.modules,
//             craetedBy: body.user._id,
//             createdDate: getCurrentDateTime()
//         }
//         return await create(query, collection_name)
//     } catch (error) {
//         throw error;
//     }
// }


// export const editRole = async (body) => {
//     try {
//         const query = { _id: new ObjectId(body.roleId) };

//         const role = body.role

//         const update = {};
//         const invalidModules = [];
//         const validModules = [];

//         // Validate and categorize modules
//         if (body.modules && typeof body.modules === "object") {
//             Object.keys(body.modules).forEach((moduleId) => {
//                 if (role[0].modules && role[0].modules[moduleId]) {
//                     validModules.push(moduleId);
//                 } 
//                 else {
//                     invalidModules.push(moduleId);
//                 }
//             });

//             if (invalidModules.length > 0) {
//                 console.warn(`Invalid modules: ${invalidModules.join(", ")}`);
//             }
//         }

//         // Update top-level fields (name, isActive)
//         if (body.name) {
//             update.$set = { ...update.$set, name: body.name };
//         }
//         if (body.isActive !== undefined) {
//             update.$set = { ...update.$set, isActive: body.isActive };
//         }

//         // Update valid modules
//         validModules.forEach((moduleId) => {
//             const moduleKey = `modules.${moduleId}`;
//             const moduleData = body.modules[moduleId];

//             if (moduleData.name) {
//                 update.$set = { ...update.$set, [`${moduleKey}.name`]: moduleData.name };
//             }
//             if (moduleData.isActive !== undefined) {
//                 update.$set = { ...update.$set, [`${moduleKey}.isActive`]: moduleData.isActive };
//             }
//             if (moduleData.permissions) {
//                 update.$set = { ...update.$set, [`${moduleKey}.permissions`]: moduleData.permissions };
//             }
//         });

//         // Apply the update operation
//         if (Object.keys(update).length > 0) {
//           return await updateOne(query, update, collection_name);
//         }

//         // // Return response with updated and invalid modules
//         // return {
//         //     status: "success",
//         //     message: "Role updated successfully",
//         //     updatedModules: validModules,
//         //     invalidModules: invalidModules.length > 0 ? invalidModules : null,
//         // };
//     } catch (error) {
//         console.error("Error while editing role:", error.message);
//         throw error;
//     }
// };

import { ObjectId } from 'mongodb';
import { create,updateOne,getOne, aggregate, updateMany} from '../../helper/mongo.js';
import { getCurrentDateTime } from '../../helper/formatting.js';
import * as constants from '../../helper/constants.js';
import { logger } from "../../helper/logger.js";


const collection_name = "roles"

export const addRole = async (body) => {
    try {
        const currentDate = getCurrentDateTime()
        let query = {
            name: body.name,
            description: body.description,
            // parent :new ObjectId(body.roleID),
            modules: body.modules,
            createdDate: currentDate,
            isActive: true,
            priority : body.priority
          }
      
        return await create(query,collection_name)
    } catch (error) {
        return {status : false, message: "failed to add role", error}
        
    }
}

//get list of roles
export const getRolesListModel=async(body)=>{
    try{
        
        let query = [
          {
            $match:{
              
            }
          },
            {
              $lookup: {
                from: "modules",
                localField: "modules.moduleId",
                foreignField: "_id",
                as: "m",
              },
            },
            {
              $lookup: {
                from: "User",
                localField: "CreatedBy",
                foreignField: "_id",
                as: "CreatedByUser",
              },
            },
            {
              $project: {
                _id: 0,
                roleId: "$_id",
                name: "$name",
                description: "$description",
                
                modules: "$m",
                Modules: "$modules",
                createdDate: "$createdDate",
                modifyDate: "$modifyDate",
                status: "$isActive",
                priority: 1,
              },
            },
            {
              $sort: {
                RoleId: 1,
              },
            },
          ]
          if(body.priority) {
            query[0]['$match']['priority'] = {$gt : body.Priority}
          }
          return await aggregate(query,collection_name)

    }catch (error) {
        console.log(".....error....",error)
        return  {status : false, message: "something went wrong", error}
        
    }
}

export const getModules = async (body) => {
    try {
        let role;

        if (body.getModules) {
          role = new ObjectId(body.roleId);
        } else if (body.addUser) {
          role = { $in: body.roles.map(m => new ObjectId(m)) };
        } else if (body.updateUser) {
            // role = body.authUser?.role || body.user?.roleId || body.userDetails?.role
          role = new ObjectId(body?.roleId)
        }
        else {
          role = { $in: body.user?.role}
        }

        let query = [
            {
                $match: {
                    _id: role
                },
            },
            {
                $lookup: {
                    from: "modules",
                    localField: "modules.moduleId",
                    foreignField: "_id",
                    as: "m",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "CreatedBy",
                    foreignField: "_id",
                    as: "CreatedByUser",
                },
            },
            {
                $project: {
                    _id: 0,
                    roleId: "$_id",
                    name: "$name",
                    description: "$description",
                    modules: "$m",
                    Modules: "$modules",
                    createdDate: "$createdDate",
                    modifyDate: "$modifyDate",
                    status: "$isActive",
                    priority: 1,
                },
            },
        ]
        return await aggregate(query, collection_name)
    } catch (error) {
        console.log(".....error....", error)
        return { status: false, message: "something went wrong", error }

    }
}

export const getRoleModules = async(body)=>{
    try{
      let role = body?.updatingUserDetails ? body.updatingUserDetails?.role[0] : body.user?.role[0]
        let query = [
          {
            $match: {
              _id:role
            },
          },
          {
            $unwind: "$modules",
          },
          {
            $lookup: {
              from: "modules",
              localField: "modules.moduleId",
              foreignField: "_id",
              as: "module",
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              priority : 1,
              Description: 1,
              moduleKey: {
                $arrayElemAt: ["$module.moduleKey", 0],
              },
              permissions:"$modules.permissions",
              isRoleActive: "$isActive",
              isModuleActive: {
                $arrayElemAt: ["$module.isActive", 0],
              }
            }
          },
          {
            $match:{
              isModuleActive:1,
              isRoleActive:true
            }
          },
          {
            $project: {
              _id:0,
              moduleKey:1,
              permissions:1,
              priority : 1
            }
          }
        ]
          let data = await aggregate(query,collection_name)
         
          return data

    }catch (error) {
        console.log(".....error....",error)
        return  {status : false, message: "something went wrong", error}
        
    }
}


//adding role to the user
export const addRoleToUser = async (body) => {
  try {
    let query = {
      _id: new ObjectId(body.objectUserID),
      isActive: true
    }
    let roleIds = body.roleIds.map(role => new ObjectId(role.id));

    let update = {
      $addToSet: { 
        role: { $each: roleIds } 
      }
    };

    return await updateOne(query, update, "user")

  } catch (error) {
    console.log("...error...", error)
    return { status: false, message: "Failed to add role" }
  }
}

//checking role is valid before assigning role to user
export const isRoleValid = async (roleId) => {
  try {
    let query = { _id: new ObjectId(roleId) };
    const roleResponse = await getOne(query, collection_name);
    return roleResponse;
  } catch {
    return { status: false, message: "Failed to get role" };
  }
}


//get admin role for admin registration defaultely
export const getAdminRole=async(body)=>{
  try{
    
    let query = {
      name:constants.role.ADMIN || 'Admin',
      priority: 1,
      isActive: true
  }

   return await getOne(query,collection_name)

}catch (error) {
    return  {status : false, message: "Failed to get admin role", error}
    
}
}

export const roleBasedModules = async (body) => {
  try {

    let params = {}

    if(body.roleId) params['_id'] = new ObjectId(body.roleId)
    else params['_id']= { $in: body.user.role }

    let query = [
      {
        $match: params,
      },
      {
        $lookup: {
          from: "modules",
          localField: "modules.moduleId",
          foreignField: "_id",
          as: "module",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          modules: 1,
          isActive: 1,
          priority: 1,
          createdDate: 1,
          module: {
            $map: {
              input: "$module",
              as: "m",
              in: {
                _id: "$$m._id",
                name: "$$m.name",
                moduleKey: "$$m.moduleKey",
              },
            },
          },
        },
      },
    ]
    return await aggregate(query,collection_name)
  } catch(error) {
      return {status : false, message : "Failed to add module",error}
  }
}


export const addtoExistingModule = async (body) => {
  try {
    let query = {_id:new ObjectId(body.roleId)}
    let update = {$push:{
      modules:{
        "moduleId": new ObjectId(body.moduleId),
        "permissions": body.permissions
      },
    }}

    return await updateOne(query,update,collection_name,{ip:body.IP,endpoint : body.endpoint, body, queryString : JSON.stringify(query)})

  } catch {
    return { status: false, message: "Failed to get role" }
  }
}

export const revertModuleIds = async (body) => {
  try {
    
      let query = {
          _id: new ObjectId(body.roleId),
          "modules.moduleId": new ObjectId(body.moduleId)
      }
    let update = {$pull:{
      modules:
      {
        "moduleId": new ObjectId(body.moduleId)
      },
    }}
    // console.log(query, update)
    return await updateMany(query,update,collection_name,{ip:body.IP,endpoint : body.endpoint, body, queryString : JSON.stringify(query)})
  } catch {
    return { status: false, message: "Failed to get role" }
  }
}

export const isMultipleMappedRoleValid = async (body) => {
  try {
    let roles = body.Roles.map(r=>new ObjectId(r.roleId))
    let query = {_id:{$in:roles}}

    return await getMany(query, collection_name)

  } catch {
    return { status: false, message: "Failed to get role" }
  }
}

export const updateRoleModules = async (body) => {
  try {
    let query = {_id:new ObjectId(body.roleId)}
    let dict = {add : "$push", remove: "$pull"}
    let update = {
      [dict[body.params]]:{
      modules:{
        "moduleId": new ObjectId(body.moduleId),
        "permissions": body.permissions
      }
    }}

    return await updateOne(query,update,collection_name,{ip:body.IP,endpoint : body.endpoint, body, queryString : JSON.stringify(query)})

  } catch(error) {
    return { status: false, message: "Failed to get role" }
  }
}

export const updatetoExistingModule = async (body) => {
  try {
    if(body.remove === true){
        return { status: false, message: "Module is removed from this role!" };
    }
    let query = {_id:new ObjectId(body.roleId)}
    let update = {
      $push:{
      modules:{
        "moduleId": new ObjectId(body.moduleId),
        "permissions": body.permissions
      }
    }}

    return await updateMany(query,update,collection_name,{ip:body.IP,endpoint : body.endpoint, body, queryString : JSON.stringify(query)})

  } catch(error) {
    return { status: false, message: "Failed to get role" }
  }
}




export const assignRoleToDesignation = async (body) => {
  try {
    let query = {_id:new ObjectId(body.designationId)}
    const assignedRoles=body.roles.map(r => new ObjectId(r))
    let update = {
      $set:{
        roles:assignedRoles[0],
        modifiedBy: new ObjectId(body.user._id),
        modifiedDate: new Date()
      }
    }
    return await updateOne(query,update,"designation")

  } catch(error) {
    logger.error("Error while assignRoleToDesignation in role model ", { stack: error.stack });
    throw error;
  }
}