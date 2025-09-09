//packages
// import { getUser, createOrganization } from '../../Models/organization/organization.js'

import { generateToken, verifyToken } from './jwt.js'
import moment from 'moment'
import { ObjectId } from 'bson'
import axios from 'axios'

//models
import * as userModel from '../../models/user/user.js'

//helpers
import { getCurrentDateTime, isTimeDifferenceInMinutes } from '../../helper/formatting.js'
import * as apiResponse from '../../helper/apiResponse.js'
import { generateOTP } from '../../helper/common.js'
import { isValidMobileNumber, isValidEmail, isPasswordValid } from '../../helper/validator.js'


// export const registerChecks = (request, response, next) => {
//     try {
//         let body = request.body

//         // if(body.name==undefined || body.name=="") return apiResponse.notFoundResponse(response, "Please provide organization name")
//         if(body.mobile==undefined || body.mobile=="" || !isValidMobileNumber(body.mobile)) return apiResponse.notFoundResponse(response, "Please Enter a valid mobile number")
//         if(body.password==undefined || body.password=="" || !isPasswordValid(body.password)) return apiResponse.notFoundResponse(response, "Password must contain 1 upper case, 1 lower case, 1 special character, 1 number ")
//         // if(body.location==undefined) return apiResponse.notFoundResponse(response, "Please provide location details")
//         // if(body.mobile==undefined || body.mobile=="") return apiResponse.notFoundResponse(response, "Please provide mobile number")
//         // if(request.body.otp == undefined || request.body.otp == "") return apiResponse.notFoundResponse(response, "Please provide OTP")
//         if(body.email==undefined || body.email=="" || !isValidMobileNumber(body.email)) return apiResponse.notFoundResponse(response, "Please enter valid Email")
//         if(body.password.length < 8) return apiResponse.notFoundResponse(response, "Password length Should be Equal to or more than 8 Characters")
//         if(body.addUser===true){
//             if(body.roles===undefined || body.roles.length===0 || !Array.isArray(body.roles)){
//                 return apiResponse.notFoundResponse(response, "Please select a role")
//             }
//             if(body.branch===undefined || body.branch.length===0 || !Array.isArray(body.branch)){
//                 return apiResponse.notFoundResponse(response, "Please select a branch")
//             }
//             if(body.warehouse===undefined || body.warehouse.length===0 || !Array.isArray(body.warehouse)){
//                 return apiResponse.notFoundResponse(response, "Please select a warehouse")
//             }
//             return next()
//         }

//         return next()
//     } catch (error) {
//         return apiResponse.somethingResponse(response, error)
//     }
// }

export const registerChecks = (request, response, next) => {
    try {
        const body = request.body;
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
        // Validate password
        if (body.password === undefined || body.password === "" || !isPasswordValid(body.password)) {
            return apiResponse.notFoundResponse(response, "Password must contain 1 upper case, 1 lower case, 1 special character, and 1 number");
        }
        if (body.password.length < 8) {
            return apiResponse.notFoundResponse(response, "Password length should be at least 8 characters");
        }
        // Additional checks if `addUser` is true
        if (body.addUser === true) {
            if (body.roles === undefined || body.roles.length === 0 || !Array.isArray(body.roles)) {
                return apiResponse.notFoundResponse(response, "Please select a role");
            }
            if (body.branch === undefined || body.branch.length === 0 || !Array.isArray(body.branch)) {
                return apiResponse.notFoundResponse(response, "Please select a branch");
            }
            if (body.warehouse === undefined || body.warehouse.length === 0 || !Array.isArray(body.warehouse)) {
                return apiResponse.notFoundResponse(response, "Please select a warehouse");
            }
        }
        return next();
    } catch (error) {
        return apiResponse.somethingResponse(response, error.message);
    }
};


