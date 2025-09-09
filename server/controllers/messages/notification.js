import admin from "../../config/firebase.js";
import * as apiResponse from '../../helper/apiResponse.js'
import { getCurrentDateTime } from "../../helper/formatting.js";
import * as notificationModel from "../../models/message/notification.js";
import * as userModel from "../../models/user/user.js";

export const sendNotification = async (request, response, next) => {
    try {
        if (!request.body?.notifyUsers || request.body.notifyUsers.length == 0) return next()
        let sendNotifyUsers = [];
        //Bulk notification using multiple tokens 
        await Promise.all(request.body.notifyUsers.map(async user => {

            let tokenStatus = []
            let notificationStatus = "failed"
            await Promise.all(user.deviceTokens.map(async token => {
                try {
                    const res = await admin.messaging().send({
                        notification: {
                            title: user.title,
                            body: user.description,
                            // imageUrl: "http://192.168.1.36:8090/"+request.body.promotions.image
                            imageUrl: user.image
                        },

                        token: token,
                    });
                    notificationStatus = "success"
                    tokenStatus.push({ token, status: "success" });
                } catch (error) {
                    //failed to send notification
                    tokenStatus.push({ token, status: "failed" });
                    console.error("Notification failed to send to token", token, error);
                }
            }));
            let saveNotifyObj = {
                userId: user.userId, title: user.title,
                description: user.description, token: tokenStatus, status: notificationStatus, createdDate: getCurrentDateTime()
            }
            user.image ? saveNotifyObj["image"] = user.image : undefined
            sendNotifyUsers.push(saveNotifyObj)

        }
        ));

        request.body.sendNotifyUsers = sendNotifyUsers
        await notificationModel.save(request.body)

        // // Send notification with single device token
        // const res = await admin.messaging().send({
        // notification: {
        //     title,
        //     body,
        //     // imageUrl
        // },
        // token: deviceToken,
        // });

        return next() //sent successfully
    } catch (error) {
        console.error(error);
        return next() //no need to send error response if notification failed (DOUBT)
        // return apiResponse.ErrorResponse(response, error.message);
    }
}

export const updateDeviceToken = async (request, response, next) => {
    try {
        if (!request.body?.deviceToken) return next()

        //check device token exist or not
        //if not --> no need to store it again with new objectId (deviceId)
        if (request.body.authUser?.device) {

            const deviceId = Object.keys(request.body.authUser?.device).find(
                key => request.body.authUser?.device[key].deviceToken === request.body.deviceToken
            );

            if (deviceId && request.body.authUser?.device[deviceId]?.isActive == true) {
                request.body.deviceId = deviceId;
                return next();
            }
            else if (deviceId && request.body.authUser?.device[deviceId] == false && ['/api/v1/auth/login'].includes(request.originalUrl)) {
                request.body.currDevice = {
                    deviceId: deviceId
                }
                let updateStatus = await userModel.logout(request.body)

                if (!updateStatus.status) throw {}
            }
        }

        notificationModel.updateDeviceToken(request.body).then(res => {
            if (!res.status) throw {}

            return next()
        }).catch(error => {
            console.log(error);
            return next() //no need to stop main api logic
        })
    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(response, error.Message)
    }
}

export const list = async (request, response, next) => {
    try {
        notificationModel.list(request.body).then(res => {
            if (!res.status) throw {}
            return apiResponse.successResponseWithData(response, "Notification list found successfully", res.data)
        }).catch(error => {
            console.log(error);
            return apiResponse.somethingResponse(response, "Failed to get notification list")
        })
    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(response, error.Message)
    }
}

export const getExecutiveDeviceTokens = async (request, response, next) => {
    try {
        notificationModel.getExecutiveDeviceTokens(request.body).then(res => {
            if (!res.status) throw {}
            request.body.notifyUsers = res.data.map(u => ({ userId: u.userId, title: "Testing notification EasyStocks", description: "Test description", deviceToken: u.token, image: "" }))
            return next()
        }).catch(error => {
            console.log(error);
            return apiResponse.somethingResponse(response, "Failed to get device token")
        })
    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(response, error.Message)
    }
}

export const save = async (request, response, next) => {
    try {
        notificationModel.save(request.body).then(res => {
            if (!res.status) throw {}
            return next()
        }).catch(error => {
            console.log(error);
            return apiResponse.somethingResponse(response, "Failed to save notification")
        })
    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(response, error.Message)
    }
}


export const getUnreadNotificationCount = async (request, response, next) => {
    try {
        notificationModel.getUnreadNotification(request.body).then(res => {
            if (!res.status) throw {}
            return apiResponse.successResponseWithData(response, "Unread notification count found successfully", { unreadCount: res.data.length })
        }).catch(error => {
            console.log(error);
            return apiResponse.somethingResponse(response, "Failed to get unread notification count")
        })
    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(response, error.Message)
    }
}

