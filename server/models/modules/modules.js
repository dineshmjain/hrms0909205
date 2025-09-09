// import { ObjectId } from 'mongodb';
// import { aggregate, bulkWriteOperations, create, findOneAndUpdate, getMany, getOne, updateOne,aggregationWithPegination, updateOneWithupsert, createMany } from '../../helper/mongo.js';
// import * as apiResponse from '../../helper/apiResponse.js'

// let collection_name = 'modules'

// // Create module for roles
// export const createModule = async (body) => {
//     try {
//         // Extract modules array from the request body
//         const { modules, createdBy } = body;

//         // Prepare the documents to be inserted
//         const moduleDocuments = modules.map((moduleName) => {
//             const moduleKey = moduleName.toLowerCase().replace(/\s+/g, ''); // Convert to lowercase and remove spaces
//             return {
//                 name: moduleName,
//                 moduleKey: moduleKey,
//                 createdDate: new Date(),
//                 createdBy: createdBy || "system", // Default to "system" if createdBy is not provided
//                 isActive: true
//             };
//         });

//         // Insert the documents into the modules collection
//         return await createMany(moduleDocuments, collection_name);
//     } catch (error) {
//         throw error;
//     }
// };

 
// export const getModule = async (body) => {
//     try {
//         let query = {
//             // name: body.modules
//         }

//         return await getMany(query, collection_name)
//     } catch (error) {
//         console.error("Error while getting modules to role:", error);
//         throw error;
//     }
// }

// // add modules for roles
// // export const addModule = async (body) => {
// //     try {
// //         let query = {
// //             _id: body.roleId
// //         }

// //         // let update = {
// //         //     $set: {
// //         //         module: body.moduleName,
// //         //         _id : body.moduleId,
// //         //         isActive : false
// //         //     }
// //         // }

// //         let objectKey = Object.keys(body.moduleData)[0]

// //         let update = {
// //             $set: {
// //                [`modules.${objectKey}`] : body.moduledata[objectKey]
// //             }
// //         }

// //         return await updateOne(query, update, collection_name)
// //     } catch (error) {
// //         throw error;
// //     }
// // }

// export const addModules = async (body) => {
//     try {
//         const query = {
//             _id: body.roleId
//         };

//         const update = {
//             $set: {
//                 modules: {}
//             }
//         };

//         // Add each module as an object to the `modules` array
//         body.moduleData.forEach((module, index) => {
//             update.$set.modules[index] = {
//                 moduleKey: new ObjectId(module.moduleId),
//                 permissions: module.permissions
//             };
//         });

//         // Perform the update operation
//         return await updateOne(query, update, "roles");
//     } catch (error) {
//         console.error("Error while adding modules to role:", error);
//         throw error;
//     }
// };

// export const updateModule = async (body) => {
//     try {
//         let query = {
//             _id : new ObjectId(body.moduleId)
//         }
//         let updateObj = {
//             modifiedDate : new Date(),
//             modifiedBy : body.userId || 'system'
//         }

//         for(let item in body){
//             updateObj[item] = body[item]
//         }

//         ['moduleData', 'moduleId'].forEach(f => delete updateObj[f])

//         let update = {
//             $set : updateObj
//         }

//         return await updateOne(query, update , collection_name) 
//     } catch (error) {
//         console.error("Error while adding modules to role:", error);
//         throw error;
//     }
// }

// export const isValidModule = async (body) => {
//     try {
//         const allModules = body.moduleDetails; // Array of modules from DB
//         const bodyModules = body.moduleData; // Modules from request
//         const userModules = body.role[0].modules; // Existing modules in user role

//         // Create a map of `_id` from `allModules` for quick lookup
//         const moduleMap = new Map(allModules.map(module => [module._id.toString(), module]));

//         // Arrays to store matched and unmatched modules
//         const matchedModules = [];
//         const unmatchedModules = [];
//         const restrictedModules = []; // For modules the role doesn't have access to

//         // Iterate over `bodyModules` to check for matches
//         bodyModules.forEach(module => {
//             const moduleId = module.moduleId;
//             const moduleDetails = moduleMap.get(moduleId);

//             if (moduleDetails) {
//                 // If matched with allModules, add to matchedModules for further checks
//                 matchedModules.push({
//                     ...moduleDetails,
//                     permissions: module.permissions // Add permissions from `bodyModules`
//                 });
//             } else {
//                 // If not matched with allModules, add to unmatchedModules
//                 unmatchedModules.push({
//                     moduleId: moduleId,
//                     message: "module didn't exist!"
//                 });
//             }
//         });

//         // Check matchedModules against userModules
//         const userModuleKeys = Object.values(userModules).map(userModule => userModule.moduleId.toString());

//         // Filter matchedModules and find restricted ones
//         const finalMatchedModules = [];
//         matchedModules.forEach(module => {
//             if (userModuleKeys.includes(module._id.toString())) {
//                 // If userModules contains the moduleId, add to finalMatchedModules
//                 finalMatchedModules.push(module);
//             } else {
//                 // If not, add to restrictedModules
//                 restrictedModules.push({
//                     moduleId: module._id.toString(),
//                     message: "role didn't have access to these modules"
//                 });
//             }
//         });

