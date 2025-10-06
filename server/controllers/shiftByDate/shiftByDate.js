import * as apiResponse from '../../helper/apiResponse.js';
import * as shiftDateModel from '../../models/shiftByDate/shiftByDate.js';
import { logger } from '../../helper/logger.js';
import { extractUniqueValues } from '../../helper/formatting.js';
import moment from 'moment';
import { ObjectId } from 'mongodb';


export const shiftDateCreate = async (request,response,next) => {
    try
    {
        if(request.body.shiftDateList.length > 0) 
        {
            apiResponse.validationErrorWithData(response,"Shift date already exists",request.body.shiftDateList.data);
        }
        else
        {
            shiftDateModel.shiftDateCreate(request.body).then(res => {
                if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);
    
                request.body.shiftDateData = res.data;
                return next();
            }).catch(error => {
                logger.error("Error while shiftDateCreate in shift by date controller ",{ stack: error.stack });
                return apiResponse.somethingResponse(response, error.message)
            })
        }
    }
    catch(error)
    {
        logger.error("Error while shiftDateCreate in shift by date controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};

export const getAllShiftDate = async (request,response,next) => {
    try
    {
        shiftDateModel.getAllShiftDate(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.shiftDateList = res.data;
            return next();
        }).catch(error => {
            logger.error("Error while getAllShiftDate in shift by date controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch(error)
    {
        logger.error("Error while getAllShiftDate in shift by date controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
};
    
export const getListShiftDate = async (request,response,next) => {
    try
    {
        shiftDateModel.getListShiftDate(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            let allShifts = [];

            if (request.body?.shiftGroupDataListResponse) {
                allShifts = [...request.body.shiftGroupDataListResponse, ...res.data];
            } else {
                allShifts = res.data;
            }

            request.body.extractedData = extractUniqueValues(allShifts, ['clientId', 'currentShiftId', 'clientMappedId', 'clientBranchId','branchId','subOrgId','createdBy','employeeId']);
            request.body.extractedData['userIds'] = [...new Set([...request.body.assignmentUserIds.map(id => new ObjectId(id))]), ...new Set([...request.body.extractedData['employeeId'], ...request.body.extractedData['createdBy']])];
            request.body.extractedData['designationId'] = [...new Set(request.body.assignmentUsers.data.map(user => user.matchedAssignments.designationId.toString()))];

            let resDataKV = {}
            for(let data of allShifts){
                let userId = data.employeeId.toString()
                if(!resDataKV.hasOwnProperty(userId)) resDataKV[userId] = []
                resDataKV[userId].push(data)
            }
            
            request.body.shiftDataListResponse = resDataKV


            return next();
        }).catch(error => {
            logger.error("Error while getListShiftDate in shift by date controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch(error)
    {
        logger.error("Error while getListShiftDate in shift by date controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getOneShiftDate = async (request,response,next) => {
    try
    {
        shiftDateModel.getOneShiftDate(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.shiftDateList = res;
            return next();
        }).catch(error => {
            logger.error("Error while getOneShiftDate in shift by date controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch(error)
    {
        logger.error("Error while getOneShiftDate in shift by date controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const updateShiftDate = async (request,response,next) => {
    try
    {

        const existingShifts = request.body.shiftDataListResponse
        console.log(existingShifts)
        shiftDateModel.updateShiftDate(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.shiftDateData = res;
            return next();
        }).catch(error => {
            logger.error("Error while updateShiftDate in shift by date controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch(error)
    {
        logger.error("Error while updateShiftDate in shift by date controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const getRosterShiftDate = async (request,response,next) => {
    try
    {
        shiftDateModel.getRosterShiftDate(request.body).then(res => {
            if(!res.status) return apiResponse.ErrorResponse(response,"Something went worng",res.error);

            request.body.shiftRosterList = res.data;
            return next();
        }).catch(error => {
            logger.error("Error while getRosterShiftDate in shift by date controller ",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch(error)
    {
        logger.error("Error while getRosterShiftDate in shift by date controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const getShiftByDate = async (request, response, next) => {
    try {
        // if (request.body.assignedShift) return next()
        shiftDateModel.getShiftByDate(request.body).then(res => {
            if (!res.status) throw {}

            request.body.shiftByDate = res.data
            if(!request.body.dashboardStatus) {
                // request.body.currentShift = res.data.map(shift => (request.body.shiftObjData[shift.currentShiftId] || {}));
                return next()
            }

            // if (request.body.dashboardStatus && request.body.currentShift.length <= 0 && !request.body.existingCheckInOutData) return apiResponse.successResponseWithData(response, "No shift Available", { isCheckIn: false });

            request.body.checkNearestShift=true
            // request.body.transactionDate=undefined
            // request.body.transactionDate=new Date()
            return next();
        }).catch(error => {
            logger.error("Error while getShiftDate in shift by date controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    }
    catch (error) {
        logger.error("Error while getOneShiftDate in shift by date controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const groupData= (request, response, next) => {
    try {
        const { shiftDataListResponse, assignmentUsers,userIdLeaves,orgHolidays } = request.body;
        // if (!shiftDataListResponse || shiftDataListResponse.length === 0) {
        //     return next();
        // } // comminted this line to allow grouping even there is no shift ,holidays and leavedId have data we created date wise keys on holidays and leaves

        let groupedData = {};

        request.body.assignmentUsers.data = request.body.assignmentUsers.data.map(user => {
            let shiftData = shiftDataListResponse[user._id.toString()] || [];
            const userAppliedLeavesData= userIdLeaves[user._id.toString()] || {};


            groupedData[user._id.toString()] = {
                dates: {}
            };
            // let matchedEmployee = request.body.extractedProcessedData['userIds'][item.employeeId.toString()]
            // groupedData[item.employeeId.toString()]['employee'] = matchedEmployee

            // Build unified set of all dates for this user
            const allDatesSet = new Set();

            shiftData.forEach(sd => allDatesSet.add(moment(sd.date).format("YYYY-MM-DD")));
            Object.keys(userAppliedLeavesData).forEach(ld => allDatesSet.add(moment(ld).format("YYYY-MM-DD")));
            Object.keys(orgHolidays || {}).forEach(hd => allDatesSet.add(moment(hd).format("YYYY-MM-DD")));
            
            // for (let sd_i = 0; sd_i < shiftData?.length; sd_i++) {
            //     const item = shiftData[sd_i];
            //     const date = moment(item.date).format('YYYY-MM-DD');
            //     let userLeaveData=null
            //     const dateKey = moment(item.date).format('YYYY-MM-DD');
            //     if (userAppliedLeavesData && userAppliedLeavesData[dateKey]) {
            //         userLeaveData = userAppliedLeavesData[dateKey];
            //     }
            //     let holidayData = null;
            //     if(orgHolidays && orgHolidays[dateKey]){
            //         holidayData = orgHolidays[dateKey];
            //     }
                
            //     if(!groupedData[user._id.toString()]["dates"]) groupedData[user._id.toString()]["dates"] = {}
            //     if(!groupedData[user._id.toString()]["dates"][date]) groupedData[user._id.toString()]["dates"][date] = [];
            //     groupedData[user._id.toString()]["dates"][date].push({
            //         shiftId:item.currentShiftId,
            //         createdBy:item.createdBy,
            //         orgId:item.orgId,
            //         subOrgId:item.subOrgId,
            //         branchId:item.branchId,
            //         clientId:item.clientId,
            //         clientMappedId:item.clientMappedId,
            //         clientBranchId:item.clientBranchId,
            //         startTime: item.startTime,
            //         endTime: item.endTime,
            //         userLeaveId: userLeaveData ? userLeaveData.userLeaveId : null,
            //         holidayId: orgHolidays && orgHolidays[dateKey] ? orgHolidays[dateKey].holidayId : null,
            //     })
                
            // }
            
            // Loop once per date
            for (const dateKey of allDatesSet) {
                const leaveForDate = userAppliedLeavesData[dateKey] || null;
                const holidayForDate = orgHolidays?.[dateKey] || null;

                const shiftsForDate = shiftData.filter(sd => moment(sd.date).format("YYYY-MM-DD") === dateKey);

                if (shiftsForDate.length > 0) {
                    // Merge leave/holiday into each shift
                    groupedData[user._id.toString()].dates[dateKey] = shiftsForDate.map(sd => ({
                        shiftId: sd.currentShiftId,
                        createdBy: sd.createdBy,
                        orgId: sd.orgId,
                        subOrgId: sd.subOrgId,
                        branchId: sd.branchId,
                        clientId: sd.clientId,
                        clientMappedId: sd.clientMappedId,
                        clientBranchId: sd.clientBranchId,
                        startTime: sd.startTime,
                        endTime: sd.endTime,
                        userLeaveId: leaveForDate?.userLeaveId || null,
                        holidayId: holidayForDate?.holidayId || null,
                        shiftGroupId: sd?.shiftGroupId || null
                    }));
                } else {
                    // No shift, but leave/holiday exists
                    groupedData[user._id.toString()].dates[dateKey] = [{
                        // shiftId: null,
                        // createdBy: null,
                        // orgId: null,
                        // subOrgId: null,
                        // branchId: null,
                        // clientId: null,
                        // clientMappedId: null,
                        // clientBranchId: null,
                        // startTime: null,
                        // endTime: null,
                        userLeaveId: leaveForDate?.userLeaveId || null,
                        holidayId: holidayForDate?.holidayId || null
                    }];
                }
            }
            
            return {
                _id: user._id,
                name: user.name,
                ...groupedData[user._id.toString()] || [],
            }
        })
        request.body.responseData = {...request.body.assignmentUsers, references:request.body.extractedProcessedData}
        // if(request.body.isClient){
        //     request.body.responseData.totalRecord = request.body.assignmentClientUserIds.length;
        //     request.body.responseData.next_page=false
        // }
        return next();
    } catch (error) {
        logger.error("Error while grouping data in shift by date controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
}


export const getAssignedShiftByDateIds = async (request, response, next) => {
    try {
        const employeeIds = request?.body?.employeeIds || [];
        const existingShiftsIds = [];

        for (let sd_i = 0; sd_i < employeeIds.length; sd_i++) {

            const payload = {
                employeeId: employeeIds[sd_i],
                startDate: request?.body?.startDate,
                endDate: request?.body?.endDate,
                orgId: request?.body?.user?.orgId
            };

            const recievedData = await shiftDateModel.getAssignedShiftDateIds(payload);

            if (recievedData?.status && Array.isArray(recievedData?.data)) {
                // Loop through all shift records
                recievedData.data.forEach(shift => {
                    if (shift?._id) {
                        existingShiftsIds.push({
                            ...payload,
                            assignedShiftId: shift._id
                        });
                    }
                });
            }
        }

        request.body.existingShiftsIds = existingShiftsIds;
        return next();
    }
    catch (error) {
        logger.error("Error while getAllShiftAssignedShiftByDate data in shift by date controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};

export const deactiveShiftDateIds = async (request, response, next) => {
    try {
        const existingShiftsIds = request?.body?.existingShiftsIds || [];
        const deactiveShiftDateIds = [];
        console.log(existingShiftsIds.length)
        for (const shift of existingShiftsIds) {
            console.log(shift?.employeeId, 'employeeId');
            if (shift?.assignedShiftId == "WO" && request?.body?.shifts.some((d) => d.shiftId !== 'WO')) {
                const payload = {
                    employeeId: shift?.employeeId,
                    shiftId: shift?.assignedShiftId
                };
                const receivedData = await shiftDateModel.deactiveShiftDateIds(payload);
                deactiveShiftDateIds.push({
                    ...shift,
                    deactivated: receivedData?.status || false
                });
            }
            else {
                const payload = {
                    employeeId: shift?.employeeId,
                    shiftId: shift?.assignedShiftId
                };
                const receivedData = await shiftDateModel.deactiveShiftDateIds(payload);
                deactiveShiftDateIds.push({
                    ...shift,
                    deactivated: receivedData?.status || false
                });
            }
        }
        request.body.deactiveShiftDateIds = deactiveShiftDateIds;
        return next();
    } catch (error) {
        logger.error("Error while deactivating shift dates in deactiveShiftDateIds middleware", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};
export const isNewShiftExists = async (request, response, next) => {
    try {
        if (!request.body?.shifts) {
            return apiResponse.successResponse(response, "Shift Date created succefully")
        }
        else {
            return next()
        }
    }
    catch (error) {
        logger.error("Error whileisNewShiftExists data in shift by date controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
}
export const getShiftDetailsFromId = async (request, response, next) => {
    try {
        const payload = {
            employeeId: request?.body?.fromEmployeeId,
            startDate: request?.body?.date,
            endDate: request?.body?.date,
            orgId: request?.body?.user?.orgId
        };
        const data = await shiftDateModel?.getAssignedShiftDateIds(payload)
        if (data?.status) {
            request.body.fromIdDetails = data?.data
            return next()
        }
        else {
            request.body.fromIdDetails = {}
            return next()
        }
    }
    catch (error) {
        logger.error("Error whileisNewShiftExists data in shift by date controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
}
export const getShiftDetailsToId = async (request, response, next) => {
    try {
        const payload = {
            employeeId: request?.body?.toEmployeeId,
            startDate: request?.body?.date,
            endDate: request?.body?.date,
            orgId: request?.body?.user?.orgId
        };
        const data = await shiftDateModel?.getAssignedShiftDateIds(payload)
        if (data?.status) {
            request.body.toIdDetails = data?.data
            return next()
        }
        else {
            request.body.toIdDetails = {}
            return next()
        }
    }
    catch (error) {
        logger.error("Error whileisNewShiftExists data in shift by date controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
}
export const checkBeforeSwap = async (request, response, next) => {
    try {
        const { date, fromEmployeeId, toEmployeeId } = request.body;
        const shiftDate = new Date(date);

        let fromShifts = Array.isArray(request.body.fromIdDetails) ? request.body.fromIdDetails : [];
        let toShifts = Array.isArray(request.body.toIdDetails) ? request.body.toIdDetails : [];

        // Remove "WO" (week off) shifts from both lists
        fromShifts = fromShifts.filter(r => r.currentShiftId !== 'WO');
        toShifts = toShifts.filter(r => r.currentShiftId !== 'WO');

        console.log("FromShifts:", fromShifts, fromShifts.length);
        console.log("ToShifts:", toShifts, toShifts.length);

        // CASE 1: Both have shifts → swap
        if (fromShifts.length > 0 && toShifts.length > 0) {
            for (const shift of fromShifts) {
                const updatePayload = {
                    employeeId: new ObjectId(toEmployeeId),
                    preEmployeeId: shift.employeeId
                };
                console.log("Swap From→To:", updatePayload, shift._id);
                const res = await shiftDateModel.updateShiftSwap({ updatePayload, shiftId: shift._id });
                console.log(res.status);
            }

            for (const shift of toShifts) {
                const updatePayload = {
                    employeeId: new ObjectId(fromEmployeeId),
                    preEmployeeId: shift.employeeId
                };
                console.log("Swap To→From:", updatePayload, shift._id);
                const res = await shiftDateModel.updateShiftSwap({ updatePayload, shiftId: shift._id });
                console.log(res.status);
            }
        }
        // CASE 2: P1 has no shifts, P2 has → give to P1
        else if (fromShifts.length === 0 && toShifts.length > 0) {
            for (const shift of toShifts) {
                const updatePayload = {
                    employeeId: new ObjectId(fromEmployeeId),
                    preEmployeeId: shift.employeeId
                };
                console.log("Move To→From:", updatePayload, shift._id);
                const res = await shiftDateModel.updateShiftSwap({ updatePayload, shiftId: shift._id });
                console.log(res.status);
            }
        }
        // CASE 3: P2 has no shifts, P1 has → give to P2
        else if (toShifts.length === 0 && fromShifts.length > 0) {
            for (const shift of fromShifts) {
                const updatePayload = {
                    employeeId: new ObjectId(toEmployeeId),
                    preEmployeeId: shift.employeeId
                };
                console.log("Move From→To:", updatePayload, shift._id);
                const res = await shiftDateModel.updateShiftSwap({ updatePayload, shiftId: shift._id });
                console.log(res.status);
            }
        }

        return next();
    } catch (error) {
        logger.error("Error in checkBeforeSwap", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};
