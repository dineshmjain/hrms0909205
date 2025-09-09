import * as apiResponse from '../../helper/apiResponse.js';
import * as settings from '../../models/settings/settings.js';
import * as helper from '../../helper/formatting.js';
import { request } from 'express';


export const addClientReportTimeSettings = (request, response, next) => {
    try {
        // if(request.body.existingClientReport)return apiResponse.validationError(response, "Client report time settings already exist. Please use update the settings.")
        settings.addClientReportTimeSettings(request.body).then(res => {
            if(res.status){
                return next()
            }
            return apiResponse.validationError(response, res.message)
        }).catch(error => {
            request.logger.error("Error while addClientReportTimeSettings in settings controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
        
    } catch (error) {
        request.logger.error("Error while addClientReportTimeSettings in settings controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const getClientReportTimeSettings=(request,response,next)=>{
    try {
        settings.getClientReportTimeSettings(request.body).then(res=>{
            if(res.status){
                request.body.clientReportTimeSettings = res.data
                return next()
            }
            return apiResponse.notFoundResponse(response, res.message)
        }).catch(error=>{
            request.logger.error("Error while getClientReportTimeSettings in settings controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while getClientReportTimeSettings in settings controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const isClientReportTimeSettingsExist=(request,response,next)=>{
    try {
        settings.getClientReportTimeSettings(request.body).then(res=>{
            if(res.status){
                // request.body.reoprtTimeIn=res.data.reoprtTimeIn,
                // request.body.reportTimeOut=res.data.reportTimeOut

                // request.body.isReportTime=res.data.isReportTime
                request.body.clientReportTimeSettings = res.data
                return next()
            }
            return next()
        }).catch(error=>{
            request.logger.error("Error while isClientReportTimeSettingsExist in settings controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while isClientReportTimeSettingsExist in settings controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const updateClientReportTimeSettings=(request,response,next)=>{
    try {
        if(request.body.clientReportTimeSettings==null)return next()
        settings.updateClientReportTimeSettings(request.body).then(res=>{
            if(res.status){
                // return next()
                return apiResponse.successResponse(response, 'Client report time settings updated successfully!')
            }
            return apiResponse.validationError(response, res.message)
        }).catch(error=>{
            request.logger.error("Error while updateClientReportTimeSettings in settings controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while updateClientReportTimeSettings in settings controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getReportForShiftList = (request, response, next) => {
    try {
        if(request.body.orgId===undefined || request.body.orgId==null || request.body.orgId=="") return next()
        request.body.clientmappedId=request.body.orgId
        settings.getClientReportTimeSettings(request.body).then(res=>{
            if(res.status){
                request.body.existingClientReport=res.data
                request.body.reportTimeIn=res.data.reportTimeIn
                request.body.reportTimeOut=res.data.reportTimeOut
                return next()
            }
            return next()
        }).catch(error=>{
            request.logger.error("Error while getReportForShiftList in settings controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while getReportForShiftList in settings controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}