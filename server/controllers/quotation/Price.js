import * as quotePriceModel from '../../models/quotation/Price.js';
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

const hasBranchSpecificParams = (body) => {
  return !!(body?.subOrgId || body?.branchId || body?.departmentId);
};

// Middleware functions
export const isQuotePriceExists = async (request, response, next) => {
  try {
    validateRequestBody(request.body, ['designationId']);
    
    const existsResult = await quotePriceModel.QuotePriceExists(request.body);
    
    if (!existsResult?.status) {
      return logAndRespond(new Error(existsResult?.error || 'Failed to check quotation price existence'), response, 'isQuotePriceExists');
    }

    if (existsResult.data && existsResult.data.length > 0) {
      return apiResponse.duplicateResponse(
        response, 
        "Quotation price for this designation already exists", 
        existsResult.data
      );
    }

    return next();
  } catch (error) {
    return logAndRespond(error, response, 'isQuotePriceExists');
  }
};

export const isQuotePriceById = async (request, response, next) => {
  try {
    validateRequestBody(request.body, ['designationId']);
    
    const existsResult = await quotePriceModel.QuotePriceExists(request.body);
    
    if (!existsResult?.status) {
      return logAndRespond(new Error(existsResult?.error || 'Failed to fetch quotation price'), response, 'isQuotePriceById');
    }

    if (!existsResult.data || existsResult.data.length === 0) {
      return apiResponse.notFoundResponse(response, "Quotation price not found");
    }

    // Attach data to request for next middleware
    request.body.quotePriceData = existsResult.data;
    return next();
  } catch (error) {
    return logAndRespond(error, response, 'isQuotePriceById');
  }
};

export const isQuotePriceByDesignationId = async (request, response, next) => {
  try {
    validateRequestBody(request.body, ['designationId']);
    
    // Only check for branch-specific params
    if (!hasBranchSpecificParams(request.body)) {
      return next();
    }

    const existsResult = await quotePriceModel.isQuotePriceByDesignationId(request.body);
    
    if (!existsResult?.status) {
      return logAndRespond(new Error(existsResult?.error || 'Failed to fetch quotation price by designation'), response, 'isQuotePriceByDesignationId');
    }

    // Set default values
    request.body.baseQuotePriceId = null;
    request.body.priceId = null;

    if (existsResult.data && existsResult.data.length > 0) {
      const firstResult = existsResult.data[0];
      request.body.baseQuotePriceId = firstResult?.baseQuotePriceId || null;
      request.body.priceId = firstResult?.priceId || null;
    }

    return next();
  } catch (error) {
    return logAndRespond(error, response, 'isQuotePriceByDesignationId');
  }
};

// Controller functions
export const createStandardQuotePrice = async (request, response, next) => {
  try {
    validateRequestBody(request.body, ['designationId']);
    
    // If branch-specific params exist, pass to next middleware
    if (hasBranchSpecificParams(request.body)) {
      return next();
    }

    const createResult = await quotePriceModel.standardQuotePriceCreate(request.body);
    
    if (!createResult?.status) {
      return apiResponse.ErrorResponse(response, createResult?.error || 'Failed to create quotation price');
    }

    logger.info('Standard quotation price created successfully', { 
      docId: createResult.data?._id,
      designationId: request.body.designationId 
    });

    request.body.baseQuotePriceId=createResult?.data.insertedId
    return next()
  } catch (error) {
    return logAndRespond(error, response, 'createStandardQuotePrice');
  }
};
export const createStandardQuotePriceHistory = async (request, response, next) => {
  try {
   
    const createResult = await quotePriceModel.standardQuotePriceCreateHistory(request.body);
    
    if (!createResult?.status) {
      return apiResponse.ErrorResponse(response, createResult?.error || 'Failed to create quotation price');
    }

    logger.info('Standard quotation price created successfully', { 
      docId: createResult.data?._id,
      designationId: request.body.designationId 
    });

    request.body.latestPriceId=createResult?.data.insertedId
    return next()
  } catch (error) {
    return logAndRespond(error, response, 'createStandardQuotePrice');
  }
};
export const updateStandardQuotePriceIdUpdate = async (request, response, next) => {
  try {
   
    const createResult = await quotePriceModel.updateBaseQuotationPriceId(request.body);
    
    if (!createResult?.status) {
      return apiResponse.ErrorResponse(response, createResult?.error || 'Failed to create quotation price');
    }

    logger.info('Standard quotation price created successfully', { 
      docId: createResult.data?._id,
      designationId: request.body.designationId 
    });
    return next()
  } catch (error) {
    return logAndRespond(error, response, 'createStandardQuotePrice');
  }
};