//         // Return results
//         return {
//             matchedModules: finalMatchedModules, // Fully validated modules with access
//             unmatchedModules, // Modules that don't exist in `allModules`
//             restrictedModules // Modules the role doesn't have access to
//         };
//     } catch (error) {
//         console.error("Error while validating modules:", error);
//         throw error;
//     }
// }

import { aggregate, create, getMany, getOne, updateOne } from '../../helper/mongo.js';
import { getCurrentDateTime } from '../../helper/formatting.js';
import { logger } from '../../helper/logger.js';
import { ObjectId } from 'mongodb';

const collection_name = "modules"

export const addModule = async (body) => {
    try {
      let name= body.name.trim()
      const moduleKey = name.replace(/\s/g, "").toLowerCase()
      let query = {
        name : body.name,
        moduleKey : moduleKey,
        description: body.description,
        createdDate : getCurrentDateTime(),
        createdBy : 1,
        isActive:true
      }
  
      return await create(query,collection_name,{endpoint : body.endpoint, body, queryString : JSON.stringify(query)})
  
    } catch(error) {
        return {status : false, message : "Failed to add module",error}
    }
}

export const runQuery = async (body) => {
    try {
      let query = body.query
      console.log(JSON.stringify(query));
      return await aggregate(query,collection_name,{endpoint : body.endpoint, body, queryString : JSON.stringify(query)})
    } catch(error) {
        return {status : false, message : "Failed to add module",error}
    }
}

export const getAllModules = async (body) => {
    try {
      let query = [
        {
          $match:{
            $or:[{isActive:1},{isActive:true}]
          }
        },
        {
          $lookup: {
            from: "roles",
            localField: "_id",
            foreignField: "modules.moduleId",
            as: "role",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            createdDate: 1,
            createdBy: 1,
            isActive: 1,
            role: 1,
            roleList: "$role._id",
          },
        },
        {
          $lookup: {
            from: "user",
            let: {
              roleIdList: "$roleList",
            },
            pipeline: [
              {
                $match: {
                  // roles: ,
                },
              },
            ],
            as: "users",
          },
        },
        {
          $project: {
            _id: 0,
            moduleId: "$_id",
            name: "$name",
            description: "$description",
            createdBy: "$createdBy",
            createdDate: "$createdDate",
            modifyDate: "$modifyDate",
            status: "$isActive",
            roleCount: {
              $size: "$role",
            },
            NoOfUsers: {
              $size: {
                $filter: {
                  input: "$users",
                  as: "user",
                  cond: {
                    $gt: [
                      {
                        $size: {
                          $ifNull: [
                            {
                              $setIntersection: [
                                "$$user.role",
                                "$roleList",
                              ],
                            },
                            [],
                          ],
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
            roles: {
              $map: {
                input: "$role",
                as: "role",
                in: {
                  roleId: "$$role._id",
                  roleName: "$$role.name",
                  permissions: {
                    $getField: {
                      field: "permissions",
                      input: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$$role.modules",
                              as: "module",
                              cond: {
                                $eq: [
                                  "$$module.moduleId",
                                  "$_id",
                                ],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ]
      return await aggregate(query,collection_name)
    } catch(error) {
        return {status : false, message : "Failed to get Role Modules",error}
    }
}

export const getOwnerModules = async (body) => {
    try {
        let query = [
            {
              $match:{
                $or:[{isActive:1},{isActive:true}]
              }
            },
            {
              $project: {
                _id : 0,
                moduleId: "$_id",
                name: 1,
                moduleKey: 1,
                isActive: 1,
                // permisiions: ["r", "w", "d", "c"]
                permissions : {
                    c : "checked",
                    r : "checked",
                    u : "checked",
                    d : "checked"
                }
              }
            }
          ]
        return await aggregate(query, collection_name)
    } catch (error) {
        logger.error("Error while addOrganization in org module")
        throw error;
    }
}


export const deleteModule = async (body) => {
  try {
    let query = {
      _id : new ObjectId(body.moduleId),
      IsActive:1
    }

    return await removeOne(query,collection_name,{ip:body.IP,endpoint : body.endpoint, body, queryString : JSON.stringify(query)})

  } catch {
      return {status : false, message : "Failed to delete module"}
  }
}



export const isModuleValid = async(body) =>{
  try{
    let query = { _id : new ObjectId(body.moduleId)}
    return await getOne(query, collection_name)
  }
  catch(error){
    console.log(error);
    return {status : false, message: "Failed to get Module Details"}
  }
}

export const updateModule = async(body) =>{
  try{
    let query = {
      _id : body.ObjectModuleId
    }

    let update = {
      $set : {
        name : body.name,
        description : body.description,
        moduleKey : body.name.trim().replace(/\s/g, "").toLowerCase(),
        modifyDate: getCurrentDateTime(),
        modifyBy: new ObjectId(body.user._id)
      }
    }

    return await updateOne(query, update, collection_name,{ip:body.IP,endpoint : body.endpoint, body, queryString : JSON.stringify(query)})
  }
  catch(error){
    console.log(error)
    return {status:false, message:"Failed to Update Module"}
  }
}

export const getModules=async(body) =>{
  try{
    let query = {
      isActive: { $in: [1, true] }
    }

    return await getMany(query, collection_name)
  }
  catch(error){
    logger.error("Error while getting modules in modules module", { stack: error.stack });
    throw error;
  }
}