export const register = (request, response, next) => {
    try {
        let existingUser = request.body?.existingUser
        if(existingUser && existingUser.isActive && !existingUser.otpVerified) return next()
        userModel.createUser(request.body).then(res => {
            if (!res.status) throw {}
            request.body.userId = res.data.insertedId
            return next()
        }).catch(error => {
            request.logger.error("Error in register",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const login = (request, response, next) => {
    try {
        let body = request.body
        if(body.otp) return next()
        if (request.body.verify == true) {
            return next()
        }
        if(!body.authUser.otpVerified && !body.authUser.createdBy)  return apiResponse.notFoundResponse(response, "User not found. Create your account.")
        if (body.authUser.password != body.password) return apiResponse.validationError(response, `Incorrect Password, Please try again!`)

        return next()
    } catch (error) {
        return apiResponse.somethingResponse(error, error?.message)
    }
}

export const loginResponse = (request,response,next) =>{
    if(request.body.sendLoginResponse){
        return apiResponse.successResponseWithData(response, "Login Successfull", { token: request.body.token, _id: request.body.authUser._id, name: request.body.authUser.name, email: request.body.authUser.email, orgId:request.body.orgDetails?._id,orgName:request.body.orgDetails?.name,addSubOrg:request.body?.orgDetails?.addSubOrg,addBranch:request.body?.orgDetails?.addBranch,pending: request.body.pending, designation: request.body.designation?.name, modules: request.body.assignedModules})
    }
    else return next()
}

export const updateVerfication = (request, response, next) => {
    try {
        userModel.updateVerfication(request.body).then(res => {
            if (!res.status) throw {}
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const isEmailDuplicate = (request, response, next) => {
    try {
        //Existing user email === requested change email
        if (request.body.email === request.body.Email) return next()
        else {
            request.body.query = { email: request.body.Email }
            userModel.getUser(request.body.query).then(res => {
                if (!res.status) throw {}
                return apiResponse.duplicateResponse(response, "Email Id already exist.")
            }).catch(err => {
                return next()
            })
        }
    } catch (error) {
        return apiResponse.somethingResponse(response)
    }
}

export const isMobileDuplicate = (request, response, next) => {
    try {
        // DB user mobile === requested change mobile no
        // if(request.body.mobile === request.body.DBuser.mobile) return next()

        request.body.query = { mobile: request.body.mobile }
        userModel.getUserbyMobile(request.body.query).then(res => {
            if (!res.status) return next()
            return apiResponse.duplicateResponse(response, "Mobile number already exist.")
        }).catch(err => {
            return apiResponse.somethingResponse(response)
        })

    } catch (error) {
        return apiResponse.somethingResponse(response)
    }
}

// another middleware of mobile check for registration to handle verified and unverified users
export const isMobileExist = (request, response, next) => {
    try {

        request.body.query = { mobile: request.body.mobile }
        userModel.getUserbyMobile(request.body.query).then(res => {

            if (res.status) {
                // if(!res.data.isActive) return apiResponse.validationError(response, "Inactive User")
                // if(res.data.isActive && res.data.otpVerified) return apiResponse.validationError(response, "Mobile Number Already Exist")
                // request.body.existingUser = res.data;

                // request.logger.debug(JSON.stringify(request.body.existingUser));
                // return next()
                return apiResponse.validationError(response, "Mobile Number Already Exist")
            }
            else {
                request.body.notExist = true
                return next()
            }
        }).catch(err => {
            request.logger.error("Error in isMobileExist" ,{ stack: error.stack });
            return apiResponse.somethingResponse(response)
        })

    } catch (error) {
        return apiResponse.somethingResponse(response)
    }
}

export const isEmailExist = (request, response, next) => {
    try
    {
        if(request.body.email)
        {
            if(request.body?.existingUser && request.body.email === request.body?.existingUser?.email) return next()
           
            userModel.getUserByEmail(request.body).then(res => {
                if (res.status) 
                {
                    if(!res.data.isActive) return apiResponse.validationError(response, "Inactive User")
                        
                    return apiResponse.validationError(response, "Email Id Already Exist")
                }
                else {
                    // request.body.notExist = true
                    return next()
                }
            }).catch(err => {
                request.logger.error("Error in isEmailExist" ,{ stack: err.stack });
                return apiResponse.somethingResponse(response)
            })

        }
        else
        {
            return next()
        }
        
    }
    catch (error) {
        return apiResponse.somethingResponse(response)
    }
}

export const storeLoginHistory = (request, response, next) => {
    request.body.query = { ...request.body.query, status: request.body.status, CreatedDate: getCurrentDateTime() }
    LoginHistoryModel.storeLoginHistory(request.body.query).then(res => {
        // console.log("Successfully login history stored");   
        // return next()     
    }).catch(err => {
        return apiResponse.somethingResponse(response)
    })
}

export const isAuth = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return apiResponse.unauthorizedResponse(response, "Unauthorized")
    }
    request.body.token = token
    verifyToken(token, process.env.AUTHTOKEN_SECRETKEY).then(res=>{    
        if(!res.exp) throw {}
        request.body.userId = res.userId;
        // request.body.roleID = res.roleId;
        
        return next();
    }).catch(err => {
        // return next();
        return apiResponse.unauthorizedResponse(response, "Unauthorized")
    })
}



export const sendOTP = async (request, response, next) => {
    try {

        const otp = generateOTP();
        request.body.otp = otp
        request.body.expireSession = true
        request.body.expireSessionTime = 5 //in minutes

        //MASTERPORTAL SEND OTP API
        // const apiUrl = `${process.env.MASTERPORTAL_BASE_URL}/sms/send/otp`;

        // const data = {
        //     "SoftwareID" : 9,
        //     "SenderId" : "MWBTEC", 
        //     "UserId" : request.body?.user?._id || request.body.userID, //from isUserValid middleware or createUser 
        //     "Receiver" : request.body.mobile,
        //     "Message" : `Your OTP is ${otp} for stock App login.- MWB Tech India Pvt Ltd`,
        //     "templateKey":"stock_otp" //will change later
        // };

        // await axios.post(apiUrl, data)
        //   .then(res => {
        //         //OTP has been sent to given number
        //         //update otp in given user
        //         request.body.otp = otp
        //         return next()

        //         // if(request.body.notRegister){
        //         //     userModel.createUser(request.body).then(res => {

        //         //     })
        //         // }

        //         // userModel.updateOTP(request.body).then(res=>{
        //         //     if(!res.status) throw {}
        //         //     return next()
        //         // }).catch(error=>{
        //         //     return apiResponse.somethingResponse(response,error.message)
        //         // })

        //   })
        //   .catch(error => {
        //     return apiResponse.ErrorResponse(response, "Failed to send otp")
        //   });
        request.logger.debug(request.body.otp)
        return next()

    } catch (error) {
        request.logger.error("Error while sendOTP",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const addSession = async (request, response, next) => {
    try {
        if(request.body.otp !== undefined) {
            request.session[request.body.mobile] = {
                otp: request.body.otp,
                sentDate: getCurrentDateTime()
            }
            console.log(request.session);
            if(request.body.expireSession && request.body.expireSessionTime > 0) {
                setTimeout(() => {
                    console.log(request.session[request.body.mobile]);
                    let diff = (getCurrentDateTime() - request.session[request.body.mobile].sentDate)/1000
                    if(diff >= request.body.expireSessionTime){
                        console.log('deleting session data of', request.body.mobile);
                        delete request.session[request.body.mobile]
                    }
                }, request.body.expireSessionTime * 1000 * 60);
            }
            return next()
        }
        else throw {}
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const generateAuthToken = async (request, response, next) => {
    try {
        const minutes = 100000
        const expirationTime = Math.floor(Date.now() / 1000) + minutes * 60;
        const payload = {userId : request.body.authUser._id, roleId : request.body.authUser.roleId,name:request.body.authUser.name}
        const token = generateToken(payload, process.env.AUTHTOKEN_SECRETKEY, expirationTime)

        request.body.token = token
        return next()

    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const verifyOTP = async (request, response, next) => {
    try {
        if(!request.body.password && !request.body.otp) return apiResponse.notFoundResponse(response, "Please provide OTP or Password");
        if(request.body.password) return next();//FIXME:
        let userDetails = request.body.authUser //from isUserValid middleware
        if(userDetails &&  !userDetails?.otp) return apiResponse.unauthorizedResponse(response, "Invalid credentials!")
        if (request.body.otp == undefined || request.body.otp == "") return apiResponse.notFoundResponse(response, "Please provide OTP")
        let otp = userDetails.otp.otp
        const expiryDate = userDetails.otp.sentDate
        const enteredOTP = request.body.otp
        //check entered otp and sent otp equal or not
        if (otp != enteredOTP) {
            return apiResponse.validationError(response, "Invalid OTP. Please try again.")
        }
        //check otp expiration
        const isDiffTimeCorrect = isTimeDifferenceInMinutes(new Date(expiryDate), new Date(), 1) //1 min expiry time
        
        if(!isDiffTimeCorrect) return apiResponse.validationError(response, "OTP has expired. Please request a new OTP.")
        // console.log(new Date());

        //check otp expiration
        // const isDiffTimeCorrect = isTimeDifferenceInMinutes(new Date(session.sentDate), new Date(), 10) //10 min expiry time

        // if(!isDiffTimeCorrect) return apiResponse.validationError(response, "OTP has expired. Please request a new OTP.")

        //update the sentDate to current Date after one successful verification
        request.body.expiry = true
        return next()

    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const verifyPassword = async (request, response, next) => {
    try {

        let userDetails = request.body.authUser //from isUserValid middleware

        //ENCRYPT AND DECRYPT will add it later

        //check stored password and entered password
        if (userDetails.password != request.body.password) return apiResponse.unauthorizedResponse(response, "Invalid credentials. Please try again")
        return next()

    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const resetPwdChecks = (request, response, next) => {
    try {
        let body = request.body

        if(body.password==undefined || body.password=="") return apiResponse.notFoundResponse(response, "Please provide password")
      
        if(!isPasswordValid(body.password)) return apiResponse.notFoundResponse(response, "Password must contain 1 upper case, 1 lower case, 1 special character, 1 number ")
        if(body.password.length < 8) return apiResponse.notFoundResponse(response, "Password length Should be Equal to or more than 8 Characters")
       
        return next()
    } catch (error) {
        return apiResponse.somethingResponse(response, error)
    }
}

export const isVerifyUserId = (request, response, next) => {
    try {
        const userId = request.body.userId;

        if (!userId) {
            return apiResponse.notFoundResponse(response, "Invalid userId");
        }

        request.body.userId = userId;
        return next();
    } catch (err) {
        request.logger.error("Error while assignmentValidation in departmnet controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)  
    }
};