export const createStandardQuotePriceBranch = async (request, response) => {
  try {
    validateRequestBody(request.body, ['designationId']);
    
    const createResult = await quotePriceModel.modifyQuotePriceForBranch(request.body);
    
    if (!createResult?.status) {
      return apiResponse.ErrorResponse(response, createResult?.error || 'Failed to create branch-specific quotation price');
    }

    logger.info('Branch-specific quotation price created successfully', { 
      docId: createResult.data?._id,
      designationId: request.body.designationId,
      branchId: request.body.branchId 
    });

    return apiResponse.successResponseWithData(
      response, 
      "Branch-specific quotation price document created successfully", 
      createResult.data
    );
  } catch (error) {
    return logAndRespond(error, response, 'createStandardQuotePriceBranch');
  }
};

export const getStandardQuotePricesByDesignation = async (request, response) => {
  try {
    const quotePriceList = await quotePriceModel.standardQuotePricesByDesignation(request.body);
    
    if (!quotePriceList?.status) {
      return apiResponse.ErrorResponse(response, quotePriceList?.error || 'Failed to fetch quotation prices');
    }

    if (!quotePriceList.data || quotePriceList.data.length === 0) {
      return apiResponse.successResponseWithData(response, "No quotation prices found", []);
    }

    return apiResponse.successResponseWithData(
      response, 
      "Quotation prices fetched successfully", 
      quotePriceList.data
    );
  } catch (error) {
    return logAndRespond(error, response, 'getStandardQuotePricesByDesignation');
  }
};

export const listStandardQuotePrices = async (request, response) => {
  try {
    const quotePriceList = await quotePriceModel.standardQuotePricesList(request.body);
    
    if (!quotePriceList?.status) {
      return apiResponse.ErrorResponse(response, quotePriceList?.error || 'Failed to fetch quotation price list');
    }

    if (!quotePriceList.data || quotePriceList.data.length === 0) {
      return apiResponse.successResponseWithData(response, "No quotation prices found", []);
    }

    return apiResponse.successResponseWithData(
      response, 
      "Quotation price list fetched successfully", 
      quotePriceList.data
    );
  } catch (error) {
    return logAndRespond(error, response, 'listStandardQuotePrices');
  }
};

export const updateStandardQuotePrice = async (request, response) => {
  try {
    logger.info('Update quote price request received', {
      hasBody: !!request.body,
      bodyKeys: request.body ? Object.keys(request.body) : [],
      url: request.originalUrl,
      method: request.method
    });

    validateRequestBody(request.body, ['designationId', 'baseQuotePriceId']);
    
    logger.info('Request validation passed', {
      designationId: request.body.designationId,
      baseQuotePriceId: request.body.baseQuotePriceId,
      userId: request.body.user?._id,
      orgId: request.body.user?.orgId
    });
    
    const updateResult = await quotePriceModel.standardQuotePriceUpdate(request.body);
    
    logger.info('Model update result', {
      status: updateResult?.status,
      hasData: !!updateResult?.data,
      error: updateResult?.error,
      historyId: updateResult?.data?.historyId,
      referencesUpdated: updateResult?.data?.referencesUpdated
    });
    
    if (!updateResult?.status) {
      const errorMessage = updateResult?.error || 'Failed to update quotation price';
      logger.error('Update operation failed', { 
        error: errorMessage,
        baseQuotePriceId: request.body.baseQuotePriceId 
      });
      return apiResponse.ErrorResponse(response, errorMessage);
    }

    logger.info('Quotation price updated successfully', { 
      baseQuotePriceId: request.body.baseQuotePriceId,
      designationId: request.body.designationId,
      historyId: updateResult.data?.historyId,
      referencesUpdated: updateResult.data?.referencesUpdated
    });

    return apiResponse.successResponseWithData(
      response, 
      "Quotation price document updated successfully", 
      {
        baseQuotePriceId: request.body.baseQuotePriceId,
        historyId: updateResult.data?.historyId,
        referencesUpdated: updateResult.data?.referencesUpdated,
        syncResult: updateResult.data?.syncResult,
        updatedAt: new Date()
      }
    );
  } catch (error) {
    logger.error('Controller error in updateStandardQuotePrice', {
      error: error.message,
      stack: error.stack,
      body: request.body,
      url: request.originalUrl
    });
    return logAndRespond(error, response, 'updateStandardQuotePrice');
  }
};

