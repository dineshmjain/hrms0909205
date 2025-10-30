import * as apiResponse from '../../helper/apiResponse.js';
import * as salary from '../../models/salary/salary.js';

export const addDefaultSalaryComponents = async (request, response, next) => {
    try{
        if(request.body.orgExist) return next();
        salary.createDefaultSalaryComponents(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            return next();
        }).catch(error => {
            request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const listSalaryComponents = async (request, response, next) => {
    try{
        salary.listSalaryComponents(request.body).then(res => {
            if(request.body.wizardGetAllData) {
                if(res.status && res.data && res.data.length > 0) request.body.allDataRes['salaryComponents'] = res.data
                return next()
            }
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            request.body.components = res;
            return next();
        }).catch(error => {
            request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const createDefaultSalaryComponents = async (request, response, next) => {
  try {
    const res = await salary.createDefaultSalaryComponents(request.body);
    if (res.status) {
      return next();
    } else {
      return apiResponse.validationError(response, res.message);
    }
  } catch (error) {
    request.logger.error("Error while creating shift group in shiftGroup controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
};

export const createSalaryComponent = async (request, response, next) => {
  try {
    const res = await salary.createSalaryComponent(request.body);
    if (res.status) {
      return next();
    } else {
      return apiResponse.validationError(response, res.message);
    }
  } catch (error) {
    request.logger.error("Error while creating shift group in shiftGroup controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
};

export const toggleSalaryComponents = async (request, response, next) => {
  try {
    const res = await salary.toggleSalaryComponents(request.body);
    if (res.status) {
      return next();
    } else {
      return apiResponse.validationError(response, res.message);
    }
  } catch (error) {
    request.logger.error("Error while creating shift group in shiftGroup controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
};

export const createSalaryTemplate = async (request, response, next) => {
  try {
    const res = await salary.createSalaryTemplate(request.body);
    if (res.status) {
      return next();
    } else {
      return apiResponse.validationError(response, res.message);
    }
  } catch (error) {
    request.logger.error("Error while creating shift group in shiftGroup controller", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
};

export const updateSalaryComponent = async (request, response, next) => {
  try {
    const res = await salary.updateSalaryComponent(request.body);
    if (res.status) {
      return next();
    } else {
      return apiResponse.validationError(response, res.message);
    }
  } catch (error) {
    request.logger.error("Error while updating salary component", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
};

export const getSalaryTemplate = async (request, response, next) => {
    try{
        salary.getSalaryTemplate(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            request.body.template = res.data;
            return next();
        }).catch(error => {
            request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const listSalaryTemplates = async (request, response, next) => {
    try{
        salary.listSalaryTemplates(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            request.body.components = res;
            return next();
        }).catch(error => {
            request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const previewSalaryTemplate = async (request, response, next) => {
    try{
        salary.previewSalaryTemplate(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
            request.body.components = res;
            return next();
        }).catch(error => {
            request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })

    }catch(error){
        request.logger.error("Error while addDefaultDesignations in designation controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}