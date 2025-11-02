import { ObjectId } from 'mongodb';
import { aggregate, bulkWriteOperations, create, findOneAndUpdate, getMany,aggregationWithPegination, getOne, updateOne,  updateOneWithupsert,findWithPegination} from '../../helper/mongo.js';
import {  convertToYYYYMMDD, findMatchingShift, getCurrentDateTime, matchisActiveStr  } from '../../helper/formatting.js';
import mongoDbService from '../../helper/mongoDbService.js';
const collection_name = "user"
import { QueryBuilder } from "../../helper/filter.js";
import { logger } from '../../helper/logger.js';
import { startOfMonth, subMonths, endOfMonth } from 'date-fns';
import { assignment } from '../assignment/assignment.js';
import { userGetTypeProjection, adminRoleId, allowed_user_params, role, userRoleId } from '../../helper/constants.js';
import { createDefaultDepartments } from '../department/department.js';
import { all } from 'axios';

export const getAuthUser = async (body) => {
  try {
    const query = body.mobile ? { mobile: body.mobile } : body.email ? { email: body.email } : null;

    // let query
    // if (body.mobile) {
    //   query = {
    //     mobile: body.mobile
    //   }
    // }

    // if (body.email) {
    //   query = {
    //     email: body.email
    //   }
    // }
    return await getOne(query, collection_name)
  } catch (error) {
    throw error;

  }
}

export const getUserbyMobile = async (body) => {
  try {
    let query = {
      mobile: body.mobile
    }
    //this below condition for import excel api for checking multiple data
    if(body.multiple){
      query={
        $or:body.clientOwnerData
      }
      return await getMany(query,collection_name)
    }

    return await getOne(query, collection_name)
  } catch (error) {
    return { status: false, message: "failed to get user", error }
  }
}

export const getUserByEmail = async (body) => {
  try {
    let query = {
      email: body.email
    }
    return await getOne(query, collection_name)
  } catch (error) {
    return { status: false, message: "failed to get user", error }
  }
}

export const getUserByClientOrg = async (body) => {
  try {
    let query = {
      orgId: new ObjectId(body.clientId)
    }
    return await getOne(query, collection_name)
  } catch (error) {
    return { status: false, message: "failed to get user", error }
  }
}

export const getUser = async (body) => {
  try {
    let query = {
      _id: new ObjectId(body.userId),
      isActive: true
    }
    body.actionType ? delete query["isActive"] : undefined
    //return await mongoDbService.getOne(collection_name,query);
    return await getOne(query, collection_name)
  } catch (error) {
    return { status: false, message: "failed to get user", error }
  }
}


export const updatePassword = async (body) => {
  try {
    let query = {
      _id: new ObjectId(body.userId),
    }

    let update = {
      $set: {
        password: body.password
      },
    }

    return await updateOne(query, update, collection_name)

  } catch (error) {
    return { status: false, message: "failed to update password", error }

  }
}

export const createUser = async (body) => {
  try {
    let query = {
      mobile: body.mobile,
      // password: body.password,
      ...(body.password && {password : body.password}),
      createdDate: new Date(),
      isActive: true,
      defaultLanguage: body.defaultLanguage ? body.defaultLanguage : "en",
      // name: body.name,
      ...(body.name && { name: body.name}),
      ...(body.relationshipToOrg && { relationshipToOrg: body.relationshipToOrg}),
      ...(body.orgId && {orgId : body.orgId}),
      ...(body.clientId && {orgId : new ObjectId(body.clientId)}),
      ...(body.roleId && {role : [new ObjectId(body.roleId)]}),
    }
    if (body.register) {
      query['otpVerified'] = body.addUser || false
      query["owner"] = true
      query['role'] = [body.adminRole]
      query["onBording"] = false;
      query["stage"] = "org"
    }
    if (body.email) {
      query['email'] = body.email
    }
    if (body.addUser == true) {
      query['name'] = body.name,
        query['createdBy'] = body.authUser?._id || body.user._id || 1
      query['orgId'] = body.user.orgId
      query['mobile'] = body.mobile
      query['joinDate'] = new Date(body.joinDate),
      query['gender'] = body.gender|| null,
      query['dateOfBirth'] = new Date(body.dateOfBirth),
      query['assignmentId'] = body.assignmentIds,
      query['role'] = [new ObjectId(userRoleId)]
      if (Array.isArray(body.branchId)) {
        query['assignedBranchId'] = body.branchId.map(id => new ObjectId(id))
      }   
      let fields = ['martialStatus','bloodGroup','qualification','employeeId',"workTimingType","shiftIds","salaryConfig","emergencyNumber","guardianNumber","guardianName"]

      fields.forEach(f => {
        if (body[f]) {
          if(f === "shiftIds" && Array.isArray(body[f])) body[f] = body[f].map(id => new ObjectId(id))
          query[f] = body[f]
        }
      })
    }
    if(body.profileImage) {
        query['profileImage'] = body.profileImage
    }
    if(body.financialDetails){
        query['financialDetails']=body.financialDetails
    }
    if(body.address){
      // query['address']=body.address
      query['presentAddress'] = body.address
      
    }
    if(body.presentAddress){
      query['presentAddress'] = body.presentAddress
    }
    return await create(query, collection_name)
  }
  catch (error) {
    throw error;
  }
}

// export const getUserList = async (body) => {
//   try {
//     let query = [
//         {
//           $match: {
//             orgId: body.user.orgId,
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             mobile: 1,
//             password: 1,
//             createdDate: 1,
//             isActive: 1,
//             email: 1,
//             name: 1,
//             createdBy: 1,
//             role: {
//               $arrayElemAt: ["$role", 0],
//             },
//             branch: 1,
//             orgId: 1,
//             category:1,
//             group: 1
//           },
//         },
//         {
//           $lookup: {
//             from: "roles",
//             localField: "role",
//             foreignField: "_id",
//             as: "role",
//           },
//         },
//       ]
//       let findIndex = query.findIndex(fi => fi.$match)

//       if(body.filter && body.filter.role) {
//         query[findIndex]['$match']['role'] = { $in : body.filter.role.map(r => new ObjectId(r))}
//       }
//       if(body.filter && body.filter.category) {
//         query[findIndex]['$match']['category'] = { $in : body.filter.category}
//       }
//       if(body.filter && body.filter.group) {
//         query[findIndex]['$match']['group'] = { $in : body.filter.group}
//       }
//     return await aggregate(query, collection_name);
//   } catch (error) {
//     return { status: false, message: "Failed to get user detail by Id" };
//   }
// };

//FIXME:
export const getUserList = async (body) => {
  try {
    let query = {
      orgId: body.orgDetails._id,
      isActive: true,
      _id: { $ne: body.user._id }

    }
    return await findWithPegination(query,{},{},collection_name);
  } catch (error) {
    logger.error("Error in getUserList in user module");
    throw error;
  }
};