export const modifyBranchQuotePrice = async (request, response) => {
  try {
    validateRequestBody(request.body, ['designationId', 'baseQuotePriceId', 'priceId']);
    
    const modifyResult = await quotePriceModel.modifyQuotePriceForBranch(request.body);
    
    if (!modifyResult?.status) {
      return apiResponse.ErrorResponse(response, modifyResult?.error || 'Failed to modify branch quotation price');
    }

    logger.info('Branch quotation price modified successfully', { 
      docId: modifyResult.data?._id,
      baseQuotePriceId: request.body.baseQuotePriceId,
      designationId: request.body.designationId 
    });

    return apiResponse.successResponseWithData(
      response, 
      "Quotation price document modified successfully", 
      modifyResult.data
    );
  } catch (error) {
    return logAndRespond(error, response, 'modifyBranchQuotePrice');
  }
};

// Additional utility middleware for validation chains
export const validateQuotePriceCreation = async (request, response, next) => {
  try {
    const requiredFields = ['designationId', 'daily', 'monthly', 'yearly'];
    validateRequestBody(request.body, requiredFields);
    
    // Validate daily/monthly/yearly structure
    const periods = ['daily', 'monthly', 'yearly'];
    for (const period of periods) {
      if (request.body[period]) {
        const genders = ['male', 'female'];
        for (const gender of genders) {
          if (request.body[period][gender]) {
            const limits = request.body[period][gender];
            if (typeof limits.cityLimit !== 'number' || 
                typeof limits.outCityLimit !== 'number' ||
                typeof limits.dayShift !== 'number' || 
                typeof limits.nightShift !== 'number') {
              throw new Error(`Invalid ${period} limits structure for ${gender}`);
            }
          }
        }
      }
    }
    
    return next();
  } catch (error) {
    return logAndRespond(error, response, 'validateQuotePriceCreation');
  }
};

export const validateQuotePriceUpdate = async (request, response, next) => {
  try {
    const requiredFields = ['designationId', 'baseQuotePriceId'];
    validateRequestBody(request.body, requiredFields);
    
    return next();
  } catch (error) {
    return logAndRespond(error, response, 'validateQuotePriceUpdate');
  }
};

export const getBranchQuotePricesComparison = async (request, response) => {
  try {
    const requiredBranchFields = ['subOrgId', 'branchId', 'departmentId'];
    const hasBranchField = requiredBranchFields.some(field => request.body[field]);
    
    if (!hasBranchField) {
      return apiResponse.validationErrorResponse(
        response, 
        "At least one branch identifier (subOrgId, branchId, or departmentId) is required"
      );
    }

    // Use the enhanced model function if available, otherwise fallback
    let comparisonResult;
    if (typeof quotePriceModel.getBranchQuotePricesComparison === 'function') {
      comparisonResult = await quotePriceModel.getBranchQuotePricesComparison(request.body);
    } else {
      // Fallback to existing function
      comparisonResult = await quotePriceModel.standardQuotePricesByDesignation(request.body);
    }
    
    if (!comparisonResult?.status) {
      return apiResponse.ErrorResponse(response, comparisonResult?.error || 'Failed to fetch branch quote prices comparison');
    }

    if (!comparisonResult.data || comparisonResult.data.length === 0) {
      return apiResponse.successResponseWithData(response, "No quotation prices found for this branch", {
        data: [],
        summary: { total: 0, branchSpecific: 0, basePrice: 0 }
      });
    }

    // Create summary if not provided
    const summary = comparisonResult.summary || {
      total: comparisonResult.data.length,
      branchSpecific: comparisonResult.data.filter(item => item.source === 'branch').length,
      basePrice: comparisonResult.data.filter(item => item.source === 'base').length,
      effectiveDate: request.body.date || new Date(),
      branchFilters: {
        subOrgId: request.body.subOrgId,
        branchId: request.body.branchId,
        departmentId: request.body.departmentId
      }
    };

    return apiResponse.successResponseWithData(
      response, 
      "Branch quote prices comparison fetched successfully", 
      {
        data: comparisonResult.data,
        summary: summary,
        pagination: comparisonResult.pagination
      }
    );
  } catch (error) {
    return logAndRespond(error, response, 'getBranchQuotePricesComparison');
  }
};