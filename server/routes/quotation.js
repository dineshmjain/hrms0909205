import { Router } from 'express';
import * as auth from '../controllers/auth/auth.js';
import * as user from '../controllers/user/user.js';
import * as quotePrice from '../controllers/quotation/Price.js';
import * as apiResponse from '../helper/apiResponse.js';
import { celebrate } from 'celebrate';
import { validation } from '../helper/validationSchema.js';
import { logger } from '../helper/logger.js';
import * as quotationController from '../controllers/quotation/quotation.js';
import * as negotationController from "../controllers/quotation/negotation.js"
import * as leadController from "../controllers/leads/lead.js"

const router = Router();

// Request logging middleware
router.use((request, response, next) => {
  logger.info('Quote Price API Request', {
    method: request.method,
    url: request.originalUrl,
    userAgent: request.get('User-Agent'),
    ip: request.ip,
    timestamp: new Date().toISOString()
  });
  return next();
});

// Common middleware stack for authenticated routes
const commonAuthMiddleware = [
  auth.isAuth,
  user.isUserValid
];

// Helper function to safely check if middleware exists
const safeMiddleware = (middlewareName) => {
  if (typeof quotePrice[middlewareName] === 'function') {
    return quotePrice[middlewareName];
  }
  
  logger.warn(`Middleware ${middlewareName} not found, creating placeholder`);
  return (request, response, next) => {
    logger.error(`Function ${middlewareName} is not implemented`);
    return apiResponse.ErrorResponse(response, `${middlewareName} function is not implemented yet`);
  };
};

// ============= STANDARD QUOTE PRICE ROUTES =============

router.post('/add/standard/price',
  // celebrate(validation.addStandardQuotePrice),
  ...commonAuthMiddleware,
  quotePrice.isQuotePriceExists,
  quotePrice.createStandardQuotePrice,
  quotePrice.createStandardQuotePriceHistory,
  (req, res) => {
    apiResponse.successResponse(res, "Quotation Generated Successfully")
  }
);

router.post('/update/standard/price',
  celebrate(validation.updateStandardQuotePrice),
  ...commonAuthMiddleware,
  quotePrice.createStandardQuotePriceHistory,
  (req, res) => {
    apiResponse.successResponse(res, "Quotation Price Updated Successfully")
  }
);

router.post('/list/standard/price',
  celebrate(validation.listQuoteStandardPrice || {}),
  ...commonAuthMiddleware,
  quotePrice.listStandardQuotePrices
);

router.get('/standard/designation/price',
  celebrate(validation.getQuotePricesByDesignation || {}),
  ...commonAuthMiddleware,
  // (request, response, next) => {
  //   request.body.designationId = request.params.designationId;
  //   next();
  // },
  quotePrice.getStandardQuotePricesByDesignation
);

router.post('/standard/designation/price',
  celebrate(validation.getQuotePricesByDesignation || {}),
  ...commonAuthMiddleware,
  quotePrice.getStandardQuotePricesByDesignation
);

// ============= BRANCH-SPECIFIC QUOTE PRICE ROUTES =============

router.post('/branch/modify/quotation/price',
  celebrate(validation.modifyBranchQuotePrice || {}),
  ...commonAuthMiddleware,
  quotePrice.modifyBranchQuotePrice
);

router.post('/branch/comparison/quotation/price',
  celebrate(validation.getBranchQuotePricesComparison || {}),
  ...commonAuthMiddleware,
  safeMiddleware('getBranchQuotePricesComparison')
);

router.put('/branch/update/quotation/price',
  celebrate(validation.updateBranchQuotePrice || {}),
  ...commonAuthMiddleware,
  quotePrice.isQuotePriceByDesignationId,
  quotePrice.modifyBranchQuotePrice
);

router.post('/branch/quotation/price',
  ...commonAuthMiddleware,
  quotePrice.getStandardQuotePricesByDesignation
);

// ============= QUOTATION GENERATION ROUTES =============

