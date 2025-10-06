import * as leadModel from '../../models/leads/lead.js'
import * as apiResponse from '../../helper/apiResponse.js'
import { logger } from '../../helper/logger.js'
import { isValidMobileNumber } from '../../helper/validator.js';
import { KYC_Entities } from '../../helper/constants.js';
import { request } from 'express';


export const isLeadExist = async (request, response, next) => {
    try {

        leadModel.isLeadExist(request.body).then(res => {
            // if (!res.status) return apiResponse.ErrorResponse(response, "unable to add lead!")
            if (res.data && res.data.length) return apiResponse.validationError(response, "Lead already exist with same email or mobile number!")
            return next()
        }).catch(error => {
            logger.error("Error addLead in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error addLead in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}
export const addLead = async (request, response, next) => {
    try {

        leadModel.add(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to add lead!")
            // request.body.LeadData = res.data
            return next()
        }).catch(error => {
            logger.error("Error addLead in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error addLead in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const getlist = async (request, response, next) => {
    try {

        leadModel.getList(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to get list of leads!")
            request.body.LeadData = res
            return next()
        }).catch(error => {
            logger.error("Error getlist in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error getlist in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const getDetails = async (request, response, next) => {
    try {

        leadModel.getDetails(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to get Details of lead!")
            request.body.LeadDetails = res.data
            return next()
        }).catch(error => {
            logger.error("Error getDetails in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error getDetails in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const isLeadValid = async (request, response, next) => {
    try {
        if(!request.params || request.params?.type != 'create' ) return next()
        leadModel.getDetails(request.body).then(res => {
            if (!res.status) return apiResponse.notFoundResponse(response, "Invalid lead!")
            request.body.LeadDetails = res.data
            return next()
        }).catch(error => {
            logger.error("Error getDetails in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error getDetails in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const update = async (request, response, next) => {
    try {

        leadModel.update(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to update lead!")
            // request.body.LeadData = res.data
            return next()
        }).catch(error => {
            logger.error("Error update in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error update in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const updateStatus = async (request, response, next) => {
    try {
        if(request.params.type != 'create') return next()
        leadModel.updateStatus(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to update lead status!")
            // request.body.LeadData = res.data
            return next()
        }).catch(error => {
            logger.error("Error update status in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error update status in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const addLeadKyc = async (request, response, next) => {
    try {

        leadModel.addLeadKyc(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to update lead!")
            // request.body.LeadData = res.data
            return next()
        }).catch(error => {
            logger.error("Error update in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error update in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const updateLeadKycStatus = async (request, response, next) => {
    try {

        leadModel.updateLeadKycStatus(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to update lead KYC status!")
            // request.body.LeadData = res.data
            return next()
        }).catch(error => {
            logger.error("Error update in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error update in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const getKYCEntities = async (request, response, next) => {
    try {
        request.body.KYC_Entities = KYC_Entities
        return apiResponse.successResponseWithData(response, "All KYC Entities Found Successfully", request.body.KYC_Entities)
    } catch (error) {
        logger.error("Error update in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const isKYCVerified = async (request, response, next) => {
    try {
        if(request.body.LeadDetails.isKYC) return apiResponse.validationError(response, "Your KYC is already Verified!")
        
        return next()
    } catch (error) {
        logger.error("Error update in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const isKycDataValid = async (request, response, next) => {
    try {
        leadModel.isKycDataValid(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "Invalid KYC Details!")
            // request.body.LeadData = res.data
            return next()
        }).catch(error => {
            logger.error("Error get KYC Details in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error get KYC Details in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const updateKycDetails = async (request, response, next) => {
    try {
        leadModel.updateKycDetails(request.body).then(res => {
            if (!res.status) throw{}
            // request.body.LeadData = res.data
            return next()
        }).catch(error => {
            logger.error("Error update KYC details in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error update KYC details in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const getlistByCreateBy = async (request, response, next) => {
    try {

        leadModel.getLeadsCreatedBy(request.body).then(res => {
            if (!res.status) return apiResponse.ErrorResponse(response, "unable to get list of leads!")
            request.body.LeadData = res.data
            return next()
        }).catch(error => {
            logger.error("Error getlist in lead controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        })
    } catch (error) {
        logger.error("Error getlist in lead controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const updateLeadStatus = async (request, response, next) => {
  try {
    const result = await leadModel.updateLeadStatus(request.body);

    // Example: if using MongoDB's updateOne result
    if (!result || !result.status) {
      return apiResponse.ErrorResponse(response, "Unable to update lead status");
    }

    return next()
  } catch (error) {
    logger.error("Error while updating lead status in lead controller", { stack: error.stack });
    return apiResponse.ErrorResponse(response, error?.message || "Something went wrong");
  }
};
