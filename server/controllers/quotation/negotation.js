import * as negotationModel from '../../models/quotation/negotation.js';
import * as apiResponse from '../../helper/apiResponse.js';
import { logger } from '../../helper/logger.js';

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

export const createNegotiation = async (request, response,next) => {
  try {
    const { body } = request;
    const result = await negotationModel.createNegotiation(body);
    if (result?.status) {
    
      // request?.body.quotationId = result.data[0].insertedId

        next()
      // return apiResponse.successResponseWithData(response, "Quotation generated successfully", result?.data);
    }
    else {
      return apiResponse.somethingResponse(response, result?.message);
    }
  } catch (error) {
    return logAndRespond(error, response, 'generateQuotation');
  }
}
export const getNegotiationStatus = async (request, response,next) => {
  try {
    const { body } = request;
    const result = await negotationModel.getNegotationCount(body);

    if (result?.status) {
      // Attach status to body if you still need it later
      request.body.quotationStatus = result?.data?.[0]?.status || null;
      return next()
    } else {
      return apiResponse.somethingResponse(response, result?.message);
    }
  } catch (error) {
    return logAndRespond(error, response, 'getNegotiationStatus');
  }
};
export const updateNegotation = async (request, response,next) => {
  try {
    const { body } = request;
    const result = await negotationModel.updateNegotation(body);

    if (result?.status) {
      return next()
    } else {
      return apiResponse.somethingResponse(response, result?.message);
    }
  } catch (error) {
    return logAndRespond(error, response, 'getNegotiationStatus');
  }
};