router.post('/generate',
  // Debug middleware (optional - remove in production)
  (req, res, next) => {
    console.log('Generate Quotation Request Body:', req.body);
    next();
  },
  celebrate(validation.genrateQuotation),
  // handleValidationError,
  ...commonAuthMiddleware,
  quotationController.generateQuotation,
  negotationController.createNegotiation,
  negotationController.getNegotiationStatus,
  leadController.updateLeadStatus,
  (req, res) => {
    apiResponse.successResponse(res, "Quotation Generated Successfully")
  }
);

router.post('/generate/negotiation',
  // celebrate(validation.genrateQuotation || {}),
  ...commonAuthMiddleware,
  negotationController.updateNegotation,
  negotationController.createNegotiation,
  negotationController.getNegotiationStatus,
  leadController.updateLeadStatus,
  (req, res) => {
    apiResponse.successResponse(res, "Negotiation Generated Successfully")
  }
);

router.post('/negotation/track',
  ...commonAuthMiddleware,
  quotationController.trackQuotation
);

router.post("/quotation/reject",
  ...commonAuthMiddleware,
  quotationController.closeQuotation
)

// ============= UTILITY ROUTES =============

router.get('/debug/functions', (request, response) => {
  const availableFunctions = Object.keys(quotePrice).filter(key => typeof quotePrice[key] === 'function');
  const expectedFunctions = [
    'isQuotePriceExists',
    'isQuotePriceById', 
    'isQuotePriceByDesignationId',
    'createStandardQuotePrice',
    'createStandardQuotePriceBranch',
    'getStandardQuotePricesByDesignation',
    'listStandardQuotePrices',
    'updateStandardQuotePrice',
    'modifyBranchQuotePrice',
    'getBranchQuotePricesComparison',
    'validateQuotePriceCreation',
    'validateQuotePriceUpdate',
    'generateQuotation'
  ];
  
  const missingFunctions = expectedFunctions.filter(func => !availableFunctions.includes(func));
  
  return apiResponse.successResponseWithData(response, 'Quote Price Functions Debug', {
    availableFunctions: availableFunctions.sort(),
    expectedFunctions: expectedFunctions.sort(),
    missingFunctions: missingFunctions.sort(),
    counts: {
      available: availableFunctions.length,
      expected: expectedFunctions.length,
      missing: missingFunctions.length
    }
  });
});

router.get('/health', (request, response) => {
  return apiResponse.successResponse(response, 'Quote Price service is healthy');
});

router.get('/', (request, response) => {
  const availableFunctions = Object.keys(quotePrice).filter(key => typeof quotePrice[key] === 'function');
  
  return apiResponse.successResponseWithData(response, 'Quote Price API v1.0', {
    version: '1.0.0',
    status: 'running',
    availableFunctions: availableFunctions.length,
    endpoints: {
      standard: {
        create: 'POST /add/standard/price',
        update: 'POST /update/standard/price',
        list: 'POST /list/standard/price',
        byDesignation: 'GET /standard/designation/:designationId/price',
        byDesignationPost: 'POST /standard/designation/price'
      },
      branch: {
        modify: 'POST /branch/modify/quotation/price',
        update: 'PUT /branch/update/quotation/price',
        list: 'POST /branch/quotation/price',
        comparison: 'POST /branch/comparison/quotation/price'
      },
      quotation: {
        generate: 'POST /generate/quotation',
        generateNegotiation: 'POST /generate/quotation/negotiation',
        track: 'POST /negotation/track'
      },
      debug: {
        functions: 'GET /debug/functions',
        health: 'GET /health'
      }
    }
  });
});

// ============= ERROR HANDLING =============

router.use((error, request, response, next) => {
  logger.error('Quote Price Route Error', {
    error: error.message,
    stack: error.stack,
    url: request.originalUrl,
    method: request.method,
    body: request.body
  });

  if (error.name === 'ValidationError' || error.joi) {
    return apiResponse.validationErrorResponse(response, error.joi?.details || error.message);
  }
  
  if (error.name === 'UnauthorizedError') {
    return apiResponse.unauthorizedResponse(response, 'Access denied');
  }
  
  if (error.name === 'CastError') {
    return apiResponse.validationErrorResponse(response, 'Invalid ID format');
  }

  return apiResponse.somethingResponse(response, 'An unexpected error occurred');
});

export default router;