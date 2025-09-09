import * as apiResponse from '../../helper/apiResponse.js';
import * as emergency from '../../models/emergency/emergency.js';
import * as helper from '../../helper/formatting.js';

export const addContacts = (request, response, next) => {
    try {
        emergency.addEmergencyContacts(request.body).then(res => {
            if(res.status){
                return next()
            }
            return apiResponse.validationError(response, res.message)
        }).catch(error => {
            request.logger.error("Error while addEmergency in emergency controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
        
    } catch (error) {
        request.logger.error("Error while addEmergency in emergency controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const emergencyContactsList=(request,response,next)=>{
    try {
        emergency.emergencyContactsList(request.body).then(res=>{
            if(res.status && res.data.length>=1){
                const formatEmergencyContacts = helper.formatEmergencyContacts(res.data)
                request.body.emergencyContacts = formatEmergencyContacts
                return next()
            }
            return apiResponse.notFoundResponse(response, res.message)
        }).catch(error=>{
            request.logger.error("Error while emergencyContactsList in emergency controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while emergencyContactsList in emergency controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const isEmergencyContactId=(request,response,next)=>{
    try {
        emergency.isEmergencyContactId(request.body).then(res=>{
            if(res.status){
                request.body.existingContactDetails=res.data
                request.body.contacts=helper.mergeExistingAndNewContact(request.body.existingContactDetails.contacts,request.body.contacts)
                return next()
            }
            return apiResponse.notFoundResponse(response, res.message)
        }).catch(error=>{
            request.logger.error("Error while isEmergencyContactId in emergency controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while isEmergencyContactId in emergency controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const updateContacts=(request,response,next)=>{
    try {
        emergency.updateEmergencyContacts(request.body).then(res=>{
            if(res.status){
                return next()
            }
            return apiResponse.validationError(response, res.message)
        }).catch(error=>{
            request.logger.error("Error while updateContacts in emergency controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while updateContacts in emergency controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const getEmergencyContactsListCount=(request,response,next)=>{
    try {
        emergency.emergencyContactsList(request.body).then(res=>{
            if(res.status && res.data.length>=1){
                request.body.maxSerialNo=helper.getMaximumSerialContact(res.data)
                return next()
            }
            request.body.maxSerialNo=null
            return next()
           
        }).catch(error=>{
            request.logger.error("Error while getEmergencyContactsListCount in emergency controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error while getEmergencyContactsListCount in emergency controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}