export const getUserDetails = async (body) => {
  try {

    const query = new QueryBuilder(body.query)
      .addId()
      // .addClientBranchId()
      .addName()
      .addIsActive()
      // .addClientId()
      .addOrgId()
      .addCreatedAt()
      .addUserIds()

    const params = query.getQueryParams(); 
    let assignmentIds = [];
    if (body.query.assignment) {
      assignmentIds = body.query.assignment.map(data => data._id);
    }
    params['role'] ={ $nin : [new ObjectId(adminRoleId)]}
    const category = body.query?.category;

    let assignmentQuery = {};
    if(body.orgIds && body.orgIds.length > 0) {assignmentQuery['assignment.subOrgId'] = { $in: body.orgIds.map(o => new ObjectId(o)) }}
    if(body.branchIds && body.branchIds.length > 0) {assignmentQuery['assignment.branchId'] = { $in: body.branchIds.map(o => new ObjectId(o)) }}
    if(body.departmentIds && body.departmentIds.length > 0) {assignmentQuery['assignment.departmentId'] = { $in: body.departmentIds.map(o => new ObjectId(o)) }}
    if(body.designationIds && body.designationIds.length > 0) {assignmentQuery['assignment.designationId'] = { $in: body.designationIds.map(o => new ObjectId(o)) }}
    if(body.employeeIds && body.employeeIds.length > 0) {assignmentQuery['_id'] = { $in: body.employeeIds.map(o => new ObjectId(o)) }}
    
    const aggrigationPipeline = [
      {
        $match: {...params,  owner:{$ne:true}, _id:{$ne:body.user._id}}
      },
      {
        $lookup: {
          from: "user",
          localField: "createdBy",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user", // Field to unwind
          preserveNullAndEmptyArrays: true, // Allow documents without matches to still pass through
        },
      },
      {
        $addFields: {
          createdByName: "$user.name",
          assigned: { $cond: { if: { $in: ["$assignmentId", assignmentIds] }, then: true, else: false } },
          modifiedDate: {
              $cond: {
                  if: {
                      $ne: [
                          {
                              $ifNull: ["$modifiedDate", null]
                          },
                          null
                      ]
                  },
                  then: "$modifiedDate",
                  else: "$createdDate"
              }
          }
        }
      },
      {
        $match: (category === 'assigned') ? { assigned: true } :
          (category === 'unassigned') ? { assigned: false } : {}
      },
      {
        $lookup: {
          from: "assignment",
          localField: "assignmentId",
          foreignField: "_id",
          as: "assignment"
        }
      },
      {
        $unwind: {
          path: "$assignment",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "branches",
          localField: "clientBranchId",
          foreignField: "_id",
          as: "clientBranch"
        }
      },
      {
        $lookup: {
          from: "organization",
          localField: "assignment.subOrgId",
          foreignField: "_id",
          as: "organization"
        }
      },
      {
        $unwind: {
          path: "$organization",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "branches",
          localField: "assignment.branchId",
          foreignField: "_id",
          as: "branch"
        }
      },
      {
        $unwind: {
          path: "$branch",
          preserveNullAndEmptyArrays: true
        }
      },
      // Lookup department details
      {
        $lookup: {
          from: "department",
          localField: "assignment.departmentId",
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true
        }
      },
      // Lookup designation details (if assigned)
      {
        $lookup: {
          from: "designation",
          localField: "assignment.designationId",
          foreignField: "_id",
          as: "designation"
        }
      },
      {
        $unwind: {
          path: "$designation",
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $lookup: {
          from: "shift",
          localField: "shiftIds",
          foreignField: "_id",
          as: "shiftDetails"
        }
      },
      {
        $unwind: {
          path: "$shiftDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          workTiming: {
            $cond: {
              if: { $eq: ["$workTimingType", "shift"] },
              then: {
                name: "$shiftDetails.name",
                startTime: "$shiftDetails.startTime",
                endTime:"$shiftDetails.endTime"
              },
              else: {
                name: "Regular Shift",
                startTime: "$branch.startTime",
                endTime: "$branch.endTime"
              }
            }
          }
        }
      },

      // {
      //   $project: {
      //     "user": 0,
      //     "assignment":0
      //   }
      // },
      {
        $match: {
          ...assignmentQuery
        }
      },
      {
        $project: {
          name: 1,
          mobile: 1,
          email: 1,
          gender: 1,
          dateOfBirth: 1,
          isActive: 1,
          assignmentId: 1,
          joinDate:1,
          createdByName: 1,
          organization: {
            organizationId: "$organization._id",
            organizationName: "$organization.name"
          },
          branch: {
            branchId: "$branch._id",
            branchName: "$branch.name"
          },
          department: {
            departmentId: "$department._id",
            departmentName: "$department.name"
          },
          designation: {
            designationId: "$designation._id",
            designationName: "$designation.name"
          },
          bloodGroup:1,
          qualification:1,
          employeeId:1,
          salaryConfig:1,
          emergencyNumber:1,
          guardianNumber:1,
          guardianName:1,
          
          workTiming:1,
          clientBranch: {
            $map: {
              input: "$clientBranch",
              as: "cb",
              in: {
                clientBranchId: "$$cb._id",
                clientBranchName: "$$cb.name"
              }
            }
          },
          assigned: "$assigned",
          clientAssigned: "$clientAssigned",
          createdDate:1,
          modifiedDate:1
        }
      },
      
    ];

    if (body.search) {

      let matchStatusRes = matchisActiveStr(body.search)
      let getLastStage = aggrigationPipeline[aggrigationPipeline.length - 1];

      let $or = []
      let matchRegex = { $match : {$or}}
      for(const field in getLastStage.$project) {
        let value = getLastStage.$project[field];
        if (typeof value == "object") {
          Object.keys(value).forEach(key => {
            if(key != '$map') {
              $or.push({[`${field}.${key}`] : {$regex : body.search, $options : "i"} })
            }
          })
        }
        else {
          if(field == 'isActive' && matchStatusRes != null) $or.push({[field] : matchStatusRes})
          // else if()
          else $or.push({[field] : {$regex : body.search, $options : "i"} })
        }
      }
      aggrigationPipeline.push(matchRegex)
    }

    let groupQuery = {
      $group: {
        _id: "$_id"
      }
    }

    
    for(let param of allowed_user_params) {
      if(!body.params || body.params.findIndex(p => p === param) !== -1) groupQuery.$group[param] = { $first: `$${param}` };
    }
    
    aggrigationPipeline.push(groupQuery)

    console.log(JSON.stringify(aggrigationPipeline))
    let paginationQuery = {
      page:body.page,
      limit:body.limit,
      sortOrder:-1,
      sortBy:'createdDate'
    }
    return await aggregationWithPegination(aggrigationPipeline, paginationQuery, collection_name);
  } catch (error) {
    logger.error("Error in client getUserList in user module");
    throw error;
  }
};

export const clientUserList = async (body) => {
  try {

    const category = body?.category;
    let params = {
      orgId: body.user.orgId, role: { $nin : [new ObjectId(adminRoleId)]}, assignmentId : {$in : body.assignment.map(a => a._id)}
    }
    
    if(body.attendanceStatus) {
      params['clients'] = { $in: [body.clientDetails.clientId] }
      params['clientBranches'] = { $in: body.clientBranchIds.map(cb => new ObjectId(cb)) }
    }
    const aggrigationPipeline = [
      {
        $match: params,
      },
      {
        $lookup: {
          from: "user",
          localField: "createdBy",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "assignment",
          localField: "assignmentId",
          foreignField: "_id",
          as: "assignment"
        }
      },
      {
        $unwind: {
          path: "$assignment",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "branches",
          localField: "clientBranches",
          foreignField: "_id",
          as: "clientBranch"
        }
      },
      {
        $addFields: {
          clientAssigned: {
            $cond: [
              {
                $eq: [{ $ifNull: ["$clientBranches", []] }, []]
              },
              false,
              {
                $setIsSubset: [
                  body.clientBranchIds.map(cb => new ObjectId(cb)),
                  { $ifNull: ["$clientBranches", []] }
                ]
              }
            ]
          },
          modifiedDate: {
              $cond: {
                  if: {
                      $ne: [
                          {
                              $ifNull: ["$modifiedDate", null]
                          },
                          null
                      ]
                  },
                  then: "$modifiedDate",
                  else: "$createdDate"
              }
          }
        }
      },
      {
        $match: 
        (category === 'assigned') ? { clientAssigned: true } :
        (category === 'unassigned') ? { clientAssigned: false } : {}
      },
      {
        $lookup: {
          from: "branches",
          localField: "assignment.branchId",
          foreignField: "_id",
          as: "branch"
        }
      },
      {
        $unwind: {
          path: "$branch",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "department",
          localField: "assignment.departmentId",
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "designation",
          localField: "assignment.designationId",
          foreignField: "_id",
          as: "designation"
        }
      },
      {
        $unwind: {
          path: "$designation",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          name: 1,
          mobile: 1,
          email: 1,
          gender: 1,
          dateOfBirth: 1,
          isActive: 1,
          assignmentId: 1,
          joinDate: 1,
          createdDate:1,
          createdByName: "$user.name",
          branch: {
            branchId: "$branch._id",
            branchName: "$branch.name"
          },
          department: {
            departmentId: "$department._id",
            departmentName: "$department.name"
          },
          designation: {
            designationId: "$designation._id",
            designationName: "$designation.name"
          },
          clientBranch: {
            $map: {
              input: "$clientBranch",
              as: "cb",
              in: {
                clientBranchId: "$$cb._id",
                clientBranchName: "$$cb.name"
              }
            }
          },
          assigned: "$assigned",
          clientAssigned: "$clientAssigned"
        }
      }
    ]

    if (body.search) {

      let matchStatusRes = matchisActiveStr(body.search)
      let getLastStage = aggrigationPipeline[aggrigationPipeline.length - 1];

      let $or = []
      let matchRegex = { $match : {$or}}
      for(const field in getLastStage.$project) {
        let value = getLastStage.$project[field];
        if (typeof value == "object") {
          Object.keys(value).forEach(key => {
            if(key != '$map') {
              $or.push({[`${field}.${key}`] : {$regex : body.search, $options : "i"} })
            }
          })
        }
        else {
          if(field == 'isActive' && matchStatusRes != null) $or.push({[field] : matchStatusRes})
          // else if()
          else $or.push({[field] : {$regex : body.search, $options : "i"} })
        }
      }
      aggrigationPipeline.push(matchRegex)
    }
    

    aggrigationPipeline.push({
        $group: {
          _id: "$_id",
          name: {
            $first: "$name"
          },
          mobile: {
            $first: "$mobile"
          },
          email: {
            $first: "$email"
          },
          gender: {
            $first: "$gender"
          },
          dateOfBirth: {
            $first: "$dateOfBirth"
          },
          isActive: {
            $first: "$isActive"
          },
          createdDate: {
            $first: "$createdDate"
          },
          assignmentId: {
            $first: "$assignmentId"
          },
          joinDate: {
            $first: "$joinDate"
          },
          clientAssigned: {
            $first: "$clientAssigned"
          },
          branch: {
            $first: "$branch" // need to revert from object to array once multiple assignment is handled ($addToSet)  
          },
          department: {
            $first: "$department" // need to revert from object to array once multiple assignment is handled ($addToSet)
          },
          designation: {
            $first: "$designation" // need to revert from object to array once multiple assignment is handled ($addToSet)
          },
          clientBranch: {
            $first: "$clientBranch"
          }
        }
      })
    // if (body.assignment && body.assignment.length > 0) {
      // aggrigationPipeline[0]['$match']
    // }
    // console.log(JSON.stringify(aggrigationPipeline))
    return await aggregationWithPegination(aggrigationPipeline,{page:body.page,limit:body.limit},collection_name);
  } catch (error) {
    logger.error("Error in getUserList in user module");
    throw error;
  }
};


