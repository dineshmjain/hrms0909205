import { ObjectId } from "mongodb"
import { getCurrentDateTime } from "../../helper/formatting.js"
import { create, createMany, getMany, getOne, sort, updateOne, updateOneWithupsert } from "../../helper/mongo.js"

export const updateDeviceToken = async (body) => {
    try {
        body.deviceId = new ObjectId()
        let query = {
            _id: body?.user?._id || body.authUser._id,
        }

        let update = {
            $set: {
                [`device.${body.deviceId}`]: { deviceToken: body.deviceToken, createdAt: getCurrentDateTime(), isActive: true },
            },
        };
        return await updateOne(query, update, "user")
    } catch (error) {
        return { status: false, message: "failed to update user device token" }
    }
}

export const getExecutiveDeviceTokens = async (body) => {
    try {
        let query = {
            _id: { $in: body.executiveUsers.map(eu => eu.userId) }
        }
        return await getMany(query, "user")
    } catch (error) {
        return { status: false, message: "failed to get executive user device token" }
    }
}


export const save = async (body) => {
    try {
        let query = body.sendNotifyUsers

        return await createMany(query, "notificationHistory")
    } catch (error) {
        return { status: false, message: "failed to save notification history" }
    }
}

export const list = async (body) => {
    try {
        let query = { userId: body.user._id, status: "success" }

        return await sort(query, "notificationHistory", { createdDate: -1 }, { _id: 0, title: 1, description: 1, image: 1, createdDate: 1 })
        // return await getMany(query, "notificationHistory", {_id : 0, title : 1, description : 1, image : 1, createdDate : 1}) 
    } catch (error) {
        return { status: false, message: "failed to get notification history" }
    }
}

export const getUnreadNotification = async (body) => {
    try {
        let query = { userId: body.user._id, status: "success" }
        body.user.notificationReadAt ? query["createdDate"] = { $gt: body.user.notificationReadAt } : undefined
        return await getMany(query, "notificationHistory", { _id: 1 })
    } catch (error) {
        return { status: false, message: "failed to get unread notification count" }
    }
}

