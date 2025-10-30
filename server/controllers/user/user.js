//packages
import moment from 'moment'

//models
import * as userModel from '../../models/user/user.js'

//helpers
import * as apiResponse from '../../helper/apiResponse.js'
import { allPermissions } from '../../helper/constants.js'
import { isValidMobileNumber, isValidEmail, isValidMobilewithCountryCode, isPasswordValid } from '../../helper/validator.js'

import { generateToken, verifyToken } from './jwt.js'
import { ObjectId } from 'mongodb';
import { getDetails, setDetails } from '../../config/redis.js'
import { KafkaService } from '../../utils/kafka/kafka.js'
import { generateRedisKey } from '../../helper/generateRedisKey.js'
import * as helper from '../../helper/formatting.js';
import * as branchModel from '../../models/branch/branch.js'
import * as departmentModel from '../../models/department/department.js';
import * as assignmentModel from '../../models/assignment/assignment.js';
import * as orgModel from '../../models/organization/organization.js';
import * as designationModel from  '../../models/designation/designation.js';
import * as shiftModel from '../..//models/shift/shift.js';
import { response } from 'express'
const kafka = new KafkaService();
//============================ AUTH ==================================

export const getAuthUser = async (request, response, next) => {
    try {
        let body = request.body
        // Check if either email or mobile number is provided
        if (!body.email && !body.mobile) {
            return apiResponse.notFoundResponse(response, "Please provide either an email or a mobile number");
        }
        // Validate mobile number if provided
        if (body.mobile) {
            if (body.mobile === "" || !isValidMobileNumber(body.mobile)) {
                return apiResponse.notFoundResponse(response, "Please enter a valid mobile number");
            }
        }
        // Validate email if provided
        if (body.email) {
            if (body.email === "" || !isValidEmail(body.email)) { // Assuming `isValidEmail` is a function for email validation
                return apiResponse.notFoundResponse(response, "Please enter a valid email");
            }
        }
        userModel.getAuthUser(request.body).then(res => {
            //is not registered
            if (!res.status) return apiResponse.notFoundResponse(response, "User not found. Create your account.")
            request.body.authUser = res.data
            request.body.userId = res.data._id
            return next()
        }).catch(error => {
            request.logger.error("Error while getAuthUser in user controller ", { stack: error.stack });
            return apiResponse.ErrorResponse(response, "Something went worng", error.toString())
        })
    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const isUserValid = async (request, response, next) => {
    try {
        userModel.getUser(request.body).then(res => {
            //is not registered
            if (!res.status) return apiResponse.notFoundResponse(response, "Invalid user")

            request.body.user = res.data
            if(res.data.assignmentId && res.data.assignmentId[0])  request.body.assignmentId = res.data.assignmentId[0]
            request.body.authUser = res.data
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const mapOrganization = async (request, response, next) => {
    try {
        if (request.body.orgExist) return next();
        userModel.mapOrganization(request.body).then(res => {
            if (!res.status) return apiResponse.notFoundResponse(response, "Invalid user")

            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}



export const addUser = async (request, response, next) => {
    try {
        if (request.body.existingUser) return apiResponse.duplicateResponse(response, "Already exist")
        if(request.body._id)return next() // going for update
        userModel.createUser(request.body).then(res => {
            if (res.status) {
                request.body.userId = res.data.insertedId
                return next()
            }
            else throw {}
        }).catch(error => {
            request.logger.error("Error while adding user in user controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const updateDetails = async (request, response, next) => {
    try {
        if (request.body.notExist) return next()
        userModel.updateDetails(request.body).then(res => {
            if (res.status) {
                return next()
            }
            else throw {}
        }).catch(error => {
            request.logger.error("Error in updateDetails", { stack: error.stack });
            return apiResponse.somethingResponse(response, "Unable to update User")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const resetPassword = async (request, response, next) => {
    try {
        if (!isPasswordValid(request.body.password)) return apiResponse.notFoundResponse(response, "Password must contain 1 upper case, 1 lower case, 1 special character, 1 number ")

        //db password == new password
        if (request.body.user.password === request.body.password) return apiResponse.validationError(response, "You are using old password")

        userModel.updatePassword(request.body).then(res => {
            if (!res.status) throw {}

            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Failed to reset password")
        })

    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


// export const getUserList = async(request, response, next) =>{
//   try {
//     if(!request.body.user.orgId) return apiResponse.validationError(response, 'Please create your organization')
//     const userList = await userModel.getUserList(request.body)
//     if(!userList.status) return apiResponse.notFoundResponse(response, 'No users found.')

//     let role = request.body.roleDetailsArray
//     // let currentUser = userList.data.filter(user => user._id.toString() == request.body.user._id.toString())[0]
//     userList.data = userList.data.filter(user => user._id.toString() != request.body.user._id.toString() && user.role[0]?.priority > role[0]?.priority)

//     if (request.body.filter && request.body.filter.branch && request.body.filter.branch.length > 0) {
//         let filteredData = []
//         for (let i = 0; i < userList.data.length; i++) {
//             let data = userList.data[i]
//             request.body.filter.branch.forEach(b => {
//                 if (data.branch[b.toString()]) {
//                     filteredData.push(data)
//                 }
//             })
//         }
//         userList.data = filteredData
//     }
//     if (request.body.filter && request.body.filter.warehouse && request.body.filter.warehouse.length > 0) {
//         let filteredData = []
//         for (let i = 0; i < userList.data.length; i++) {
//             let data = userList.data[i]
//             Object.keys(data.branch).forEach(b => {
//                 if (data.branch[b.toString()]) {
//                     request.body.filter.warehouse.forEach(w => {
//                         if(data.branch[b.toString()].map(b => b.toString()).includes(w.toString())) {
//                             filteredData.push(data)
//                         }
//                     })
//                 }
//             })
//         }

//         let unique = []
//         const set = new Set();
//         filteredData.forEach(f => {
//             let ids = f._id.toString()
//             if (!set.has(ids)) {
//                 set.add(ids);
//                 unique.push(f);
//               }
//         })

//     userList.data = unique
//     }
//     userList.data = userList.data.map(u=>{
//         let warehouseCount = Object.keys(u.branch).reduce((acc,bid)=>{
//             console.log(u.branch[bid]);
//             console.log(u.branch[bid].length);

//             return acc + u.branch[bid].length
//         },0)
//         let result = {
//             id: u._id,
//             name: u.name,
//             mobile: u.mobile,
//             role: u.role[0].name,
//             createdDate: u.createdDate,
//             // createdBy: u.createdBy,
//             branchCount: Object.keys(u.branch).length,
//             warehouseCount:warehouseCount,
//             isActive: u.isActive,
//             email: u.email,
//             category: u.category,
//             group: u.group
//           }
//           return result
//     })
//     request.body.userList = userList.data
//     return next()

//   } catch (error) {
//     return apiResponse.somethingResponse(response, error?.message)
//   }
// }

export const getUserList = async (request, response, next) => {
    try {
        const userList = await userModel.getUserList(request.body)

        if (request.body.wizardGetAllData) {
            if (userList.status && userList.data && userList.data.length > 0) request.body.allDataRes['users'] = userList.data
            return next()
        }
        if (!userList.status) return apiResponse.notFoundResponse(response, 'unable to fetch user list')
        
        request.body.userList = userList
        return next()
        // return apiResponse.successResponseWithData(response, `User list found`, userList.data)
    } catch (error) {
        return apiResponse.somethingResponse(response, error, error?.message)
    }
}


// export const getUserDetails = async (request, response, next) => {
//     try {
//         request.body.query = request.query;
//         if (!request.query.orgLevel && request.body.assignment?.status) request.body.query.assignment = request.body.assignment.data;
//         if (
//             (request.query.branchId || 
//              request.query.departmentId || 
//              request.query.designationId) && 
//             !request.body.assignment
//         ) {
//             return apiResponse.responseWithPagination(response, "Data found successfully", {
//                 totalRecord: 0,
//                 next_page: false,
//                 data: []
//             });
//         }
//         request.body.query.orgId = request.body.user.orgId
//         // let matchQuery = {
//         //     orgId: request.body.user.orgId
//         // };

//         // // Add the additional fields if they are provided (not undefined)
//         // if (request.query.branchId) {
//         //     matchQuery.branchId = new ObjectId(request.query.branchId);
//         // }
//         // if (request.query.departmentId) {
//         //     matchQuery.departmentId = new ObjectId(request.query.departmentId);
//         // }
//         // if (request.query.designationId) {
//         //     matchQuery.designationId = new ObjectId(request.query.designationId);
//         // }
//         // // Add the additional fields if they are provided (not undefined)
//         // if (request.query.branchId) {
//         //     matchQuery.branchId = new ObjectId(request.query.branchId);
//         // }
//         // if (request.query.departmentId) {
//         //     matchQuery.departmentId = new ObjectId(request.query.departmentId);
//         // }
//         // if (request.query.designationId) {
//         //     matchQuery.designationId = new ObjectId(request.query.designationId);
//         // }

//         const userList = await userModel.getUserDetails(request.body)
//         if (!userList.status) return apiResponse.notFoundResponse(response, 'unable to fetch user list')
//         request.body.designation = userList;
//         return next()
//         return apiResponse.successResponseWithData(response, `User list found`, userList.data)
//     } catch (error) {
//         request.logger.error("Error while getDesignation in designation controller ", { stack: error.stack });
//         return apiResponse.somethingResponse(response, error.message)
//         request.logger.error("Error while getDesignation in designation controller ", { stack: error.stack });
//         return apiResponse.somethingResponse(response, error.message)
//     }
// }

// get User details
export const getUserDetails = async (request, response, next) => {
    try {
        const { query, body } = request;
        body.query = query;

        // Handle edge cases
        if (!query.orgLevel && body.assignment?.status) {
            body.query.assignment = body.assignment.data;
        }
        if (
            (query.branchId || query.departmentId || query.designationId) &&
            !body.assignment
        ) {
            return apiResponse.responseWithPagination(response, "Data found successfully", {
                totalRecord: 0,
                next_page: false,
                data: []
            });
        }
        body.query.orgId = body.user.orgId;

        const dbResponse = await userModel.getUserDetails(body);
        let userList = dbResponse;
        body.designation = userList;

        return next();
    } catch (error) {
        request.logger.error("Error in getUserDetails", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};


export const getuserActiveList = async (request, response, next) => {
    try {
        const { orgId } = request.body
        if (!orgId) return apiResponse.validationError(response, 'Please provide organization id')
        const userList = await userModel.getactiveUser(orgId)
        if (!userList.status) return apiResponse.notFoundResponse(response, 'unable to  user list')

        return apiResponse.successResponseWithData(response, `Active user list found`, userList.data)

    } catch (error) {
        return apiResponse.somethingResponse(error, error?.message)
    }
}

export const getClientUserList = async (request, response, next) => {
    try {

        const userList = await userModel.clientUserList(request.body)
        if (!userList.status) return apiResponse.notFoundResponse(response, 'unable to get client user list')
        let {data, ...rest} = userList
        if(request.body.attendanceStatus) {
            rest['checkIns'] = 0 
            rest['checkOuts'] = 0 
            data = data.map(u => {
                if(request.body.allUserAttendance[u._id?.toString()]?.checkOut) rest['checkOuts'] += 1
                if(request.body.allUserAttendance[u._id?.toString()]?.checkIn && !request.body.allUserAttendance[u._id.toString()]?.checkOut) rest['checkIns'] += 1

                return {...u,...request.body.allUserAttendance[u._id.toString()]}
            }) // check if user is checked in or not
        }
        data = data.sort((a, b) => a.name.firstName.localeCompare(b.name.firstName))
        let finalResult = {...rest, data}
        return apiResponse.successResponseWithData(response, `Client User List Found Successfully`, finalResult )

    } catch (error) {
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const getusernonActiveList = async (request, response, next) => {
    try {
        const { orgId } = request.body
        if (!orgId) return apiResponse.validationError(response, 'Please provide organization id')
        const userList = await userModel.getnonActiveUser(orgId)
        if (!userList.status) return apiResponse.notFoundResponse(response, 'unable to find user list')

        return apiResponse.successResponseWithData(response, `Active user list found`, userList.data)

    } catch (error) {
        return apiResponse.somethingResponse(error, error?.message)
    }
}


export const uploadImage = (request, response, next) => {

    try {
        if (request.body?.skip) return next()

        if (!request.files || Object.keys(request.files).length === 0) {
            return response.status(400).send('No files were uploaded.');
        }
        let file = request.files.file;
        var type = request.files.file.mimetype.split('/')
        var fileName = `Image_` + moment().format('YYYYMMDDHHmmss') + `.${type[1]}`

        file.mv(request.body.folderPath + `/${fileName}`, (err) => {
            if (err) {
                console.log(err);
                return response.status(500).send(err);
            }
            request.body.imagePath = request.body.dbfolderPath + `/${fileName}`;

            return next()
        });
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(response, err.message,)
    }
}

export const updateImagePath = async (request, response, next) => {
    try {
        if(!request.body.self) return next() // admin updating user profile image 

        userModel.updateImagePath(request.body).then(res => {
            if (res.status) {
                return next()
            }
            else throw {}
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to update Profile Image Path")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const updateProfile = async (request, response, next) => {
    try {
        if (!request.body.userId) return apiResponse.validationError(response, "Please provide user id")

        userModel.updateProfile(request.body).then(res => {
            if (res.status) {
                return apiResponse.successResponse(response, "Profile updated successfully")
            }
            else throw {}
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to update Profile")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getOneUser = async (request, response, next) => {
    try {
        let mobile = request.body.mobile
        if (mobile == undefined || mobile == "") return apiResponse.validationError(response, `please check mobile number`)
        if (!isValidMobileNumber(mobile)) return apiResponse.validationError(response, `please check mobile number`)

        userModel.getUserbyMobile(request.body).then(res => {
            //if(res.status) {
            request.body.existingUser = res.data
            return next()
            //  }
            //else throw {}
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Invalid User!")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getLoggedUser = async (request, response, next) => {
    try {
        const loggedUser = await userModel.getLoggedUser(request.body)
        if (loggedUser.status) {
            request.body.Users = loggedUser.data
            request.body.roles = loggedUser.data.map(u => u.roles)
            let roles = request.body.roles
            const Priority = roles[0].reduce((minObject, currentObject) => {
                if (currentObject.Priority < minObject.Priority) {
                    return currentObject;
                }
                return minObject;
            }, roles[0][0]);
            request.body.Priority = Priority?.Priority
            return next()
        }
    } catch (error) {
        console.log(error);
        request.logger.error("Error while getLoggedUser in role controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
}
//activate-deactive user checks
export const userStatusChecks = async (request, response, next) => {
    try {

        const validActions = ['activate', 'deactivate'];
        request.body.actionType = request.params.actionType?.toString()?.toLowerCase()

        if (validActions.includes(request.params.actionType)) {
            if (!request.body.id) return apiResponse.notFoundResponse(response, "Please provide user id");
            return next()
        }

        return apiResponse.notFoundResponse(response, "Invalid user action type, Please try again later.")

    } catch (error) {
        console.log(error);
        return apiResponse.somethingResponse(response, error?.message)
    }
}

//user activation - deactivation
export const toggleUserStatus = async (request, response, next) => {
    try {
        if (request.body.actionType == 'activate' && request.body.user.isActive == true) return apiResponse.successResponse(response, "User already activated")
        if (request.body.actionType == 'deactivate' && request.body.user.isActive == false) return apiResponse.successResponse(response, "User already deactivated")

        userModel.toggleStatus(request.body).then(res => {
            if (res.status) {
                return apiResponse.successResponse(response, `User ${request.body.actionType == 'activate' ? "activated" : "deactivated"} successfully`)
            }
            else throw {}
        }).catch(error => {
            return apiResponse.customResponse(response, "Unable to update user status")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

//to solve ambiguity between auth user id and user id (from front-end)
export const updateUserIdAndAuthId = async (request, response, next) => {
    request.body.authUserId = request.body.userId,
        request.body.userId = request.body.id
    return next()
}

//user profile checks
export const userProfileChecks = async (request, response, next) => {
    try {

        //As of now one field only
        if (request.body.email && !isValidEmail(request.body.email)) return apiResponse.validationError(response, "Invalid email")

        return next()
    } catch (error) {
        console.log(error);
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const getUserModules = async (request, response, next) => {
    try {
        userModel.getUserModules(request.body).then(res => {
            if (res.status) {
                let result = res.data[0]

                // Create an object to store unique module names as keys
                const uniqueModules = {};
                // if(!result.role){
                //     return next()
                // }

                // Iterate through roles and their modules
                result?.roles.forEach((role) => {
                    role?.Modules.forEach((module) => {

                        //Module needs to be active
                        if (module.isActive === 1 || module.isActive === true) {

                            const moduleName = module.name;
                            const permissions = role.modules.find(m => m.moduleId.toString() === module._id.toString())?.permissions

                            // Check if the module name is already in the uniqueModules object
                            if (uniqueModules[moduleName]) {
                                // Merge the permissions array for the duplicate module
                                uniqueModules[moduleName].permissions = [
                                    ...new Set([
                                        ...uniqueModules[moduleName].permissions,
                                        ...permissions,
                                    ]),
                                ];
                            } else {
                                // If it's a new module name, add it to uniqueModules
                                uniqueModules[moduleName] = {
                                    moduleId: module._id,
                                    name: moduleName,
                                    moduleKey: module.moduleKey,
                                    permissions,
                                };
                            }
                        }
                    });
                });

                // Extract the unique merged modules as an array
                request.body.assignedModules = Object.values(uniqueModules);
                return next()
            }

            else throw {}
        }).catch(error => {
            request.logger.error("Error while getUserModules in user controller.",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.toString())
        })
    }
    catch (error) {
        request.logger.error("Error while getUserModules in user controller.",{ stack: err.stack });
        return apiResponse.somethingResponse(response, error.toString())
    }
}

export const updateOTP = async (request, response, next) => {
    try {
        userModel.updateOTP(request.body).then(res => {
            if (!res.status) throw {}

            return next()
        }).catch(error => {
            request.logger.error("Error in updateOTP", { stack: error.stack });
            return apiResponse.somethingResponse(response, "Unable to update OTP ")
        })
    }
    catch (error) {
        request.logger.error("Error in updateOTP", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const isUserExist = async (request, response, next) => {
    try {
        userModel.isUserExist(request.body).then(res => {
            if (!res.status) throw {}

            request.body.userExist = true
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "User Does not exist")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const updateUser = async (request, response, next) => {
    try {
        if (request.body.branch) {
            let branches = request.body.branches
            let warehouseList = request.body.warehouse
            if (!Array.isArray(branches) || branches.length == 0) return apiResponse.validationError(response, "Please enter valid branches")
            request.body.allocatedBranch = {}

            if (Array.isArray(branches)) {
                let matchedWarehouseStatus = true
                if (branches.length == 1) {
                    branches.map(b => {
                        let matchedWarehouse = warehouseList !== undefined ? b.warehouses.map(w => new ObjectId(w.id)).filter(wid => warehouseList.includes(wid.toString())) : b.warehouses.map(w => new ObjectId(w.id))
                        if (matchedWarehouse.length == 0) matchedWarehouseStatus = false
                        request.body.allocatedBranch[b.id] = matchedWarehouse
                    })
                }
                else if (branches.length > 1) {
                    branches.map(b => {
                        let matchedWarehouse = b.warehouses.map(w => new ObjectId(w.id))
                        if (matchedWarehouse.length == 0) matchedWarehouseStatus = false
                        request.body.allocatedBranch[b.id] = matchedWarehouse
                    })
                }
                if (!matchedWarehouseStatus) return apiResponse.validationError(response, "Please select a valid warehouse")
            }
        }
        userModel.updateUser(request.body).then(res => {
            if (!res.status) throw {}

            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to update user")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const isUpdatingUserValid = async (request, response, next) => {
    try {
        request.body.updatedUserId = request.body.id
        userModel.isUpdatingUserValid(request.body).then(res => {
            if (!res.status) throw {}
            request.body.updatingUserDetails = res.data
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Invalid User!")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const updateDisabledModules = async (request, response, next) => {
    try {
        // if(request.body?.authUser?.owner || request.body?.user?.owner) return next()
        if (request.body.disabledModules.length == 0) return next()
        userModel.updateDisabledModules(request.body).then(res => {
            if (!res.status) throw {}

            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to update Disabled Modules")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const checkDisabledModules = async (request, response, next) => {
    try {
        // if(request.body?.authUser?.owner || request.body?.user?.owner) return next()
        const ALL_PERMS = ["c", "r", "u", "d"];
        let disabledModules = request.body.authUser?.disabledModules || request.body.userDetails?.disabledModules || request.body.designation?.disabledModules
        // console.log("disabledmodules",JSON.stringify(disabledModules));
        // const disabledModules = [
        //     ...(Array.isArray(request.body.authUser?.disabledModules)
        //       ? request.body.authUser.disabledModules
        //       : []),
      
        //     ...(Array.isArray(request.body.userDetails?.disabledModules)
        //       ? request.body.userDetails.disabledModules
        //       : []),
      
        //     ...(Array.isArray(request.body.designation?.disabledModules)
        //       ? request.body.designation.disabledModules
        //       : []),
        // ];
        let dbModules = request.body.assignedModules
        // console.log("dbModules",JSON.stringify(dbModules));
        // let moduleMap = new Map(dbModules.map(m => [m.moduleId.toString(), m.permissions]))
        const disabledMap = new Map();
        
        if (Array.isArray(disabledModules)) {
            for (const m of disabledModules) {
                // const moduleId = typeof m === "string" ? String(m) : String(m.moduleId);
                // const perms = m && m.permissions ? m.permissions : ["all"];
            if (typeof m === "string") {
                disabledMap.set(String(m), new Set(["all"]));
            } else if (m && m.moduleId) {
                disabledMap.set(String(m.moduleId), new Set(m.permissions || ["all"]));
            }
            // if (!disabledMap.has(moduleId)) {
            //     disabledMap.set(moduleId, new Set(perms));
            //   } else {
            //     const existing = disabledMap.get(moduleId);
            //     for (const p of perms) existing.add(p); // ✅ merge permissions
            //     disabledMap.set(moduleId, existing);
            //   }
            }
        } else if (disabledModules && typeof disabledModules === "object") {
            for (const [k, v] of Object.entries(disabledModules)) {
            disabledMap.set(String(k), new Set(Array.isArray(v) ? v : ["all"]));
            }
        }
        // let i = 0
        // let filteredModules = []
        // while (i < dbModules.length) {
        //     let getModules = moduleMap.get(dbModules[i].moduleId.toString())
        //     let getDisabled = disabledModules && Object.keys(disabledModules).length > 0 ? disabledModules[dbModules[i].moduleId.toString()] : undefined

        //     let permissions = {}
        //     let filter = []
        //     if (getDisabled) {
        //         getDisabled.forEach(p => {
        //             let filterDisabledPermissions = getModules.filter(f => f != p)
        //             filter.push(filterDisabledPermissions[0])
        //         })
        //     }
        //     allPermissions.forEach(al => {
        //         if (getDisabled && getDisabled.includes(al)) {
        //             permissions[al] = "disabled"
        //         }
        //         else if ((filter.length != 0 && filter.includes(al)) || getModules.includes(al)) {
        //             permissions[al] = "checked"
        //         }
        //         else {
        //             permissions[al] = "unchecked"
        //         }
        //     })
        //     filteredModules.push({ moduleId: dbModules[i].moduleId, name: dbModules[i].name, moduleKey: dbModules[i].moduleKey, permissions: request.originalUrl == "/api/v1/user/details" || "/api/v1/auth/login" ? permissions : dbModules[i].permissions })
        //     // else {
        //     //     filteredModules.push(dbModules[i])
        //     // }
        //     i++
        // }
        // request.body.assignedModules = filteredModules

        const filteredModules = dbModules.map((m) => {
            const moduleId = String(m.moduleId);
            const rolePerms = new Set(m.permissions || []);
            const disabledPerms = disabledMap.get(moduleId) || new Set();
            const isAllDisabled = disabledPerms.has("all");
      
            const permissions = {};
            for (const p of ALL_PERMS) {
              // If disabled -> unchecked
              if (isAllDisabled || disabledPerms.has(p)) {
                permissions[p] = "unchecked";
              } else if (rolePerms.has(p)) {
                permissions[p] = "checked";
              } else {
                permissions[p] = "unchecked";
              }
            }
      
            return {
              moduleId: m.moduleId,
              name: m.name,
              moduleKey: m.moduleKey,
              permissions, // always the {c,r,u,d} status object
            };
          });
      
          request.body.assignedModules = filteredModules;
        // console.log("...filterdModules",JSON.stringify(filteredModules));
        return next()
    }
    catch (error) {
        request.logger.error("Error while checkDisabledModules in user controller.",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString())
    }
}


export const checkDisabledModules2 = async (req, res, next) => {
    try {
      // Owners bypass
      if (req.body?.authUser?.owner || req.body?.user?.owner) return next();
  
      const ALL_PERMS = ["c", "r", "u", "d"];
  
      const dbModules = req.body.assignedModules || [];
      const disabledRaw =
        req.body.authUser?.disabledModules ||
        req.body.userDetails?.disabledModules ||
        [];
  
      // --- Build disabled map: moduleId(string) -> Set(perms)
      // Supports:
      //   [{ moduleId, permissions: [...] }]
      //   ["<moduleId>", ...]  -> full disable
      //   { "<moduleId>": ["c","u"] } -> object form
      const disabledMap = new Map();
  
      if (Array.isArray(disabledRaw)) {
        for (const m of disabledRaw) {
          if (typeof m === "string") {
            disabledMap.set(String(m), new Set(["all"]));
          } else if (m && m.moduleId) {
            disabledMap.set(String(m.moduleId), new Set(m.permissions || ["all"]));
          }
        }
      } else if (disabledRaw && typeof disabledRaw === "object") {
        for (const [k, v] of Object.entries(disabledRaw)) {
          disabledMap.set(String(k), new Set(Array.isArray(v) ? v : ["all"]));
        }
      }
  
      const filteredModules = dbModules.map((m) => {
        const moduleId = String(m.moduleId);
        const rolePerms = new Set(m.permissions || []);
        const disabledPerms = disabledMap.get(moduleId) || new Set();
        const isAllDisabled = disabledPerms.has("all");
  
        const permissions = {};
        for (const p of ALL_PERMS) {
          // If disabled -> unchecked
          if (isAllDisabled || disabledPerms.has(p)) {
            permissions[p] = "unchecked";
          } else if (rolePerms.has(p)) {
            permissions[p] = "checked";
          } else {
            permissions[p] = "unchecked";
          }
        }
  
        return {
          moduleId: m.moduleId,
          name: m.name,
          moduleKey: m.moduleKey,
          permissions, // always the {c,r,u,d} status object
        };
      });
  
      req.body.assignedModules = filteredModules;
      return next();
    } catch (error) {
      req.logger?.error?.("Error while checkDisabledModules", { stack: error.stack });
      return apiResponse.somethingResponse(res, error.toString());
    }
  };
  
  

export const getUserById = async (request, response, next) => {
    try {
        request.body.id = request.params.id || request.body.id
        request.body.detailsType = request.params.type
        userModel.getUserById(request.body).then(res => {
            if(!res.status) throw {}
            let userDetails = res.data
            request.body.userDetails = userDetails

            // request.body.category = res.data?.category
            // request.body.group = res.data?.group
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const getExecutiveUsers = async (request, response, next) => {
    try {
        userModel.getExecutiveUsers(request.body).then(res => {
            if (!res.status) throw {}
            request.body.executiveUsers = res?.data[0].users || [];
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to update Disabled Modules")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const updateUserDetails = async (request, response, next) => {
    try {
        // if (!ObjectId.isValid(request.params.userId)) return apiResponse.validationError(response, "Invalid mongoId!")
        if (request.body.leaveGroupId) {
            request.body.leaveGroupId = new ObjectId(request.body.leaveGroupId)
        }
        if (request.body.assignmentId) {
            request.body.assignmentId = new ObjectId(request.body.assignmentId)
        }
        if (request.body.roleId) {
            request.body.roleId = new ObjectId(request.body.roleId)
        }
        if (request.body.shiftGroupId) {
            request.body.shiftGroupId = new ObjectId(request.body.shiftGroupId)
        }
        if(request.body.assignmentIds) {
            request.body.assignmentId = request.body.assignmentIds
        }
        // if(['/api/v1/user/update/address'].includes(request.originalUrl)) {
        //     // let fields = {geoJson : ['addressType', 'flatNo', 'street', 'landmark', 'city', 'district', 'state', 'pincode'], geoLocation: ['type', 'coordinates']}

        //     // request.body.address = {presentAddress : {}, permanentAddress : {}}

        //     // let addressObj = request.body.address
            
        //     // for (const f in fields) {
        //     //     fields[f].forEach(val => {
        //     //         if (request.body.presentAddress[f][val]) {
        //     //             request.body.presentAddress[f] = request.body.presentAddress[f]
        //     //         }
        //     //         if (request.body.permanentAddress && Object.keys(request.body.permanentAddress).length > 0 && request.body.permanentAddress[f]) {
        //     //             addressObj['permanentAddress'][f] = request.body.permanentAddress[f]
        //     //         }
        //     //     })
        //     // }

        //     if(request.body.isPermanentSame) {
        //         addressObj['isPermanentSame'] = true
        //         delete addressObj['permenentAddress']
        //     }

        // }
        userModel.updateUserDetails(request.body, request.params).then(res => {
            if (!res.status) throw {}
            request.body.employeeId = request.body.id
            let message = [
                { key: "body", value: JSON.stringify(request.body) }
            ]
            kafka.sendMessage("user-logs", message)
            return next()
        }).catch(error => {
            request.logger.error("Error while updateUserDetails in user controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch (error) {
        request.logger.error("Error while updateUserDetails in user controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

// this below function for checking user valid/invalid before map/unmap branch/dept/desg to user
export const isEmployeeUserValid = async (request, response, next) => {
    try {
        userModel.getEmployeeUser(request.body).then(res => {
            //is not registered
            if (!res.status) return apiResponse.notFoundResponse(response, "Invalid Emloyee user")
            request.body.userEmployee = res.data
            // request.body.existingDisabledModules = res.data.disabledModules ?? []
            request.body.existingDisabledModules = res.data.disabledModules ?? {}


            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

// this below function for update  map/unmap branch/dept/desg of assigntmentid to user
export const updateEmployeeUserDetails = async (request, response, next) => {
    try {
        userModel.updateEmployeeUserDetails(request.body).then(res => {
            if (!res.status) throw {}
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to update user details")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


// get userInfo details in array
export const getUserInfoDetails=async(request,response)=>{
    try{
        const getUserInfoDetails=await  userModel.getUserInfoDetails(request.body)
        if(getUserInfoDetails.status&&getUserInfoDetails.data.length>=1){
            return apiResponse.successResponseWithData(response,'data found successfully',getUserInfoDetails.data)
        }
        return apiResponse.notFoundResponse(response,'No Datafound')
        
    }catch(error){
        request.logger.error("Error in getUserDetails", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
}

export const getAssignedUsers = async (request, response, next) => {    
    try {
        userModel.getAssignedUsers(request.body).then(res => {
            if (!res) throw {}
            request.body.assignedUsers = res
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to fetch assigned users")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getAssignmentDetails = async (request, response, next) => {    
    try {
        userModel.getAssignmentDetails(request.body).then(res => {
            if (!res.status) throw {}
            request.body.assignmentData = res.data[0]
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to fetch assigned users")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const useGetResponse = (request, response, next) => {
    if (request.body.sendLoginResponse) {
        return apiResponse.successResponseWithData(response, "User Details Found Successfully",
            {
                _id: request.body.user._id,
                name: request.body.user.name,
                email: request.body.user.email,
                orgId: request.body.orgDetails?._id,
                orgName: request.body.orgDetails?.name,
                addSubOrg: request.body.user.addSubOrg,
                addBranch: request.body.user.addBranch,
                pending: request.body.pending,
                modules: request.body.assignedModules,
                roleName: request.body.roleName,
                roleId: request.body.authUser?.role[0] ?? null,
                address: request.body.authUser?.address ?? null,
                profileImage: request.body.user.profileImage ?? null,
                joinDate: request.body.user.joinDate ?? null
            });
    }
    else return next()
}

export const multipleClientMapping = (request,response,next) =>{
   try {
        userModel.multipleClientMapping(request.body).then(res => {
            if (!res.status) throw {}
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to add multiple clients to user")
        })
   }
   catch (error) {
        return apiResponse.somethingResponse(response, error.message)
   }
}

export const multipleClientUnMap = (request,response,next) =>{
   try {
        userModel.multipleClientUnMap(request.body).then(res => {
            if (!res.status) throw {}
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to remove multiple clients to user")
        })
   }
   catch (error) {
        return apiResponse.somethingResponse(response, error.message)
   }
}

export const filterExistingClientIds = (request, response, next) => {
    try {
        
        let userData = request.body.updatingUserDetails

        if((!userData.clients?.length && !userData.clientBranches?.length)) {
            request.body.clientIds = Object.keys(request.body.clientIds)
            return next()
        }

        let fields = ['client', 'clientBranch']

        if(!request.body.clientBranchIds || !request.body.clientBranchIds?.length) request.body.clientBranchIds = request.body.clientBranchData.map(cbd => cbd._id)

        if (['/api/v1/user/client/multiple/un-map'].includes(request.originalUrl)) {
            let check = []
            
            Object.keys(request.body.clientIds).forEach(element => {
                let filter = userData.clientBranches.filter(item => !request.body.clientBranchIds?.includes(item.toString()));

                if(!filter.some(item => request.body.clientIds[element].includes(item.toString()))) check.push(element)
            })

            request.body.clientIds = check
        }
        else {
            request.body.clientIds = Object.keys(request.body.clientIds)
            fields.forEach(f => {
                if(request.body[`${f}Ids`]) {
                    request.body[`${f}Ids`] = request.body[`${f}Ids`].map(fm => {
                        let filterData = userData[f == 'client' ? `${f}s` : `${f}es`].filter(ff => ff.toString() == fm.toString())[0]
                        if (!filterData) return new ObjectId(fm)
                    }).filter(fu => fu !== undefined)
                }
            })
        }

        
        


        return next()
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


// user excel format
export const getEmployeeExcelFormat=async(request,response,next)=>{
    try{
        const employeeExcelFormatData=await helper.employeeExcelFormat(request.body)
        if(employeeExcelFormatData.status){
            request.body.filePath=employeeExcelFormatData.data
            return next()
        }
        return apiResponse.ErrorResponse(response,'unable to import')

    }catch (error) {
        request.logger.error("Error while getEmployeeExcelFormat in user controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const importEmployeeExcel= async (request, response, next) => {
    try {
        const {employExtractData=[],inValidData=[],duplicates=[]}=await helper.extractImportEmployeeExcel(request,response,next)
        // console.log("....employExtractData...",JSON.stringify(employExtractData))
        // console.log("....inValidData...",JSON.stringify(inValidData))
        // console.log("....duplicates...",JSON.stringify(duplicates))
        if(employExtractData.length<0 && duplicates.length>0){
            const result=await helper.employeeResponseExcelFormat(duplicates)
            return apiResponse.validationErrorWithData(response,`${duplicates.length} failed to Add`,result)
        }

        if(employExtractData.length<1 && inValidData.length>0){
            const result= await helper.employeeResponseExcelFormat(inValidData)
            return apiResponse.validationErrorWithData(response,`${inValidData.length} failed to Add`,result)
        }

        if(employExtractData.length<1){
            return apiResponse.validationError(response,'No Data in excel,provide Data')
        }

        // extract keys for matching  organization & employee data existing in db or not
        const employeeData = employExtractData.map(row => ({
            mobile: String(row.mobile)?.trim(),
        }));
        
        const employeeExisting=await userModel.isUserExist({...request.body,employeeData})
        
        
        let existingEmployeeKeySet = new Set(); 

        if (employeeExisting.status && Array.isArray(employeeExisting.data)) {
            existingEmployeeKeySet = new Set(
                employeeExisting.data.map(r => `${r.mobile}`)
            );
            
        }
        let duplicateUserData=[]

        let addUserCount=0
        for(const row of employExtractData){

            const key = `${row.mobile}`;
            if (existingEmployeeKeySet.has(key)) {
                duplicateUserData.push({ ...row, status: 'this employee mobile alreday  existed' });
                continue
            }

            let shiftExist
            if(row.workTimingType==='NO' && row.shiftIds!=='NO'){
                 shiftExist=await shiftModel.getShiftIdOnName({...request.body,name:row.shiftIds})
                 if(!shiftExist?.status){
                    duplicateUserData.push({ ...row, status: 'Shift Is Not In Shift Master Please Create Shift In Portal' });
                    continue
                 }
            }

            let subOrgId
            if(request.body.orgDetails?.structure==='group'){
                const subOrgExist=await orgModel.isSubOrgExist({...request.body,subOrgName:row.subOrganization})
                if(subOrgExist.data.length<1){
                    const subOrg={
                        ...request.body,
                        name:row.subOrganization,
                        orgTypeId:"68395dbe99d4a7849eb57202",
                        parentOrg:request.body.user.orgId
                        
                    }
                    const addSubOrg = await orgModel.addOrganization({...subOrg})
                    subOrgId=addSubOrg.data.insertedId
                }else {
                    subOrgId = subOrgExist.data[0]._id;
                }
            }
            
            const branchExist= await branchModel.isBranchExists({...request.body,name:row.branch,subOrgId})
            const departmentExist=await departmentModel.getOneDepartment({...request.body,name:row.department})
            const designationExists=await designationModel.getOneDesignation({...request.body,name:row.designation})
            
            let branchId
            let departmentId
            let designationId
            let assignmentId
            if(branchExist?.status===false){
                const branchData = {
                    orgId: new ObjectId(request.body.user.orgId),
                    ...(subOrgId && {subOrgId:new ObjectId(subOrgId)}),
                    name: row.branch,
                    // address:{addressTypeId:new ObjectId("683ecd1599d4a7849eb5722f"),...row.address}, 
                    isActive: true,
                    createdDate: new Date(),
                    createdBy: new ObjectId(request.body.user._id)
        
                }
                const addBranch = await branchModel.addBranch({branchData})
                branchId=addBranch.data.insertedId
            }else{
                branchId=branchExist.data._id
            }
            


            if(!departmentExist.status){
                
                const addDepartment = await departmentModel.createDepartment({...request.body,name:row.department})
                departmentId=addDepartment.data.insertedId
            }else {
                departmentId = departmentExist.data._id;
            }


            if(!designationExists.status){

                const desg={
                    ...request.body,
                    name:row.designation
                }
                
                const addDesignation = await designationModel.createDesignation(desg)
                designationId=addDesignation.data.insertedId
            }else {
                designationId = designationExists.data._id;
            }

            // checking assignmentId from departmentId && branchId combinations
            const assignmentBody={
                ...request.body,
                branchId,
                departmentId,
                designationId,
                ...(subOrgId && {subOrgId:new ObjectId(subOrgId)})

            }
            const getSingleAssignmentId=await assignmentModel.getSingleAssignment(assignmentBody)
            assignmentId=getSingleAssignmentId?.data?._id
            if(!getSingleAssignmentId.status){
                const addAssignmentBody={
                    ...request.body,
                    ...(branchId && { missingBranchIds:[branchId]}),
                    departmentId,
                    designationId,
                    ...(subOrgId && {subOrgId:new ObjectId(subOrgId)})
                }
                const addAssignmentId=await assignmentModel.assignment(addAssignmentBody)
                assignmentId=addAssignmentId[0]
            }
            const hasValidAddressField = row.address &&
                Object.values(row.address).some(value => value !== null && value !== undefined && value !== "");

            const presentAddress={
                "address":{addressTypeId: new ObjectId("683ecd1599d4a7849eb5722f"), // Assuming this is a valid address type ID
                ...row.address},
                "geoLocation":{...row.address}
            }

            const workTimingType=row.workTimingType==='NO' ?'shift':'branch'
            const salaryConfig=row.salaryConfig==='YES'?true:false
            //user creation
            const addUserBody={
                ...request.body,
                ...row,
                "mobile":String(row.mobile).trim(),
                "emergencyNumber":String(row.emergencyNumber).trim(),
                "guardianNumber":String(row.guardianNumber).trim(),
                "name":{
                    "firstName":row.firstName,
                    "lastName":row.lastName
                },
                "gender":row.gender==='Female'?"female":"male",
                "addUser":true,
                "assignmentIds":[assignmentId],
                "orgId":request.body.user.orgId,
                ...(subOrgId && {subOrgId:new ObjectId(subOrgId)}),
                workTimingType,
                ...(shiftExist?.data && {shiftIds:[new ObjectId(shiftExist.data._id)]}),
                salaryConfig
                
            }
            if(hasValidAddressField){
                addUserBody["presentAddress"]={...presentAddress}
                
            }
            delete addUserBody.address
            if(workTimingType==='branch'){
                delete addUserBody.shiftIds
            }
           
            await userModel.createUser(addUserBody)
            addUserCount++

        }
        // console.log("....inValidData...",JSON.stringify(inValidData))
        // console.log("....duplicates...",JSON.stringify(duplicates))
        // console.log("....duplicateUserData...",JSON.stringify(duplicateUserData))

        if(duplicateUserData.length>=1 || duplicates.length>=1 || inValidData.length>=1){
            const employeeExcelFormatData=await helper.employeeResponseExcelFormat([...duplicateUserData,...inValidData,...duplicates])
            const failedCount = inValidData.length + duplicates.length + duplicateUserData.length;
            const userCountStatus =addUserCount > 0 ? `${failedCount} ${failedCount === 1 ? 'user' : 'users'} failed to Add but ${addUserCount} ${addUserCount === 1 ? 'user' : 'users'} added`
                                : `${failedCount} ${failedCount === 1 ? 'user' : 'users'} failed to Add`;
            // const userCountStatus=addUserCount>0 ? `${inValidData.length+ duplicates.length+duplicateUserData.length} failed to Add but ${addUserCount>1?`${addUserCount} users`:`${addUserCount} user`}added` : `${inValidData.length+ duplicates.length+duplicateUserData.length} failed to Add`
            return apiResponse.validationErrorWithData(response,userCountStatus,employeeExcelFormatData) 
        }


           
        return apiResponse.successResponseWithData(response,'Data inseretd successfully') 
          
    } catch (error) {
        request.logger.error("Error while importemployeeExcel in employee controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getUserBasedDept =async(request,response,next)=>{
    try{
        userModel.getUserBasedDept(request.body).then(res => {
            if(!res.status) throw {}

            request.body.departments = res.data[0]?.department
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "unable to get user based department")
        })

    }catch (error) {
        request.logger.error("Error while clientExcelFormat in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getUserBasedDesignation =async(request,response,next)=>{
    try{
        userModel.getUserBasedDesignation(request.body).then(res => {
            if(!res.status) throw {}

            request.body.designations = res.data[0]?.designation
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "unable to get user based department")
        })

    }catch (error) {
        request.logger.error("Error while clientExcelFormat in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const clientBasedUserIds =async(request,response,next)=>{
    try{
        userModel.clientBasedUserIds(request.body).then(res => {
            if(!res.status) throw {}

            request.body.userIds = res.data
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "unable to get user ids")
        })

    }catch (error) {
        request.logger.error("Error while clientExcelFormat in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}
export const getUserByAssignment = async (request, response, next) => {
    try {
        userModel.getUserByAssignment(request.body).then(res => {
            if (!res.status) throw {}
            request.body.assignmentUsers = res
            request.body.assignmentUserIds = res.data.map(user => new ObjectId(user._id))
            if(!request.body.isClient)return next()
            // Filter users based on clientBranchIds in request body
            const assignedClientBranchIdUsers = res.data.filter(user =>
                user?.clientBranches?.some(branchId =>
                    request.body.clientBranchIds.some(requestId => requestId.toString() === branchId.toString())
                )
            );

            if(request.body.isClient && request.body.assignedClientBranchIdUsers && request.body.assignedClientBranchIdUsers.length <1) {
                return apiResponse.validationError(response, "No users assigned to the selected client branches")
            }
           
            if(!assignedClientBranchIdUsers)return next()
            request.body.assignedClientBranchIdUsers=assignedClientBranchIdUsers
            request.body.assignmentClientUserIds = assignedClientBranchIdUsers.map(user => new ObjectId(user._id))
            if(request.body.isClient){
                request.body.assignmentUsers={data: assignedClientBranchIdUsers}
                request.body.assignmentUserIds=request.body.assignmentClientUserIds
            }
            // console.log("assignmentClientUserIds", request.body.assignmentClientUserIds)
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch (error) {
        request.logger.error("Error while getUserByAssignment in user controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const findUserData = (request, response, next) => {
    try {
        if(request.body.extractedData?.userIds?.length > 0) {
            userModel.getUserByIds({ userIds: request.body.extractedData.userIds , user: request.body.user}).then(res => {
                if(res.data?.length > 0) {
                    if(!request.body["extractedProcessedData"]) request.body.extractedProcessedData = {}
                    request.body.extractedProcessedData["userIds"] = {}
                    res.data.forEach(user => {
                        let userDesignationId = request.body.assignmentUsers.data.filter(u => u._id.toString() === user._id.toString())[0]?.matchedAssignments?.designationId || null

                        let designation = userDesignationId ? request.body.extractedProcessedData?.designationId[userDesignationId]: null

                        request.body.extractedProcessedData["userIds"][user._id] = {
                            _id: user._id,
                            name:user.name
                        }
                        if(designation) {
                            request.body.extractedProcessedData["userIds"][user._id].designation = designation
                        }
                    })
                    return next()
                }
            }).catch(error => {
                request.logger.error("Error while findUserData in user controller ", { stack: error.stack });
                return apiResponse.somethingResponse(response, error.message)
            })
        } else return next()
    } catch (error) {
        request.logger.error("Error while findUserData in user controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getEmployeeDetails = async(request, response, next) => {
    try {
        userModel.getEmployeeDetails(request.body).then(res => {
            if (!res.status) throw {}
            request.body.employeeDetails = res.data
            return next()
        }).catch(error => {
            request.logger.error("Error while getEmployeeDetails in user controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch(error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const swapUserIdWithEmpId = async (request, response, next) => {
    try {
        if(!request.body.employeeId) return next()

        request.body.authUserId = request.body.userId,
        request.body.userId = request.body.employeeId || request.body.userId // if userId is not provided then use authUserId

        return next()
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getAllUsers = async(request, response, next) => {
    try {
        userModel.getAllUsers(request.body).then(res => {
            if (!res.status) throw {}
            request.body.allUsers = res.data.reduce((acc, user) => {
                acc[user._id] = {
                    _id: user._id,
                    name: user.name
                }
                return acc
            }, {})
            return next()
        }).catch(error => {
            request.logger.error("Error while getAllUsers in user controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch (error) {
        request.logger.error("Error while getAllUsers in user controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const userClientCount = (request, response, next) => {
    try {
        request.body.modules = ["client"];
        const checkModules = request?.body?.assignedModules?.some(d => d?.name === 'client');
        if(checkModules)
        {
        userModel.userClientCount(request.body).then(res => {
            if (!res.status) throw {}
            request.body.clientDetails = res.data
            return next()
        }).catch(error => {
            request.logger.error("Error while userClientCount in user controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    else{
        next()
    }
    }
    catch (error) {
        logger.error("Error while activateOrDeactivateClient in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }

}

export const userCount = (request, response, next) => {
    try {
        // request.body.modules = ["user"];
        const checkModules = request?.body?.assignedModules?.some(d => d?.name?.toLowerCase()=== 'user');
        if(checkModules)
        {
        userModel.userCount(request.body).then(res => {
            if (!res.status) throw {}
            request.body.userDetails = res.data
            return next()
        }).catch(error => {
            request.logger.error("Error while userCount in user controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    else{
        next()
    }
    }
    catch (error) {
         request.logger.error("Error while userDetails in client controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }

}

export const updateNotificationReadTime = async (request, response, next) => {
    try {
        userModel.updateNotificationReadTime(request.body).then(res => {
            if (!res.status) throw {}
            return next()
        }).catch(error => {
            console.log(error);
            return apiResponse.somethingResponse(response, "Failed to update notification read time")
        })
    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(response, error.Message)
    }
}


export const isCheckDisabledModulesValid= async (request, response, next) => {
    try{
        if(!request.body?.authUser?.owner || !request.body?.user?.owner) return apiResponse.validationError(response, "Owner can able to do  disabled modules");
        
        if (request.body.disabledModules.length === 0) {
            return apiResponse.validationError(response, "disabled modules cant be empty");
        }
        
        const disabledModules = request.body.disabledModules || [];
        // const disabledModules = request.body.disabledModules.reduce((acc,mod)=>{
        //     if(mod?.moduleId){
        //         acc[mod.modulesId]=mod.permissions
        //     }

        //     return acc

        // },{})


       
        const dbModules = request.body.assignedModules || [];
        for (let dis of disabledModules) {

            // Ensure module exists in role
            const foundModule = dbModules.find(
              m => m.moduleId.toString() === dis.moduleId.toString()
            );
            const allPermissions = ["c", "r", "u", "d"];
            // Default disable = permissions NOT in foundModule.permissions
            const defaultDisablePermissions = allPermissions.filter(
                p => !foundModule.permissions.includes(p)
            );
            if (!foundModule) {
                return apiResponse.validationError(response, `Module ${dis.moduleId} not assigned to this user's role`);
            }

            dis.permissions = [...new Set([...(dis.permissions || []), ...defaultDisablePermissions])];
        
            // // Ensure permissions are valid
            // if (dis.permissions && dis.permissions.length > 0) {
            //     const invalidPerms = dis.permissions.filter(p => !foundModule.permissions.includes(p));
            //     if (invalidPerms.length > 0) {
            //         return apiResponse.validationError(response, `Invalid permissions for module ${dis.moduleId}: ${invalidPerms.join(",")}`);
            //     }
            // }
        }

        return next();


    }catch(error) {
        request.logger.error("Error while isCheckDisabledModulesValid in user controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const getUserClients= (request, response, next) => {
    try {
        userModel.getUserClients(request.body).then(res => {
            if (!res.status) return apiResponse.notFoundResponse(response, "No clients found for this user")
            request.body.userClients = res.data
            return next()
        }).catch(error => {
            request.logger.error("Error while getUserClients in user controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, "Unable to fetch user clients")
        })
    }
    catch (error) {
        request.logger.error("Error while getUserClients in user controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getAdminUser = async(request, response, next) => {
    try {
        // since org does not exist before added, taking userId as adminId bc only admin create org
        // if(request.originalUrl == '/api/v1/organization/add') {
        //     request.body.adminUserId = request.body.userId
        //     return next()
        // }
        // if(!request.body.authUser?.orgId && (request.originalUrl == '/api/v1/auth/login' || request.originalUrl == '/api/v1/auth/verify')) {
        //     request.body.adminUserId = request.body.authUser?._id
        //     return next()
        // }
        userModel.getAdminUser(request.body).then(res => {
            if(!res.status) throw {}

            request.body.adminUserId = res.data[0]._id
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to get Admin user details")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}