export const isMobileExists = async (body) => {
  try {
    let query = {
      mobile: body.mobile,
      isActive: true
    }
    return await getOne(query, collection_name)
  }
  catch (error) {
    return { status: false, message: "Failed to get User" }
  }
}

export const getactiveUser = async (body) => {
  try {
    let query = {
      orgId: new ObjectId(body),
    }
    let update = {
      $set: { isActive: false, }
    }
    return await updateOne(query, update, collection_name)
    //  return await getMany(query, collection_name)
  } catch (error) {
    return { status: false, message: "Failed to get user detail by Id" }
  }
}

export const getnonActiveUser = async (body) => {
  try {
    let query = {
      orgId: new ObjectId(body),
      isActive: false
    }
    return await getMany(query, collection_name)
  } catch (error) {
    return { status: false, message: "Failed to get user detail by Id" }
  }
}

export const updateVerfication = async (body) => {
  try {
    const query = body.mobile ? { mobile: body.mobile } : body.email ? { email: body.email } : null;
    // let query = {
    //     mobile : body.mobile,
    //     // isActive : true
    // }
    let update = {
      $set: { otpVerified: true }
    }
    let log = {}
    return await updateOne(query, update, collection_name, log)
  }
  catch (error) {
    return { status: false, message: "Failed to update User" }
  }
}

export const updateImagePath = async (body) => {
  try {
    let userId = body.userId
    let query = {
      _id: new ObjectId(userId)
    }
    let update = {
      $set: { profileImage: body.imagePath, modifiedDate: new Date(), modifiedBy: new ObjectId(userId) }
    }
    let log = {}
    return await updateOne(query, update, collection_name, log)
  }
  catch (error) {
    return { status: false, message: "Failed to update user profile " }
  }
}

export const updateProfile = async (body) => {
  try {
    let query = {
      _id: new ObjectId(body.userId)
    }
    let updateObject = {}
    let fields = ['name', 'email', 'modifiedDate', 'modifiedBy']

    fields.forEach(f => {
      if (body[f]) {
        updateObject[f] = body[f]
      }
      else {
        if (f == 'modifiedDate') updateObject[f] = new Date()
        if (f == 'modifiedBy') updateObject[f] = new ObjectId(body.userId)
      }
    })
    let update = {
      $set: updateObject
    }
    return await updateOne(query, update, collection_name)
  }
  catch (error) {
    return { status: false, message: "Failed to update profile" }
  }
}

//user activation - deactivation
export const toggleStatus = async (body) => {
  try {
    let query = {
      _id: new ObjectId(body.userId)
    }

    let update = {
      $set: {
        isActive: body.actionType == 'activate' ? true : false,
        modifiedBy: new ObjectId(body.authUserId),
        modifiedDate: getCurrentDateTime()
      }
    }
    return await updateOne(query, update, collection_name)
  }
  catch (error) {
    return { status: false, message: "Failed to update user status" }
  }
}
// to update details if mobile already exist but not verified
export const updateDetails = async (body) => {
  try {
    let query = {
      mobile: body.mobile
    }

    let update = {
      $set: {
        password: body.password,
        modifiedBy: body.existingUser._id,
        modifiedDate: getCurrentDateTime()
      }
    }
    body.email ? update['$set']['email'] = body.email : undefined
    return await updateOne(query, update, collection_name)
  }
  catch (error) {
    return { status: false, message: "Failed to update user status" }
  }
}

export const multipleClientMapping = async (body) => {
  try {
    let query = {
      _id : new ObjectId(body.updatedUserId)
    }

    let update = {
        $push: { clients: { $each: body.clientIds.map(c => new ObjectId(c)) } }
    }

    if(body.clientBranchIds && body.clientBranchIds?.length > 0) update['$push']['clientBranches'] = { $each: body.clientBranchIds.map(cb => new ObjectId(cb)) }

    return await updateOne(query, update, collection_name)
  }
  catch (error) {
    return { status: false, message: "Failed to map multiple clients to user" }
  }
}

export const multipleClientUnMap = async (body) => {
  try {
    let query = {
      _id : new ObjectId(body.updatedUserId)
    }

    let update = {
        $pull: { clients: {$in : body.clientIds.map(c => new ObjectId(c))} }
    }

    if(body.clientBranchIds && body.clientBranchIds?.length > 0) update['$pull']['clientBranches'] = {$in : body.clientBranchIds.map(cb => new ObjectId(cb))}

    return await updateOne(query, update, collection_name)
  }
  catch (error) {
    return { status: false, message: "Failed to un map multiple clients to user" }
  }
}

export const mapOrganization = async (body) => {
  try {
    let update = body.update;
    return await findOneAndUpdate({ _id: new ObjectId(body.userId) }, {$set:update}, collection_name)
  } catch (error) {
    console.log(error);
    throw error;
    return { status: false, message: "Unable to add orgID to user" }
  }
}


// get user details
export const getLoggedUser = async (body) => {
  try {
    const query = [
      {
        $match:
        {
          _id: new ObjectId(body.userId),
        },
      },
      {
        $lookup:
        {
          from: "roles",
          localField: "roleId",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $project:
        {
          _id: 1,
          firstName: '$name.firstName',
          lastName: '$name.lastName',
          email: 1,
          mobile: 1,
          roles: {
            $map: {
              input: "$role",
              as: "roles",
              in: {
                RoleId: "$$roles._id",
                RoleName: "$$roles.name",
                // Parent: "$$roles.parent",
                Priority: "$$roles.priority"
              },
            },
          },
          owner: {
            $cond: {
              if: { $ne: ["$owner", null] }, 
              then: "$owner",
              else: "$$REMOVE",
            },
          },
        },
      },
    ]
    return await aggregate(query, "user")
  } catch (error) {
    return { status: false, message: "Fail to get User Details" }
  }
}
export const updateUser = async (body) => {
  try {
    let query = {
      _id: new ObjectId(body.updatedUserId)
    }
    let fields = ['name', 'mobile', 'email', 'role', 'branch', 'category', 'group', 'modifiedDate', 'modifiedBy']

    let updateObj = {}

    fields.forEach(f => {
      if (body[f]) {
        if (f == 'branch') updateObj[f] = body.allocatedBranch
        else updateObj[f] = body[f]
      }
      else {
        if (f == 'modifiedBy') updateObj[f] = new ObjectId(body.userId)
        if (f == 'modifiedDate') updateObj[f] = getCurrentDateTime()
      }
    })

    let update = {
      $set: updateObj
    }

    return await updateOne(query, update, collection_name)

  }
  catch (error) {
    return { status: false, message: "Failed to update user" }
  }
}

export const isUpdatingUserValid = async (body) => {
  try {
    let query = { _id: new ObjectId(body.updatedUserId) }

    return await getOne(query, collection_name)
  }
  catch (error) {
    return { status: false, message: "Failed to get updating user details" }
  }
}

export const getUserModules = async (body) => {
  try {

    let userMatch={
      _id: body?.authUser?._id || new ObjectId(body.userId),
    }

    if(body.employeeId!=null){
        userMatch={
          _id: new ObjectId(body.employeeId),
        }
    }

    const query = [
      {
        // $match: {
        //   _id: body?.authUser?._id || new ObjectId(body.userId),
        // },
        $match: userMatch
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roles",
        },
      },
      {
        $unwind: "$roles"
      },
      {
        $lookup: {
          from: "modules",
          pipeline:[
            {
              $match: {$or:[{isActive:1},{isActive:true}]}
            }
          ],
          localField: "roles.modules.moduleId",
          foreignField: "_id",
          as: "roles.Modules",
        },
      },
      {
        $group: {
          _id: "$_id",
          email: {
            $first: "$email",
          },
          name: {
            $first: "$name",
          },
          roles: {
            $push: "$roles",
          },
        },
      },
    ]
    // console.log(JSON.stringify(query))
    return await aggregate(query, "user")
  } catch (error) {
    return { status: false, message: "Fail to get User Details" }
  }
}

