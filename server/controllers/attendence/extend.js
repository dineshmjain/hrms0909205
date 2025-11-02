import * as apiResponse from '../../helper/apiResponse.js';
import { logger } from '../../helper/logger.js';
import * as helper from '../../helper/formatting.js';
import { approvalBits, attendanceApprovalStatus, attendanceApprovalStatusBits } from '../../helper/constants.js';
import * as attendenceExtendModel from '../../models/attendence/extend.js';

export const add = async (request, response, next) => {
    try {
        const addExtendData = await attendenceExtendModel.add(request.body)

        if (!addExtendData.status) throw {}

        return next()
    } catch (error) {
        logger.error(`attendance : extend : add : ${error}`);
        return apiResponse.somethingResponse(response, "unable to apply extension");
    }
}

export const list = async (request, response, next) => {
    try {
        const extendList = await attendenceExtendModel.list(request.body)

        if (!extendList.status) throw {}

        request.body.extendList = extendList.data.map(item => {
            item.shiftName = request.body.shiftObjData[item.shiftId]?.name
            item.userName = request.body.allUsers[item.userId]?.name
            item.branchName = request.body.branchObjData[item.branchId]?.name
            return item;
        });

        return next()
    } catch (error) {
        logger.error(`attendance : extend : list : ${error}`);
        return apiResponse.somethingResponse(response, "unable to fetch extension list");
    }
}

export const isDuplicateExtension = async (request, response, next) => {
    try {
        const getByDate = await attendenceExtendModel.getByDate(request.body)

        if (getByDate.status && !request.body.dashboardStatus) return apiResponse.validationError(response, "Extension already applied for this date");

        request.body.extendDetailsByDate = getByDate.data;

        request.body.extensionId = getByDate.data?._id

        return next()
    } catch (error) {
        logger.error(`attendance : extend : isDuplicateExtension : ${error}`);
        return apiResponse.somethingResponse(response, "unable to validate extension");
    }
}

export const isExtendedIdValid = async (request, response, next) => {
    try {
        const getById = await attendenceExtendModel.getById(request.body)

        if (!getById.status) return apiResponse.validationError(response, "Invalid extension!!");

        request.body.extendDetails = getById.data;

        return next()
    } catch (error) {
        logger.error(`attendance : extend : isExtendedIdValid : ${error}`);
        return apiResponse.somethingResponse(response, "unable to validate extension");
    }
}

export const isMultipleExtendedIdValid = async (request, response, next) => {
    try {
        const getMultipleExtensions = await attendenceExtendModel.getMultipleExtensions(request.body)

        if (!getMultipleExtensions.status || getMultipleExtensions.data.length != request.body.extensionIds.length) return apiResponse.validationError(response, "Invalid extension!!");

        request.body.extendData = getMultipleExtensions.data;

        return next()
    } catch (error) {
        logger.error(`attendance : extend : isMultipleExtendedIdValid : ${error}`);
        return apiResponse.somethingResponse(response, "unable to validate extension");
    }
}

export const updateStatus = async (request, response, next) => {
    try {
        const updateStatus = await attendenceExtendModel.updateStatus(request.body)

        if (!updateStatus) throw {}

        return next()
    } catch (error) {
        logger.error(`attendance : extend : update status : ${error}`);
        return apiResponse.somethingResponse(response, "unable to update extension status");
    }
}

export const updateDateBased = async (request, response, next) => {
    try {

        if(!request.body.extendDetailsByDate) return next();

        const updateDateBased = await attendenceExtendModel.updateDateBased(request.body)

        if (!updateDateBased.status) throw {}

        return next()
    } catch (error) {
        logger.error(`attendance : extend : update status : ${error}`);
        return apiResponse.somethingResponse(response, "unable to update extension status");
    }
}