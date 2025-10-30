import * as quotationModel from '../../models/quotation/quotation.js';
import * as apiResponse from '../../helper/apiResponse.js';
import { logger } from '../../helper/logger.js';
import { request } from 'express';

// Helper functions
const logAndRespond = (error, response, operation) => {
  logger.error(`Error in ${operation}: ${error.message}`, {
    stack: error.stack,
    operation
  });
  return apiResponse.somethingResponse(response, error.message);
};

const validateRequestBody = (body, requiredFields = []) => {
  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error(`${field} is required`);
    }
  }
};

export const generateQuotation = async (request, response, next) => {
  try {
    const { body } = request;

    // Create the quotation
    const result = await quotationModel.createQuotation(body);

    if (result?.status && result?.data?.insertedId) {
      // Attach quotationId to request for downstream middleware
      request.body.quotationId = result.data.insertedId;

      // Proceed to next middleware (e.g., create negotiation)
      return next();
    } else {
      // Handle failure
      return apiResponse.somethingResponse(response, result?.message || 'Failed to create quotation');
    }
  } catch (error) {
    return logAndRespond(error, response, 'generateQuotation');
  }
};

export const trackQuotation = async (request, response, next) => {
  try {
    const result = await quotationModel.trackQuotation(request?.body);

    if (result?.status) {
      return apiResponse.successResponseWithData(response, "Data found Successfully", result?.data)

    } else {
      // Handle failure
      return apiResponse.somethingResponse(response, result?.message || 'Failed to list quotation');
    }
  }
  catch (error) {
    return logAndRespond(error, response, 'track Quotation');
  }
}

export const closeQuotation = async (request, response, next) => {
  try {
    const result = await quotationModel.closeQuotation(request?.body);

    if (result?.status) {
      return apiResponse.successResponseWithData(response, "Data found Successfully", result?.data)

    } else {
      // Handle failure
      return apiResponse.somethingResponse(response, result?.message || 'Failed to list quotation');
    }
  }
  catch (error) {
    return logAndRespond(error, response, 'track Quotation');
  }
}



export const getDetailsForQuoatation = async (request, response, next) => {
  try {
    const result = await quotationModel.closeQuotation(request?.body);

    if (result?.status) {
      return apiResponse.successResponseWithData(response, "Data found Successfully", result?.data)

    } else {
      // Handle failure
      return apiResponse.somethingResponse(response, result?.message || 'Failed to list quotation');
    }
  }
  catch (error) {
    return logAndRespond(error, response, 'track Quotation');
  }
}