export const updateOTP = async (body) => {
  try {
    let user = body.existingUser ? body.existingUser._id : body.userId
    let query = {
      _id: user
    }
    let update = {
      $set: {
        otp: {
          otp: body.otp,
          sentDate: getCurrentDateTime()
        }
      }
    }
    return await updateOne(query, update, collection_name)
  }
  catch (error) {
    throw error;
    return { status: false, message: "Failed to update OTP" }
  }
}

export const isUserExist = async (body) => {
  try {
    let query =
    {
      orgId: body.user.orgId,
      // role: {
      //   $elemMatch: {
      //     $ne: body.adminRole //will get admin roleId in getAdmin Role Middlware
      //   }
      // }
      $or:body.employeeData
    
    }
   
    return await getMany(query, collection_name)
  }
  catch (error) {
    return { status: false, message: "Failed to get User" }
  }
}


//add final submit
export const addFinalSubmit = async (body) => {
  try {

    const bulkOps = body.warehouses.map(warehouseId => ({
      updateOne: {
        filter: { _id: body.user._id },
        update: {
          $set: {
            [`finalSubmit.branch.${body.branchId}.warehouse.${warehouseId}`]: getCurrentDateTime()
          }
        },
        upsert: true // Create a new document if no document matches the filter
      }
    }));

    return await bulkWriteOperations(bulkOps, collection_name);

  }
  catch (error) {
    return { status: false, message: "Failed to add final submit" }
  }
}



export const updateDisabledModules = async (body) => {
  try {
    // let query = { _id: new ObjectId(body.employeeId) }


    // let update = {
    //   $set: {}
    // }
    // if (body.disabledModules) {
    //   update['$set']['disabledModules'] = body.disabledModules
    // }

    // return await updateOne(query, update, collection_name)


    const {  employeeId,existingDisabledModules,disabledModules } = body;
  
    if (!employeeId) throw new Error('EmplyeeId is required')

    const existingModules = existingDisabledModules || {};

    //  Merge logic — avoid duplicates & merge permissions
    const mergedMap = new Map();

    // Add existing first
    // for (const mod of existingModules) {
    //   mergedMap.set(mod.moduleId.toString(), new Set(mod.permissions));
    // }
    for (const [moduleId,permissions] of Object.entries(existingModules)) {
      mergedMap.set(moduleId.toString(), new Set(permissions));
    }

    // Merge incoming body modules
    for (const mod of disabledModules) {
      const id = mod.moduleId.toString();
      if (!mergedMap.has(id)) mergedMap.set(id, new Set());
      for (const p of mod.permissions) mergedMap.get(id).add(p);
    }

    //  Convert back to array format
    // const mergedDisabledModules = Array.from(mergedMap.entries()).map(
    //   ([moduleId, perms]) => ({
    //     moduleId: new ObjectId(moduleId),
    //     permissions: Array.from(perms),
    //   })
    // );

    const objectFormatDisabledModules = {};
    for (const [moduleId, perms] of mergedMap.entries()) {
      objectFormatDisabledModules[moduleId] = Array.from(perms);
    }


   

    //  Update in DB
    const updateBody = {
      $set: {
        // disabledModules: mergedDisabledModules,
        disabledModules: objectFormatDisabledModules,
        modifiedDate: new Date(),
        modifiedBy: body.authUser?._id || body.user?._id,
      },
    };

    const query = {
      _id: new ObjectId(employeeId),
      orgId: new ObjectId(body.user.orgId),
      isActive: true,
    };

     return  await findOneAndUpdate(
      query,
      updateBody,
      "user"
    );

  }
  catch (error) {
    return { status: false, message: "Failed to get update disabled modules" }
  }
}

export const getUserById = async (body) => {
  try {
    let query = {_id : new ObjectId(body.id)}
    console.log(userGetTypeProjection[body.detailsType])
    return await getOne(query, collection_name, userGetTypeProjection[body.detailsType])
  }
  catch (error) {
    return { status: false, message: "Failed to get User" }
  }
}


export const updateUserDetails = async (body, params) => {
  try {
    const userIdTosearch = params.userId ? new ObjectId(params.userId) : new ObjectId(body.id)
    let query = { _id: userIdTosearch }
    // let { id,orgDetails,panNo, userId, endpoint, roleID, featureKey, token, user,type,assignmentDetails,assignment,assignmentData, updatingUserDetails, updatedUserId,updateUser, branchId, designationId, departmentId,assignmentIds,orgTypeId,groupName,orgName, ...userData } = body

    let userData = ['name', 'email', 'mobile', 'password', 'profileImage','joinDate','gender','dateOfBirth', 'assignmentId','roleId','presentAddress', 'permanentAddress', 'isPermanentSame','orgId', 'update','guardianName','guardianNumber','emergencyNumber','bloodGroup','qualification','employeeId','martialStatus','workTimingType','salaryConfig','isSubOrg']
    // delete userData['query']
    body.update = {modifiedDate: getCurrentDateTime(), modifiedBy: new ObjectId(body.userId)}

    let updateObj = {};
    for (let key of userData) {
      if (key == 'name') {
        if(typeof body[key] !== 'object'){
          continue;
        }
        for (let field in body[key]) {
          updateObj[`name.${field}`] = body[key][field]
        }
      } 
      else if (key === "update") {
        for (let field in body[key]) {
          if (field == "modifiedDate") {
            updateObj[`${field}`] = new Date(body[key][field])
          } else {
            updateObj[`${field}`] = new ObjectId(body[key][field])
          }
        }
      } else {
        if (body[key] !== undefined && body[key] !== null) {
          if(key === 'assignmentId' || key === 'roleId' || key === 'orgId') {
            updateObj[key] = Array.isArray(body[key]) ? body[key] : new ObjectId(body[key]);
          }
          else {
            updateObj[key] = body[key];
          }
        }
      }
    }
    if(body.shiftIds){
      updateObj['shiftIds']=body.shiftIds.map(shift=>new ObjectId(shift))
    }
    let update = {
      $set: updateObj
    }
    return await updateOne(query, update, collection_name)
  }
  catch (error) {
    throw error;
    return { status: false, message: "Failed to update user details" }
  }
}

export const getExecutiveUsers = async (body) => {
  try {
    let query = [
      {
        $match: {
          orgId: body.user.orgId,
          isActive: true
        }
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleDetails"
        }
      },
      {
        $unwind: "$roleDetails"
      },
      {
        $match: {
          "roleDetails.priority": {
            $lt: body.userRolePriority //from getRoleModules middleware
          },
          _id: {
            $ne: body.user._id
          }
        }
      },
      {
        $group: {
          _id: "_id",
          users: {
            $push: {
              userId: "$_id",
              name: "$name",
              role: "$role",
              roleName: "$roleDetails.name",
              priority: "$roleDetails.priority"
            }
          }
        }
      }
    ]
    return await aggregate(query, collection_name)
  } catch (error) {
      return {status : false, message : "failed to get executive users"}
  }
}

