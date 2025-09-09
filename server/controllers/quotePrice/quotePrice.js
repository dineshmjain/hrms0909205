import * as quotePriceModel from '../../models/quotePrice/quotePrice.js';
import * as apiResponse from '../../helper/apiResponse.js';
import {logger} from '../../helper/logger.js';
import { generateServiceChargeKey } from '../../helper/generateRedisKey.js';
import { getDetailsArray, setDetailsArray } from '../../config/redis.js';

// checking exist service charges
export const existServiceCharges=async(request,response,next)=>{
    try{
        const existServiceCharges=await quotePriceModel.existServiceCharges(request.body)
        if(request?.body?._id && existServiceCharges?.status){ // this condition for before update and delete api check exist or not if exist go next
            return next()
        }else if(request?.body?._id && !existServiceCharges?.status){ //this condition for update and delete api if not exisied show no data found
            return apiResponse.notFoundResponse(response, 'No Data found')
        }else if(!existServiceCharges?.status){ // this condition for create api check exist or not  if unique go to next
            return next()
        }else if(request.body.quotePrice && existServiceCharges?.status){
            request.body.serviceChargeData=existServiceCharges?.data // this paramter need for quote price api-/get/service/calculate-cost
            return next()
        }else if(request.body.quotePrice && !existServiceCharges?.status){ // this condition for quote price api-/get/service/calculate-cost
            return apiResponse.notFoundResponse(response, 'No Data found')
        }
        // console.log(".........existServiceCharges......",existServiceCharges)
        return apiResponse.validationError(response,'Data already existed')

    }catch(error){
        logger.error('Error existServiceCharges in  userRules controller',{stack:error.stack});
        return apiResponse.somethingResponse(response,error.message) 
    }
}



// create quote prices of serivce charges
export const createCharges=async(request,response)=>{
    try{
        const createCharges = await quotePriceModel.createCharges(request.body)
        createCharges.status? apiResponse.successResponse(response,'quote on charges created successfully'):
        apiResponse.validationError(response,createQuote?.message??'failed to create charges')

    }catch(error){
        logger.error('Error createCharges in  quotePrice controller',{stack:error.stack});
        return apiResponse.somethingResponse(response,error.message)
    }
}

// get service charges
export const getServiceCharges=async(request,response,next)=>{
    try {
        const getServiceCharges = await quotePriceModel.getServiceCharges(request.body)
        if(getServiceCharges.status&&getServiceCharges.data.length>=1){
            request.body.response=getServiceCharges
            return next()
        }
       
        return apiResponse.notFoundResponse(response, getServiceCharges?.message||'No Data found')


    } catch (error) {
        logger.error("Error getServiceCharges in   quotePrice controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}


// edit service charges
export const editServiceCharges= async (request, response, next) => {
    try {
        const editServiceCharges = await quotePriceModel.editServiceCharges(request.body)
        if(editServiceCharges.status){
            return next()
        }
       
        return apiResponse.notFoundResponse(response, 'updating failed')


    } catch (error) {
        logger.error("Error editServiceCharges in  quotePrice controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}


//delete service charge
export const deleteServiceCharge= async (request, response, next) => {
    try {
        const deleteServiceCharge = await quotePriceModel.deleteServiceCharge(request.body)
        if(deleteServiceCharge.status){
            return next()
        }
       
        return apiResponse.notFoundResponse(response, 'deletion failed')


    } catch (error) {
        logger.error("Error deleteServiceCharge in  quotePrice controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

// get employees calculate quote price 
export const getEmployeesQuotePrice=async(request,response,next)=>{
    try{
        const getEmployeesQuotePrice=await quotePriceModel.getEmployeesQuotePrice(request.body)
        
        if(getEmployeesQuotePrice.status&&getEmployeesQuotePrice.data){
            request.body.response=getEmployeesQuotePrice.data
            return next()
        }
        return apiResponse.notFoundResponse(response, 'data failed to get')

    }catch (error) {
        logger.error("Error deleteServiceCharge in quotePrice controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}


// Checking if service charges array exist for multiple requirements
export const existServiceChargesArray = async (request, response, next) => {
    try {
        const requirements = request.body.requirement || [];
        if (!Array.isArray(requirements) || requirements.length === 0) {
            return apiResponse.validationError(response, 'Requirement array is missing or empty.');
        }

        const redisKey = generateServiceChargeKey(request.body); // Generate Redis keys
        

        // Fetch cached data from Redis
        let serviceChargeList = await getDetailsArray("serviceChargeList", redisKey);
        

        const missingKeys = [];
        const updatedData = {}; // Store newly fetched data for Redis update

        for (const key of redisKey) {
            if (!serviceChargeList[key]) {
                missingKeys.push(key);
            }
        }

        if (missingKeys.length > 0) {
            const user = request.body.user;

            const fetchedData = await Promise.all(
                requirements.map(async (req, index) => {
                    if (missingKeys.includes(redisKey[index])) {
                        const existServiceCharges = await quotePriceModel.existServiceCharges({ ...req, user });
                        if (!existServiceCharges?.status) {
                            throw new Error('No Data found for one or more entries.');
                        }
                        const serviceChargeData = { ...req, serviceChargeData: existServiceCharges?.data };
                        updatedData[redisKey[index]] = serviceChargeData;
                        return serviceChargeData;
                    }
                    return null;
                })
            );

            // Update Redis with missing keys
            await setDetailsArray("serviceChargeList", Object.keys(updatedData), Object.values(updatedData));

            // Merge fetched data into the serviceChargeList object
            serviceChargeList = { ...serviceChargeList, ...updatedData };
        }

        // Transform serviceChargeList into an array
        const serviceChargeArray = Object.values(serviceChargeList);

        // Assign the array to request.body.requirement
        request.body.requirement = serviceChargeArray;

        
        return next();
    } catch (error) {
        logger.error('Error existServiceCharges in quotePrice controller', { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};


export const getEmployeesQuotePriceArray=async(request,response,next)=>{
    try{
        const getEmployeesQuotePrice=await quotePriceModel.getEmployeesQuotePriceArray(request.body)
        
        if(getEmployeesQuotePrice.status&&getEmployeesQuotePrice.data){
            request.body.response=getEmployeesQuotePrice.data
            return next()
        }
        return apiResponse.notFoundResponse(response, 'data failed to get')

    }catch (error) {
        logger.error("Error deleteServiceCharge in quotePrice controller", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}



