import * as meetingModel from '../../models/leads/meeting.js'
import * as apiResponse from '../../helper/apiResponse.js'
import { logger } from '../../helper/logger.js'

export const addLeadMeeting = async (request, response, next) => {
    try {

        meetingModel.createMeeting(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to add lead meeting!")
            // request.body.LeadData = res.data
            return next()
        }).catch(error => {
            logger.error("Error addLead meeting in meeting controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error addLead meeting in meeting controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}
export const isMeetingIdValid = async (request, response, next) => {
    try {
        if (request.params?.type != 'update') return next()
        meetingModel.get(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "Invalid Meeting!")
            request.body.meetingDetails = res.data
            return next()
        }).catch(error => {
            logger.error("Error addLead meeting in meeting controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error addLead meeting in meeting controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const getMeetingDetails = async (request, response, next) => {
    try {
        meetingModel.get(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "Invalid Meeting!")
            request.body.meetingDetails = res.data
            return next()
        }).catch(error => {
            logger.error("Error addLead meeting in meeting controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error addLead meeting in meeting controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}
export const getList = async (request, response, next) => {
    try {

        meetingModel.getList(request.body).then(res => {
            if (!res.status) throw {}
            request.body.LeadData = res.data
            return next()
        }).catch(error => {
            logger.error("Error addLead meeting in meeting controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error addLead meeting in meeting controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}