//checking this below function for mapping users before assignment mapped user valid or not (not admin) other than admin
export const getEmployeeUser = async (body) => {
  try {
     let params = Object.create(null)
      params= {
         _id : new ObjectId(body.employeeUserId),
         isActive : true
      }
      const orgId=body.user?.orgId || body?.orgDetails?._id
      params["orgId"] = orgId;
      body.actionType ? delete query["isActive"] : undefined
      //return await mongoDbService.getOne(collection_name,query);
      return await getOne(params,collection_name)
  } catch (error) {
      return {status : false, message: "failed to get user", error}
  }
}

// this below function for mapping users (not admin) for update details like mapping branch/dept id
export const updateEmployeeUserDetails = async (body) => {
  try {
    let query = { _id: new ObjectId(body.employeeUserId) }
    let { userId, endpoint, featureKey, token, user, ...userEmployee } = body
    let updateObj = {};
    for (let key in body.userEmployee) {
      if (userEmployee[key] !== undefined && userEmployee[key] !== null) {
        updateObj[key] = userEmployee[key];
      }
    }
    // if addParameter true adding assignmentId otherwise it can use for unmap
    const update=body.addParameter?{$set: updateObj}:{$unset:{assignmentId:body.userEmployee['assignmentId']}}
    
    return await updateOne(query, update, collection_name)
  }
  catch (error) {
    return { status: false, message: "Failed to update user details" }
  }
}

//get all users data this function for run cron job at mdnight  to make absent
export const getAllUsersData= async(body) => {
    try {
      const query={}

      const projection = {
        
        _id:1,orgId:1,assignmentId:1

      };
      

      return await getMany(query,collection_name,projection)
    }
    catch (error) {
      return {status : false, message : "Failed to get User"}
    }
}

