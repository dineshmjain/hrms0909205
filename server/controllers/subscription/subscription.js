//packages
import { ObjectId } from 'mongodb';
import axios from 'axios';
//models
import * as subscriptionModel from '../../models/subscription/subscription.js';

//helpers
import * as apiResponse from '../../helper/apiResponse.js'
import { getCurrentDateTime, getDiffDateTime, getDaysBetweenDates} from '../../helper/formatting.js';
import { SoftwareID, onlyViewDaysAfterExpiry, planExpiryMessage } from '../../helper/constants.js';
import moment from 'moment';

export const getFeatureUsage = async (request, response, next) => {
    try {
        const url = `${process.env.MASTERPORTAL_BASE_URL}/subscription/feature/count`
        let body = {
            SoftwareID: SoftwareID,
            UserId: request.body.adminUserId.toString(),
            feature: request.body.featureKey
        }
        if(request.originalUrl == '/api/v1/warehouse/configure') {
            body['multiple'] = true
        }
        await axios.post(url, body).then(res => {
            if (res.status == 200) {
                if(res.data.data?.plans && Array.isArray(res.data.data?.plans) && res.data.data?.plans.length > 0) {
                    request.body.multipleCounts = res.data.data.plans
                }
                request.body.featureDetails = res.data.data
                return next()
            } 
            else throw {}
        }).catch(error => {
            return apiResponse.notFoundResponse(response, error.response.data.message)
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getCurrentPlan = async (request, response, next) => {
    try {
        const url = `${process.env.MASTERPORTAL_BASE_URL}/subscription/getCurrentPlan`
        const body = {
            SoftwareID: SoftwareID,
            UserId: request.body.adminUserId.toString()
        }
        await axios.post(url, body).then(res => {
            if (res.status == 200) {
                res.data.data = res.data.data.find(cp => cp.IsPlan == true)
                if(!res.data.data) {
                   return !request.body.subscriptionStatus ? next() : apiResponse.validationError(response, planExpiryMessage)
                }
                    
                request.body.currentPlanId = res.data.data.SubscriptionId
                return next()
            } 
            else throw {}
        }).catch(error => {
            return apiResponse.notFoundResponse(response, error.response.data.message)
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getActiveFeatures = async (request, response, next) => {
    try {
        const url = `${process.env.MASTERPORTAL_BASE_URL}/subscription/features/get/active`
        const body = {
            SoftwareID: SoftwareID,
            UserId: request.body.adminUserId.toString()
        }
        await axios.post(url, body).then(res => {
            if (res.status == 200) {
                request.body.activeFeatures = res.data.data
                return next()
            } 
            else throw {}
        }).catch(error => {
            return apiResponse.notFoundResponse(response, error.response.data.message)
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const addDefaultPlan = async (request, response, next) => {
    try {
        if(request.body.authUser?.otpVerified || request.body.authUser?.otpVerified == undefined) return next()
        const url = `${process.env.MASTERPORTAL_BASE_URL}/subscription/add/free`
        const body = {
            SoftwareID: SoftwareID,
            Version: "1",
            UserId: request.body.authUser._id.toString()
        }
        await axios.post(url, body).then(res => {
            if (res.status == 200) {
                return next()
            }
        }).catch(error => {
            return apiResponse.notFoundResponse(response, error.response.data.message)
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const addFeatureUsage = async (request, response, next) => {
    try {
        // if(request.body.featureDetails?.unlimited) return next()
        subscriptionModel.addFeatureUsage(request.body).then(res => {
            if (!res.status) throw {}

            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to add feature usage")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const checkSubscription = async(request, response, next) => {
    try { 
        const expiryDate = moment(request.body.expiryDate).format('YYYY-MM-DD')

        const selectedDate = moment(request.body?.startDate && request.body?.endDate ? request.body.startDate : request.body?.date || new Date()).format('YYYY-MM-DD')
        // console.log(moment(new Date()).format('YYYY-MM-DD'))
        if(moment(new Date()).format('YYYY-MM-DD') < expiryDate) return next()

        let getDiffDays = getDaysBetweenDates(expiryDate, moment(new Date()).format('YYYY-MM-DD'))

        if(getDiffDays >= onlyViewDaysAfterExpiry || !request.body.user?.modules['fullaccess'] && !request.body.user?.modules['fullaccess']?.includes('r')) return apiResponse.validationError(response, planExpiryMessage)

        return next()
    }
    catch(error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const checkSubscriptionForOperations = async(request, response, next) => {
    try {
        const expiryDate = moment(request.body.expiryDate).format('YYYY-MM-DD')
        console.log(moment(new Date()).format('YYYY-MM-DD'))
        if(moment(new Date()).format('YYYY-MM-DD') > expiryDate) return apiResponse.validationError(response, planExpiryMessage)

        return next()
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const addMultiple = async(request, response, next) => {
    try {
        let url = `${process.env.MASTERPORTAL_BASE_URL}/subscription/add/multiple`

        let body = {
            SoftwareID : SoftwareID,
            UserId : request.body.userId,
            Invoices : {
                order_amount: request.body.orderData[0].order_amount,
                order_id: request.body.orderData[0].order_id,
                payment_amount: request.body.orderData[0].payment_amount,
                payment_completion_time: request.body.orderData[0].payment_completion_time,
                payment_currency: request.body.orderData[0].payment_currency,
                payment_status: request.body.orderData[0].payment_status,
                payment_time: request.body.orderData[0].payment_time
            },
            plans : request.body.plans
        }
        console.log(body)
        await axios.post(url, body).then(res => {
            if (res.status == 200) {
                request.body.mpResponse = res.data.data
                return next()
            } 
            else throw {}
        }).catch(error => {
            return apiResponse.notFoundResponse(response, error.response.data.message)
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}