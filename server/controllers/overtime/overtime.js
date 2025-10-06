import * as otModel from '../../models/overtime/overtime.js';
import * as apiResponse from '../../helper/apiResponse.js';
import { ObjectId } from 'mongodb';
import { logger } from '../../helper/logger.js';

export const addOvertime = async (request, response, next) => {
    try {

        const result = await otModel.addOvertime(request.body);
        if (!result.status) return apiResponse.ErrorResponse(response, "Unable to Add", result.error);

        request.body.overtimeId = result.data.insertedId;

        return next();
    }
    catch (error) {
        logger.error(`overtimeController - add - Overtime - error: ${error}`);
        return apiResponse.ErrorResponse(response, "Something went worng", error);
    }
}

export const getOvertimeList = async (request, response, next) => {
    try {

        const result = await otModel.getList(request.body);

        if(request.body.wizardGetAllData) {
            if(result.status && result.data && result.data.length > 0) request.body.allDataRes['overtime'] = result.data
            return next()
        }
        if (!result.status || result.data.length <= 0) return apiResponse.ErrorResponse(response, "Data not found!");

        request.body.overtimeData = result.data;
        return next();
    }
    catch (error) {
        logger.error(`overtimeController - list - Overtime - error: ${error}`);
        return apiResponse.ErrorResponse(response, "Something went worng", error);
    }
}

export const getOvertime = async (request, response, next) => {
    try {

        const result = await otModel.get(request.body);
        if (!result.status) return apiResponse.ErrorResponse(response, "Invalid Overtime");

        request.body.overtimeDetails = result.data;
        return next();
    }
    catch (error) {
        logger.error(`overtimeController - get - Overtime - error: ${error}`);
        return apiResponse.ErrorResponse(response, "Something went worng", error);
    }

}

export const updateOvertime = async (request, response, next) => {
    try {

        const result = await otModel.update(request.body);
        if (!result.status) throw {}

        return next();
    }
    catch (error) {
        logger.error(`overtimeController - update - Overtime - error: ${error}`);
        return apiResponse.ErrorResponse(response, "Something went worng", error);
    }
}