//get current shift
export const getUserCurrentShift=async(body)=>{
  try{
    
    const query = [
      {
        $match: {
          _id: body.user?._id,
          orgId: body.user?.orgId,
          isActive: true
        }
      },
      {
        $lookup: {
          from: "shiftGroup",
          localField: "shiftGroupId",
          foreignField: "_id",
          as: "shiftGroupDetails"
        }
      },
      { $unwind: "$shiftGroupDetails" },
      {
        $addFields: {
          // Calculate days difference between the current date and startDate
          daysDifference: {
            $divide: [
              { $subtract: [new Date(body.transactionDate), "$shiftGroupDetails.startDate"] }, // Current date - startDate
              1000 * 60 * 60 * 24 // Convert milliseconds to days
            ]
          }
        }
      },
      {
        $addFields: {
          currentShiftIndex: {
            $mod: [
              { $floor: "$daysDifference" }, // Get the floor of days difference
              "$shiftGroupDetails.shiftLength"
            ]
          }
        }
      },
      {
        $addFields: {
          currentShiftId: {
            $arrayElemAt: ["$shiftGroupDetails.shiftIds", "$currentShiftIndex"]
          }
        }
      },
      {
        $addFields: {
          currentShiftId: {
            $cond: {
              if: { $regexMatch: { input: "$currentShiftId", regex: /^[0-9a-fA-F]{24}$/ } }, // Check if the currentShiftId is a valid ObjectId string
              then: { $toObjectId: "$currentShiftId" }, // Convert to ObjectId if valid
              else: "$currentShiftId" // If it's not a valid ObjectId string (like "WO" or "kgf"), leave it as is
            }
          }
        }
      },
      {
        $lookup: {
          from: "shift",
          localField: "currentShiftId",
          foreignField: "_id",
          as: "currentShiftDetails"
        }
      },
      {
        $unwind: {
          path: "$currentShiftDetails",
          preserveNullAndEmptyArrays: true // Ensure we keep documents without lookup results
        }
      },
      {
        $addFields: {
          // If currentShiftId is not a valid ObjectId and no lookup result, return the original string value
          "currentShiftDetails.startTime": {
            $cond: {
              if: { $gt: [{ $type: "$currentShiftDetails.startTime" }, "missing"] }, // If lookup succeeded, return startTime
              then: "$currentShiftDetails.startTime",
              else: "$currentShiftId" // If lookup failed (like "WO"), return the currentShiftId
            }
          },
          "currentShiftDetails.endTime": {
            $cond: {
              if: { $gt: [{ $type: "$currentShiftDetails.endTime" }, "missing"] }, // If lookup succeeded, return endTime
              then: "$currentShiftDetails.endTime",
              else: "$currentShiftId" // If lookup failed (like "WO"), return the currentShiftId
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          "currentShiftDetails._id": 1,
          "currentShiftDetails.startTime": 1,
          "currentShiftDetails.endTime": 1,
          "currentShiftDetails.name":1,
          "currentShiftDetails.minIn":1,
          "currentShiftDetails.minOut":1,
          "currentShiftDetails.maxIn":1,
          "currentShiftDetails.maxOut":1,
        }
      }
    ];
    console.log(JSON.stringify(query));
    
    const data = await aggregate(query, collection_name)
    return data.data[0]

  }catch(error){
    console.error("Error in getUserCurrentShift in User model :",error.message)
    throw error
  }
}

//Get employee nearest shift
export const getEmployeeNearestShift = async (body) => {
  try {
    const orgId = body.user?.orgId
    const loginDate =  body.transactionDate? new Date(body.transactionDate) : new Date()
    let query = { orgId }
    if(body.teamAttendance) query['_id'] = new ObjectId(body.shiftId)
    const shiftResult = await getMany(query, "shift")
    const shifts = shiftResult.data

    const shiftsWithLoginInside = []
    const shiftsOutside = []

    for (const shift of shifts) {
      const shiftStart = new Date(loginDate)
      const [startHour, startMin] = shift.startTime.split(":")
      shiftStart.setHours(parseInt(startHour), parseInt(startMin), 0, 0)

      const shiftEnd = new Date(loginDate)
      const [endHour, endMin] = shift.endTime.split(":")
      shiftEnd.setHours(parseInt(endHour), parseInt(endMin), 0, 0)

      // Handle overnight shift
      if (shiftEnd <= shiftStart) {
        shiftEnd.setDate(shiftEnd.getDate() + 1)
      }

      // Apply grace period
      const adjustedShiftStart = new Date(shiftStart)
      const adjustedShiftEnd = new Date(shiftEnd)

      if (shift.minIn) {
        const [minHour, minMin] = shift.minIn.split(":")
        adjustedShiftStart.setHours(parseInt(minHour), parseInt(minMin), 0, 0)
        // adjustedShiftStart.setMinutes(adjustedShiftStart.getMinutes() - parseInt(shift.minIn.split(":")[1]))
      }
      if (shift.maxOut) {
        const [maxHour, maxMin] = shift.maxOut.split(":")
        adjustedShiftEnd.setHours(parseInt(maxHour), parseInt(maxMin), 0, 0)
        // adjustedShiftEnd.setMinutes(adjustedShiftEnd.getMinutes() + parseInt(shift.maxOut))
      }

      const totalDuration = shiftEnd - shiftStart
      const elapsed = loginDate - shiftStart
      const percentCompleted = (elapsed / totalDuration) * 100
      const shiftData = {
        ...shift,
        shiftStart,
        shiftEnd,
        adjustedShiftStart,
        adjustedShiftEnd,
        totalDuration,
        elapsed,
        percentCompleted,
      }

      if (loginDate >= adjustedShiftStart && loginDate <= adjustedShiftEnd) {
        shiftsWithLoginInside.push(shiftData)
      } else {
        shiftsOutside.push(shiftData)
      }
    }

    // Use matching shifts if available
    const sourceShifts = shiftsWithLoginInside.length > 0 ? shiftsWithLoginInside : shiftsOutside;

    // Filter those with less than or equal to 70% completed
    const eligibleShifts = sourceShifts.filter(s => s.percentCompleted <= 70)

    // If none match the 70% rule, just pick the nearest (least percentCompleted)
    const nearestShift = eligibleShifts.length > 0
      ? eligibleShifts.reduce((a, b) => (a.percentCompleted < b.percentCompleted ? a : b))
      : sourceShifts.reduce((a, b) => (Math.abs(a.percentCompleted) < Math.abs(b.percentCompleted) ? a : b))

     return {
      _id: nearestShift._id,
      name: nearestShift.name,
      startTime: nearestShift.startTime,
      endTime: nearestShift.endTime,
      shiftStart: nearestShift.shiftStart,
      shiftEnd: nearestShift.shiftEnd,
      adjustedShiftStart: nearestShift.adjustedShiftStart,
      adjustedShiftEnd: nearestShift.adjustedShiftEnd,
      maxIn: nearestShift.maxIn,
      minOut: nearestShift.minOut
    };

  } catch (error) {
    console.error("Error in getEmployeeNearestShift in User model:", error.message);
    throw error;
  }
};

export const getEmployeeNearestShift2 = async (body) => {
  try {
    const orgId = body.user?.orgId
    const loginDate =  body.transactionDate? new Date(body.transactionDate) : new Date()
    let query = { $or : [{orgId : orgId}], isActive: true }
    if((body.teamAttendance || body.existingCheckInOutData) && !body.extendAttendance) query['_id'] = new ObjectId(body.shiftId)
    if(body.extendAttendance && body.shiftId) query['_id'] = {$ne : new ObjectId(body.shiftId)}
    if(body.clientIds) query['$or'].push({orgId : {$in : body.clientIds.map(c => c._id)}})
    const shiftResult = await getMany(query, "shift");
    const shifts = shiftResult.data;

    console.log(shifts)

    let orgShifts = []
    let clientShifts = []

    body.allShifts = shifts

    for(let sh of shifts) {
      if(sh.orgId.toString() == body.user.orgId.toString()) orgShifts.push(sh)
      else clientShifts.push(sh)
    }

    // for user assigned shift
    let match = null
    if(body.currentShift && body.currentShift.length > 0) {
      match = findMatchingShift(shifts, loginDate, body.currentShift);
      if (match) return match;
    }

    // branch based timings
    if(!body.currentShift?.length && (body.user?.workTimingType == 'branch' || !Object.keys(body.shiftObjData).length)) {
      match = findMatchingShift(shifts, loginDate, [], [{...body.nearestBranchDetails,workTimingType : "branch"} ]);
      if (match) return match;
    }

    // Combine org & client shifts (they can overlap)
    // const allShifts = body.nearestBranchDetails && !body.dashboardStatus ? [...orgShifts, ...clientShifts].filter(s => s.orgId.toString() == body.nearestBranchDetails.orgId.toString()) : [...orgShifts, ...clientShifts];
    const allShifts = [...orgShifts, ...clientShifts];
    
    match = findMatchingShift(allShifts, loginDate);
    if (match) {
      match.source = orgShifts.find(os => os._id.toString() == match._id.toString()) ? "org" : "client";
      return match;
    }

    // return null;
  } catch (error) {
    console.error("Error in getEmployeeNearestShift2 in User model:", error.message);
    throw error;
  }
};




//checking checkingMappedAssignmentId before unmap desig in userlevel
export const checkingMappedAssignmentId=async(body)=>{
  try{
      const orgId=body.user?.orgId || body?.orgDetails?._id;
      const query={
          orgId:orgId,
          assignmentId: { $in: body.assignmentIds },
          isActive:true
      }
      
      return await getMany(query,collection_name,{_id:1,mobile:1,email:1,name:1})
      
  }catch(error){
      console.log("....error in checkingAllFileds model...",error?.message)
      return {status:false,message:error?.message??'Something went wrong'}
  }
}


// get userinfo details
export const getUserInfoDetails=(body)=>{
  try{
    const {user,userIds}=body
    const orgId=user?.orgId && typeof user?.orgId==='string'? new ObjectId(user.orgId):user?.orgId
    const query={orgId,isActive:true}
    // Convert userIds to ObjectId if needed
    const userObjectIds = userIds.map(id => new ObjectId(id));
    // If userIds is provided and not empty, filter by userIds
    if (userObjectIds.length) {
      query._id = { $in: userObjectIds };
    }
    const aggregationQuery=[
      {$match:query},
      {$project:{
        // name:{
        //   $trim:{
        //     input:{
        //       $concat:["$name.firstName",{$ifNull:["$name.middleNamw"," "]}," ",{$ifNull:["$name.lastName"," "]}]
        //     }
        //   }
        // }
        name:1
      }}
    ]

    return aggregationWithPegination(aggregationQuery,{limit:userIds.length},collection_name)



  }catch(error){
    logger.error('Error while getUserInfoDetails')
    throw error
}

}

// Get assigned user details
export const getAssignedUsers = async (body) => {
    try {
        let matchQuery = { isActive: true };

        if (body.user.orgId) matchQuery['orgId'] = body.user.orgId;
        if (body.user.isClient) matchQuery['clientId'] = new ObjectId(body.user._id);
        if (body.user.owner) matchQuery['clientId'] = { $exists: true };

        const currentMonthStart = startOfMonth(new Date());
        const currentMonthEnd = endOfMonth(new Date());
        const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
        const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

        // 🛠 MongoDB aggregation to fetch all data in one DB call
        const result = await aggregate([
            { $match: matchQuery },
            {
                $facet: {
                    totalAssignedUsers: [{ $count: "count" }], // Total active users (all-time)
                    currentMonthUsers: [
                        { $match: { createdAt: { $gte: currentMonthStart, $lt: currentMonthEnd } } },
                        { $count: "count" }
                    ], // Users assigned this month
                    lastMonthUsers: [
                        { $match: { createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd } } },
                        { $count: "count" }
                    ] //  Users assigned last month
                }
            }
        ], collection_name);

        // Extract data from aggregation result
        const totalAssignedUsers = result.data[0].totalAssignedUsers[0]?.count || 0;
        const totalCurrentMonthUsers = result.data[0].currentMonthUsers[0]?.count || 0;
        const totalLastMonthUsers = result.data[0].lastMonthUsers[0]?.count || 0;

        // Calculate difference and percentage change
        let difference = totalCurrentMonthUsers - totalLastMonthUsers;
        let percentageChange = totalLastMonthUsers > 0 
            ? ((difference) / totalLastMonthUsers) * 100 
            : (totalCurrentMonthUsers > 0 ? 100 : 0); // If last month was 0, set percentage to 100%

        return {
            title: "Assigned Users",
            description: `${difference} users assigned from last month`,
            totalAssignedUsers, // All-time total active users
            currentMonthAssignedUsers: totalCurrentMonthUsers, // Users assigned this month
            lastMonthAssignedUsers: totalLastMonthUsers, // Users assigned last month
            userChangePercentage: percentageChange.toFixed(2) + "%", // Rounded percentage
            positive: difference >= 0 // true if increased, false if decreased
        };
    } catch (error) {
        logger.error("Error in getAssignedUsers in user module", error);
        throw error;
    }
}

export const getAssignmentDetails = async (body) => {
  try {
    let query = [
      {
        $match: {
          _id: new ObjectId(body.user._id),
          assignmentId: new ObjectId(body.user.assignmentId),
          orgId: new ObjectId(body.user.orgId)
        }
      },
      {
        $lookup: {
          from: "assignment", // Name of the collection storing assignment data
          localField: "assignmentId",
          foreignField: "_id",
          as: "assignmentDetails"
        }
      },
      {
        $unwind: "$assignmentDetails" // Convert assignmentDetails array into an object
      },
      {
        $project: {
          _id: 1,
          orgId: 1,
          assignmentId: 1,
          branchId: "$assignmentDetails.branchId",
          departmentId: "$assignmentDetails.departmentId",
          designationId: "$assignmentDetails.designationId"
        }
      }
    ];

    return await aggregate(query, collection_name);
  } catch (error) {
    return { status: false, message: "Failed to get user details", error: error.message };
  }
}

export const getUserBasedDept = async (body) => {
  try {
    const pipeline = [
      {
        $match: {
          orgId: body.user.orgId,
          clientBranches: {
            $in: body.clientBranchIds.map(cb => new ObjectId(cb))
          }
        }
      },
      {
        $lookup: {
          from: "assignment",
          localField: "assignmentId",
          foreignField: "_id",
          as: "assignment"
        }
      },
      {
        $unwind: {
          path: "$assignment",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "department",
          localField: "assignment.departmentId",
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind: {
          path: "$department"
        }
      },
      {
        $project: {
          department: {
            _id: "$department._id",
            name: "$department.name"
          },
          designation: {
            _id: "$designation._id",
            name: "$designation.name"
          }
        }
      },
      {
        $group: {
          _id: null,
          department: {
            $addToSet: "$department"
          }
        }
      }
    ]
    // console.log(JSON.stringify(pipeline))
    return await aggregate(pipeline,collection_name)

  } catch (error) {
    logger.error("Error while get in user module");
    throw error;
  }
}

export const getUserBasedDesignation = async (body) => {
  try {
    const pipeline = [
      {
        $match: {
          orgId: body.user.orgId,
          clientBranches: {
            $in: body.clientBranchIds.map(cb => new ObjectId(cb))
          }
        }
      },
      {
        $lookup: {
          from: "assignment",
          localField: "assignmentId",
          foreignField: "_id",
          as: "assignment"
        }
      },
      {
        $unwind: {
          path: "$assignment",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "designation",
          localField: "assignment.designationId",
          foreignField: "_id",
          as: "designation"
        }
      },
      {
        $unwind: {
          path: "$designation"
        }
      },
      {
        $project: {
          designation: {
            _id: "$designation._id",
            name: "$designation.name"
          }
        }
      },
      {
        $group: {
          _id: null,
          designation: {
            $addToSet: "$designation"
          }
        }
      }
    ]
    // console.log(JSON.stringify(pipeline))
    return await aggregate(pipeline,collection_name)

  } catch (error) {
    logger.error("Error while get in user module");
    throw error;
  }
}

export const clientBasedUserIds = async (body) => {
  try {
    let query = {
          orgId: body.user.orgId,
          clients : {$in : [new ObjectId(body.clientDetails.clientId)]},
          clientBranches: {$in : [new ObjectId(body.clientBranchId)]}
        }
    // console.log(JSON.stringify(pipeline))
    return await getMany(query,collection_name, {_id : 1})

  } catch (error) {
    logger.error("Error while get in user module");
    throw error;
  }
}

export const getUserByAssignment = async (body) => {
  try {
    const isClient = body?.isClient === true;
    const clientBranchIds = (body.clientBranchIds || []).map(id => new ObjectId(id));
    const query = [
      {
        $match: {
          orgId: body.user.orgId,
          isActive: true,
          owner: { $ne: true },
          ...(isClient ?{clientBranches : { $in: clientBranchIds }} :{}) // If isClient is true, filter by clientBranchIds
        }
      },
      {
        $lookup: {
          from: "assignment",
          localField: "assignmentId",
          foreignField: "_id",
          as: "matchedAssignments"
        }
      },
      {
        $unwind: {
          path: "$matchedAssignments",
          preserveNullAndEmptyArrays: true
        }
      }
    ]
    
    let matchQuery = {};
    if(body.orgIds && body.orgIds.length>0) matchQuery["matchedAssignments.subOrgId"] = {$in: body.orgIds.map(id => new ObjectId(id))};
    if(body.branchIds && body.branchIds.length>0) matchQuery["matchedAssignments.branchId"] = {$in: body.branchIds.map(id => new ObjectId(id))};
    if(body.departmentIds && body.departmentIds.length>0) matchQuery["matchedAssignments.departmentId"] = {$in: body.departmentIds.map(id => new ObjectId(id))};
    if(body.designationIds && body.designationIds.length>0) matchQuery["matchedAssignments.designationId"] = {$in: body.designationIds.map(id => new ObjectId(id))};

    if(body.employeeIds && body.employeeIds.length>0) matchQuery["_id"] = {$in: body.employeeIds.map(id => new ObjectId(id))};

    if (Object.keys(matchQuery).length > 0) {
      query.push( { $match: matchQuery });
    }
    
    let paginationQuery = {
      page: body.page || 1,
      limit: body.limit || 10
    };
    console.log(JSON.stringify(query));
    
    return await aggregationWithPegination(query,paginationQuery, collection_name);
    // return await aggregate(query, collection_name);
  } catch (error) {
    logger.error("Error in getUserByAssignment in user module");
    throw error;
  }
}

export const getUserByIds = async (body) => {
  try {
    if(body.userIds.length === 0) {
      throw {error: "User IDs array is empty"};
    }
    const query = [
      {
        $match: {
          _id: { $in: body.userIds.map(id => new ObjectId(id)) },
          orgId: body.user.orgId,
        }
      }
    ]
    return await aggregate(query, collection_name);
  } catch (error) {
    logger.error("Error in getUserByIds in user module");
    throw error;
  }
}

export const getEmployeeDetails = async(body) => {
  try {
    let query = {
      _id: new ObjectId(body.employeeId),
      orgId: body.user.orgId,
      isActive: true
    }

    return await getOne(query, collection_name)
  }
  catch(error) {
    logger.error("Error in getEmployeeDetails in user module");
    throw error;
  }
}

export const getAllUsers = async(body) => {
  try {
    let query = {
      orgId: body.user.orgId,
    }

    if(body.assignment && body.assignment.length > 0) query['assignmentId'] = {$in : body.assignment.map(a => a._id)}

    return await getMany(query, collection_name)
  }
  catch(error) {
    logger.error("Error in getEmployeeDetails in user module");
    throw error;
  }
}


export const isAuthorizedUserBranch=async(body)=>{
  try{
    const query = {
      isActive: true,
      orgId: new ObjectId(body.user.orgId),
      _id:new ObjectId(body.user._id)
    }

    const branchId=new ObjectId(body.branchId)
    const isClientBranch=body.isClientBranchMatched
    let addStage=[]

    if (isClientBranch) {
      addStage = [
        {
          $addFields: {
            isAuthorized: {
              $in: [branchId, "$assignedBranchId"]
            }
          }
        }
      ]
    } else {
      addStage = [
        {
          $lookup: {
            from: "assignment",
            let: { userAssignments: "$assignmentId" },
            pipeline: [
              { $match: { $expr: { $in: ["$_id", "$$userAssignments"] } } },
              { $project: { branchId: 1 } }
            ],
            as: "assignmentData"
          }
        },
        {
          $addFields: {
            assignmentBranchIds: {
              $map: {
                input: "$assignmentData",
                as: "a",
                in: "$$a.branchId"
              }
            },
            isAuthorized: {
              $in: [branchId, {
                $map: {
                  input: "$assignmentData",
                  as: "a",
                  in: "$$a.branchId"
                }
              }]
            }
          }
        }
      ]
    }

    const pipeline=[
      {
        $match:query
      },
      ...addStage,
      {
        $project: {
          _id: 1,
          isAuthorized: 1
        }
      }
    ]

    return await aggregate(pipeline,collection_name)

  } catch(error) {
    logger.error("Error in isAuthorizedUserBranch in user module");
    throw error;
  }
}

export const userClientCount = async (body) => {
  try {

    const getData =[
  {
    $match: {
      _id: new ObjectId(body?.user?._id),
      orgId: new ObjectId(body?.user?.orgId)
    }
  },
  {
    $lookup: {
      from: "client",
      localField: "orgId",
      foreignField: "orgId",
      as: "clientsData"
    }
  },
  {
    $addFields: {
      startOfWeek: {
        $dateTrunc: { date: "$$NOW", unit:"week" }
      },
      startOfNextWeek: {
        $dateAdd: {
          startDate: { $dateTrunc: { date: "$$NOW", unit: "week" } },
          unit: "month",
          amount: 1
        }
      }
    }
  },
  {
    $project: {
      clients: {
        active: {
          $size: {
            $filter: {
              input: "$clientsData",
              as: "client",
              cond: { $eq: ["$$client.isActive", true] }
            }
          }
        },
        current: {
          $size: {
            $filter: {
              input: "$clientsData",
              as: "client",
              cond: {
                $and: [
                  { $eq: ["$$client.isActive", true] },
                  { $gte: ["$$client.createdAt", "$startOfWeek"] },
                  { $lt: ["$$client.createdAt", "$startOfNextWeek"] }
                ]
              }
            }
          }
        },
        active: {
          $subtract: [
            {
              $size: {
                $filter: {
                  input: "$clientsData",
                  as: "client",
                  cond: { $eq: ["$$client.isActive", true] }
                }
              }
            },
            {
              $size: {
                $filter: {
                  input: "$clientsData",
                  as: "client",
                  cond: {
                    $and: [
                      { $eq: ["$$client.isActive", true] },
                      { $gte: ["$$client.createdAt", "$startOfMonth"] },
                      { $lt: ["$$client.createdAt", "$startOfNextMonth"] }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
]


    return await aggregate(getData, collection_name);

  } catch (error) {
    logger.error("Error while activateOrDeactivateBranch in client branch model");
    throw error;
  }
}

export const userBranchCount = async (body) => {
  try {

    const getData =[
  {
    $match: {
      _id: new ObjectId(body?.user?._id),
      orgId: new ObjectId(body?.user?.orgId)
    }
  },
  {
    $lookup: {
      from: "client",
      localField: "orgId",
      foreignField: "orgId",
      as: "clientsData"
    }
  },
  {
    $addFields: {
      startOfWeek: {
        $dateTrunc: { date: "$$NOW", unit:"week" }
      },
      startOfNextWeek: {
        $dateAdd: {
          startDate: { $dateTrunc: { date: "$$NOW", unit: "week" } },
          unit: "month",
          amount: 1
        }
      }
    }
  },
  {
    $project: {
      clients: {
        active: {
          $size: {
            $filter: {
              input: "$clientsData",
              as: "client",
              cond: { $eq: ["$$client.isActive", true] }
            }
          }
        },
        current: {
          $size: {
            $filter: {
              input: "$clientsData",
              as: "client",
              cond: {
                $and: [
                  { $eq: ["$$client.isActive", true] },
                  { $gte: ["$$client.createdAt", "$startOfWeek"] },
                  { $lt: ["$$client.createdAt", "$startOfNextWeek"] }
                ]
              }
            }
          }
        },
        active: {
          $subtract: [
            {
              $size: {
                $filter: {
                  input: "$clientsData",
                  as: "client",
                  cond: { $eq: ["$$client.isActive", true] }
                }
              }
            },
            {
              $size: {
                $filter: {
                  input: "$clientsData",
                  as: "client",
                  cond: {
                    $and: [
                      { $eq: ["$$client.isActive", true] },
                      { $gte: ["$$client.createdAt", "$startOfMonth"] },
                      { $lt: ["$$client.createdAt", "$startOfNextMonth"] }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
]


    return await aggregate(getData, collection_name);

  } catch (error) {
    logger.error("Error while activateOrDeactivateBranch in client branch model");
    throw error;
  }
}

export const userCount = async (body) => {
  try {

const getData=[
   {
        $match: {
          orgId: new ObjectId(body?.user?.orgId)
        }
      },
   {
    $addFields: {
      isCurrentMonth: {
        $and: [
          {
            $gte: [
              "$createdDate",
              {
                $dateTrunc: {
                  date: "$$NOW",
                  unit: "month"
                }
              }
            ]
          },
          {
            $lt: [
              "$createdDate",
              {
                $dateAdd: {
                  startDate: {
                    $dateTrunc: {
                      date: "$$NOW",
                      unit: "month"
                    }
                  },
                  unit: "month",
                  amount: 1
                }
              }
            ]
          }
        ]
      }
    }
  },
  {
    $group: {
      _id: null,
      current: { $sum: { $cond: ["$isCurrentMonth", 1, 0] } },
      active: { $sum: 1 } // all active
    }
  },
  {
    $project: {
      _id: 0,
      
        current: "$current",
        active: "$active"
      
    }
  }
]

    return await aggregate(getData, collection_name);

  } catch (error) {
    logger.error("Error while activateOrDeactivateBranch in client branch model");
    throw error;
  }
}

export const updateNotificationReadTime = async (body) => {
  try{
    const query = {
      _id : body.user._id
    };

    let update = {
      $set : {notificationReadAt : getCurrentDateTime()}
    }
    return await updateOne(query,update,collection_name)
  }catch(error){
    return {status : false, message : "Failed to update notification read time"}
  }
}

export const logout = async(body) => {
  try {
    let query = {_id : new ObjectId(body.userId), [`device.${body.currDevice.deviceId}.deviceToken`] : body.currDevice.deviceToken}

    let update = {
      $set : {
        [`device.${body.currDevice.deviceId}.isActive`] : ['/api/v1/auth/login'].includes(body.endpoint) ? true : false
      }
    }
    return await updateOne(query, update, collection_name)
  }
  catch (error) {
    return {status : false, message: "Failed to logout!"}
  }
}

export const getUserClients=async(body) => {
  try {
    let query = {
      orgId: new ObjectId(body.user.orgId)
    };
    const employeeIds = body.employeeIds ? body.employeeIds.map(userId=> new ObjectId(userId)) : [];

    const pipeline = [
      {
        $match: { ...query,  clients: {
          $exists: true, $ne: []
        },...(employeeIds.length > 0 ? { _id: { $in: employeeIds } } : {}) },
      },

      {
        $lookup: {
          from: "organization",
          localField: "clients",
          foreignField: "_id",
          as: "clientDetails"
        }
      },
      {
        $unwind:{
            path: "$clientDetails",
            preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup:{
          from:'client',
          localField:'clientDetails._id',
          foreignField:'clientId',
          as:'clientMappedDetails'
        }
      },
      {
        $unwind:{
          path: '$clientMappedDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group:{
          _id: '$clientDetails._id',
          clientMapped:{
            $first:'$clientMappedDetails._id'
          },
          name:{
            $first:'$clientDetails.name'
          }
        }
      },

      {
        $project: {
          _id:0,
          clientId: '$_id',
          clientMapped:1,
          name:1
        }
      }
    ]

    // console.log(".....pipeline...",JSON.stringify(pipeline))

    return await aggregate(pipeline, collection_name)
  }
  catch (error) {
    return {status : false, message: "Failed to get user clients!"}
  }
}

export const getAdminUser = async(body) => {
  try {
    let query = [
      {
        $match: {
          $or : [
          {
            orgId: new ObjectId(body.user?.orgId || body.authUser?.orgId)
          },
          {
            _id : new ObjectId(body.user?._id || body.authUser?._id)
          }

          ]
        }
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roles"
        }
      },
      {
        $match:
          {
            "roles.name": role.ADMIN
          }
      }
    ]
    return await aggregate(query, collection_name)
  }
  catch (error) {
    return {status : false, message : "Failed to get Admin Role Details"}
  }
}



export const getUsersByBranchId=async(body)=>{
  try{

    const query = [
      {
        $match: {
          orgId: new ObjectId(body.user.orgId),
          isActive: true,
          owner: { $ne: true },
        }
      },
      {
        $lookup: {
          from: "assignment",
          localField: "assignmentId",
          foreignField: "_id",
          as: "matchedAssignments"
        }
      },
      {
        $unwind: {
          path: "$matchedAssignments",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "branches",
          localField: "matchedAssignments.branchId",
          foreignField: "_id",
          as: "branch"
        }
      },
      {
        $unwind: {
          path: "$branch",
          preserveNullAndEmptyArrays: true
        }
      },
      // Lookup department details
      {
        $lookup: {
          from: "department",
          localField: "matchedAssignments.departmentId",
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true
        }
      },
      // Lookup designation details (if assigned)
      {
        $lookup: {
          from: "designation",
          localField: "matchedAssignments.designationId",
          foreignField: "_id",
          as: "designation"
        }
      },
      {
        $unwind: {
          path: "$designation",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "organization",
          localField: "orgId",
          foreignField: "_id",
          as: "organization"
        }
      },
      {
        $unwind: {
          path: "$organization",
          preserveNullAndEmptyArrays: true
        }
      }

    ]
    
    let matchQuery = {};

    if(body.branchIds && body.branchIds.length>0) matchQuery["matchedAssignments.branchId"] = {$in: body.branchIds.map(id => new ObjectId(id))};
    if(body.departmentIds && body.departmentIds.length>0) matchQuery["matchedAssignments.departmentId"] = {$in: body.departmentIds.map(id => new ObjectId(id))};
    if(body.designationIds && body.designationIds.length>0) matchQuery["matchedAssignments.designationId"] = {$in: body.designationIds.map(id => new ObjectId(id))};

    if(body.employeeIds && body.employeeIds.length>0) matchQuery["_id"] = {$in: body.employeeIds.map(id => new ObjectId(id))};

    if (Object.keys(matchQuery).length > 0) {
      query.push( { $match: matchQuery });
    }

    query.push({
      $project: {
        _id: 1,
        name: 1,
        employeeId: 1,
        organizationName:'$organization.name',
        branchName: '$branch.name',
        departmentName: '$department.name',
        designationName: '$designation.name',
        joinDate:1,
        address:"$branch.address"
      }
    });
    
    // let paginationQuery = {
    //   page: body.page || 1,
    //   limit: body.limit || 10
    // };
    console.log(JSON.stringify(query));
    
    return await aggregationWithPegination(query,{}, collection_name);


  }catch (error) {
    logger.error("error in getUsersByBranchId in user model",{stack:error.stack})
    throw error
  }

}
