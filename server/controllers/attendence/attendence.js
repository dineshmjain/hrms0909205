import { request, response } from 'express';
import * as apiResponse from '../../helper/apiResponse.js';
import * as employeeAttendenceModel from '../../models/attendence/attendence.js'
import * as shiftModel from '../../models/shift/shift.js'
import * as userModel from '../../models/user/user.js';
import moment from 'moment';
import * as momentzone from 'moment-timezone'
import {indexUserFace ,searchUserFace} from "../../config/aws.js"
import { logger } from '../../helper/logger.js';
import { KafkaService } from '../../utils/kafka/kafka.js';
import * as helper from '../../helper/formatting.js';
import { approvalBits, attendanceApprovalStatus, attendanceApprovalStatusBits } from '../../helper/constants.js';
import * as clientbranch from "../../models/client/clientBranch.js";
import * as branch from "../../models/branch/branch.js";
import * as user from '../../models/user/user.js';

const kafka = new KafkaService();


// Function to determine daycross status
const getDaycrossStatus = (datetimeStr, shiftSegments) => {
    // Use moment to parse the datetime string and extract the time in 'HH:mm' format
    const inputTime = moment(datetimeStr);
    const extracted = inputTime.format('HH:mm');
    // Function to convert time to total minutes for easy comparison
    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const extractedMinutes = timeToMinutes(extracted);
    
    // Check for first shift segment
    const firstStartMinutes = timeToMinutes(shiftSegments[0].start);
    const firstEndMinutes = timeToMinutes(shiftSegments[0].end);

    if (firstStartMinutes <= extractedMinutes && extractedMinutes <= firstEndMinutes) {
        return false; // First segment (daycross false)
    }

    // Check for second shift segment
    const secondStartMinutes = timeToMinutes(shiftSegments[1].start);
    const secondEndMinutes = timeToMinutes(shiftSegments[1].end);

    // Extend the second shift's end time by 5 hours
    const extendedSecondEndMinutes = secondEndMinutes + 1 * 60; // Add 5 hours in minutes

    
    // Handle segments that wrap around midnight
    if (secondStartMinutes < extendedSecondEndMinutes) {
        if (secondStartMinutes <= extractedMinutes && extractedMinutes <= extendedSecondEndMinutes) {
            return true; // Second segment (daycross true)
        }
    } else {
        // For segments that wrap around midnight
        if (extractedMinutes >= secondStartMinutes || extractedMinutes <= extendedSecondEndMinutes) {
            return true; // Second segment (daycross true)
        }
    }

    
    return false; // Default if outside of segments
};

// checks whether a given time range crosses into the next day.
function isDayCross(startTime, endTime) {
    // Convert time string to Date objects for comparison
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
  
    // Compare start and end times
    if (endHours < startHours || (endHours === startHours && endMinutes < startMinutes)) {
      return true; // Shift crosses into the next day
    } else {
      return false; // Shift does not cross into the next day
    }
  }





export const checkingEmployeeCurrentShift = async (request, response, next) => {
    try {
        const getCurrentShift = await userModel.getUserCurrentShift(request.body)
        request.body.checkNearestShift = true
        if(getCurrentShift && getCurrentShift.currentShiftDetails)
        {
            request.body.assignedShift = getCurrentShift.currentShiftDetails
            // const getCurrentShift = request.body.shiftData
            if (getCurrentShift) 
            {
                // const { startTime, endTime, name } = getCurrentShift.data[0].currentShiftDetails
                const { startTime, endTime, name, _id, minIn, minOut, maxIn, maxOut } = getCurrentShift.currentShiftDetails
                console.log("......startTime,endTime,name...", startTime, endTime, name)
    
                if (startTime == 'WO' || endTime == 'WO') {
                    return apiResponse.customResponse(response, `Today is WeekOff You can't CheckIn`)
                }
    
                const checkInTime = moment(request.body.transactionDate)
                const baseDate = checkInTime.format("YYYY-MM-DD")
                
                if (request.body.type === 'checkIn') 
                {
                    const minInTime = moment(`${baseDate}T${minIn}`)
                    const maxInTime = moment(`${baseDate}T${maxIn}`)
    
                    // Check if check-in is outside the allowed window
                    if (!checkInTime.isBetween(minInTime, maxInTime, null, '[]')) {
                        request.body.checkNearestShift = true
                    }
                }
                else if (request.body.type === 'checkOut') 
                {
    
                    const minOutTime = moment(`${baseDate}T${minOut}`)
                    const maxOutTime = moment(`${baseDate}T${maxOut}`)
                    if (checkInTime.isBetween(minOutTime, maxOutTime, null, '[]')) {
                        request.body.checkNearestShift = false
                    }
                }
    
                request.body.startTime = startTime
                request.body.endTime = endTime
                request.body.shiftName = name
                request.body.shiftId = _id
    
                const dayStatus = isDayCross(startTime, endTime)
                let dayCrossStatus
                if (dayStatus) {
                    // Define shift segments
                    const shiftSegments = [
                        { start: startTime, end: '23:59:59' },  // First segment (same day)
                        { start: '00:00:00', end: endTime }     // Second segment (next day)
                    ];
                    // const trDate=new Date(request.body.transactionDate)
                    dayCrossStatus = getDaycrossStatus(request.body.transactionDate, shiftSegments);
                }
                request.body.dayStatus = dayStatus
                request.body.dayCrossStatus = dayCrossStatus
                

            }
            return next()
       
        }
        else return next()
    } catch (error) {
        console.error("Error in checkingEmployeeCurrentShift:", error.message)
        return apiResponse.ErrorResponse(response, error.message)
    }
}

export const getEmployeeNearestShift = async (request, response, next) => {
    try 
    {   
        // if(!request.body.dashboardStatus=='false')return next()
        if(request.body.checkNearestShift || !request?.body?.transactionDate)
        {   
            // request.body.transactionDate =new Date()
            const result = await userModel.getEmployeeNearestShift(request.body)
            // console.log("...result...",JSON.stringify(result))
            if(result)
            {
               request.body.nearestShift = result
               request.body.shiftId = result._id
               return next()
            }
            else
            {
                return apiResponse.notFoundResponse(response, 'No Shift Found');    
            }
        }
        else
        {
            return next()
        }
    } catch (error) {
        console.error("Error in checkingEmployeeCurrentShift:", error.message)
        return apiResponse.ErrorResponse(response, error.message)
    }
}

export const getEmployeeNearestShift2 = async (request, response, next) => {
    try 
    {   
        const result = await userModel.getEmployeeNearestShift2(request.body)
        // console.log("...result...",JSON.stringify(result))
        if(!result) return apiResponse.notFoundResponse(response, "Shift Not Found!")
        let {address, geoJson, geoLocation,salaryCycle,weekOff,authUser, ...rest} = result    
        request.body.nearestShift = rest
        request.body.shiftId = rest._id
        return next()
 
    } catch (error) {
        console.error("Error in checkingEmployeeCurrentShift:", error.message)
        return apiResponse.ErrorResponse(response, error.message)
    }
}

export const getEmployeeAttendenceStats = async (request, response, next) => {
    try
    {
        const getData = await employeeAttendenceModel.getEmployeeAttendenceStats(request.body)
        if (getData.status) {
            return apiResponse.successResponseWithData(response, 'Data Found Successfully', getData.data)
        } else {
            return apiResponse.notFoundResponse(response, 'No Data Found');
        }

    }
    catch (error) {
        console.error("Error in getEmployeeAttendenceStats:", error.message)
        return apiResponse.ErrorResponse(response, error.message)
    }
}

const checkInOutPredefinedConditions = (existingData, response, body) => {
    try {
        const firstHalfCheckIn = existingData.session.firstHalf?.checkIn?.time;
        const firstHalfCheckOut = existingData.session.firstHalf?.checkOut?.time;
        const secondHalfCheckIn = existingData.session.secondHalf?.checkIn?.time;
        const secondHalfCheckOut = existingData.session.secondHalf?.checkOut?.time;

        if (new Date(body.transactionDate).toISOString().split('T')[0] !== new Date(firstHalfCheckIn).toISOString().split('T')[0]) {
            return apiResponse.validationError(response, 'Your Check-In Date with already existing First Check-In Date is not the same');
        }
        

        const totalWorkingHours = 9; // Total working hours defined somewhere in your logic

        // Calculate the remaining working time in minutes
        const totalWorkingTime = totalWorkingHours * 60; // Total working time in minutes
        const firstHalfDuration = firstHalfCheckOut ? 
            (new Date(firstHalfCheckOut) - new Date(firstHalfCheckIn)) / 60000 : 0; // Duration of the first half in minutes 

        const secondHalfDuration = secondHalfCheckOut ? 
            (new Date(secondHalfCheckOut) - new Date(secondHalfCheckIn)) / 60000 : (firstHalfCheckOut?(new Date(secondHalfCheckIn) - new Date(firstHalfCheckOut)) / 60000:0); // Duration of the second half in minutes
        
        const workedMinutes = firstHalfDuration + secondHalfDuration; // Total worked minutes so far
        const remainingMinutes = totalWorkingTime - workedMinutes; // Remaining time in minutes
        
        const diffTime = new Date(body.transactionDate) - new Date(firstHalfCheckIn); // diifere time betwenn firstcheckin and untillnow time checkin in milliseconds
        const diffHours = (diffTime / 3600000).toFixed(2);
        const intNum = parseFloat(diffHours);

        if (firstHalfCheckIn && !firstHalfCheckOut && !secondHalfCheckIn && !secondHalfCheckOut) {
            const diffTimeInMinutes=diffTime/60000
            if (intNum >= 1 && intNum<=6 ) {
                return; // User has already checked in for more than an hour
            }else if(intNum>=6 && intNum<=9){
                const waitTime = totalWorkingTime - diffTimeInMinutes; // Calculate time left to wait
                const waitHours = Math.floor(waitTime / 60); // Full hours to wait
                const waitRemainingMinutes = waitTime % 60; // Remaining minutes to wait
                return apiResponse.validationError(response, `You can wait ${waitHours} hour(s) and ${waitRemainingMinutes} minute(s) to check out.`);
            }else if(intNum>=9){
                return
            }else{
                return apiResponse.validationError(response, 'Already Checked In');
            }
            
            
        } else if (firstHalfCheckIn && firstHalfCheckOut && !secondHalfCheckIn && !secondHalfCheckOut) {
            const diffTime = new Date(body.transactionDate) - new Date(firstHalfCheckOut);
            const difMinutes = (diffTime / 60000).toFixed(2);
            const intNum = parseFloat(difMinutes);
           
            if (intNum >= 30) return;
            return apiResponse.validationError(response, `You can wait ${30 - intNum} to second half Check In`);
        } else if (firstHalfCheckIn && firstHalfCheckOut && secondHalfCheckIn && !secondHalfCheckOut) {
            const diffTime = new Date(body.transactionDate) - new Date(secondHalfCheckIn);
            const difMinutes = (diffTime / 60000).toFixed(2);
            const intNum = parseFloat(difMinutes);
            
            // Remaining time to checkout
            const remainingToCheckout = remainingMinutes - intNum;
            // Convert remainingToCheckout to hours and minutes
            const hoursLeft = Math.floor(remainingToCheckout / 60);
            
            const minutesLeft = remainingToCheckout % 60;
            
            if (remainingToCheckout <= 0) {
                return 
            }
            return apiResponse.validationError(response, `Please  wait for  ${hoursLeft} hour(s) and ${minutesLeft} minute(s) to second half Checkout.`);
        } else if (firstHalfCheckIn && firstHalfCheckOut && secondHalfCheckIn && secondHalfCheckOut) {
            return apiResponse.validationError(response, 'Full Day Check In/Out Completed');
        }else if(firstHalfCheckIn && secondHalfCheckOut && intNum>=6){
            return apiResponse.validationError(response, 'Full Day Check In/Out Completed');
        }else{
            return apiResponse.validationError(response, 'Full Day Check In/Out Completed'); 
        }

    } catch (error) {
        console.log("...error...", error?.message);
        request.logger.error("Error while creating add Employee in employeeAttendance controller", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};


export const findExistingCheckIn = async (request, response, next) => {
    try {
        const existingCheckIn = await employeeAttendenceModel.findExistingCheckIn(request.body);
        // console.log("......existingCheckIn...",JSON.stringify(existingCheckIn))
        const existingData = existingCheckIn?.data[0];
        request.body.existingCheckInOutData = existingData;
        if(existingData?.shiftId) request.body.shiftId=existingData?.shiftId
        let message = [
            { key: "body", value: JSON.stringify(request.body) }
        ];

        // Send message to Kafka for processing (Create or Update)
        logger.info("attendance", message);
        // await kafka.sendMessage("attendance-update", message);

        return next();
    } catch (error) {
        logger.error("Error in findExistingCheckIn", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};

export const findExistingCheckInLog = async (request, response, next) => {
    try {
        if(!request.body.existingCheckInOutData) return next();

        const existingCheckInLog = await employeeAttendenceModel.findExistingCheckInLog(request.body);

        if(!existingCheckInLog || existingCheckInLog.data?.length <= 0 || existingCheckInLog.data[0]?.type == 'checkOut') return next();
        const existingData = existingCheckInLog?.data[0];
        request.body.existingCheckInOutLog = existingData;

        return next();
    } catch (error) {
        logger.error("Error in findExistingCheckInLogs", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};

//checking employee already checkin/chcekout
export const checkingEmployeeCheckIn=async(request,response,next)=>{
    try{
        // const existingCheckIn = await employeeAttendenceModel.findExistingCheckIn(request.body);


        // const existingData=existingCheckIn?.data 
        
        // request.body.existingCheckInOutData=existingData

        const checkInStatus=existingData?.session?.firstHalf?.checkIn?.status
        const transactionDate=moment(request.body.transactionDate)
            
            const shiftStartTime=moment(request.body.transactionDate).set(
                {
                    hour:parseInt(request.body.startTime.split(':')[0]),
                    minute:parseInt(request.body.startTime.split(':')[1]),
                    second:0,
                    millisecond:0
                }
            )

            let shiftEndTime=moment(request.body.transactionDate).set({
                hour:parseInt(request.body.endTime.split(':')[0]),
                minute:parseInt(request.body.endTime.split(':')[1]),
                second:0,
                millisecond:0
            })
            if (request.body.dayStatus) {
                // If dayStatus is true, increment shiftEndTime by one day
                shiftEndTime.add(1, 'days');
            }
            
            request.body.shiftStartTime=shiftStartTime.format();
            request.body.shiftEndTime=shiftEndTime.format();

          
        if(!checkInStatus &&(transactionDate.isBefore(shiftStartTime.clone().subtract(1,'hours')))){
            return apiResponse.validationError(response,'You can log in either one hour before  or On Time of your shift.')

        }else if (!checkInStatus &&transactionDate.isAfter(shiftEndTime)){
            return apiResponse.validationError(response,'You cannot log in after the end time of your shift.')
        }
        else if(!checkInStatus && transactionDate.isAfter(shiftEndTime.clone().subtract(4,'hours')) && transactionDate.isBefore(shiftEndTime)){
            return apiResponse.validationError(response,'You can log in  either Morning Shift Tmings or  Second half shift Timings.')
        }
        

        if(!checkInStatus){

            const addEmployeeStatus=await employeeAttendenceModel.addEmployee(request.body)

            return addEmployeeStatus.status
                ? apiResponse.successResponse(response, addEmployeeStatus?.message ?? 'Check-In Successfully')
                : apiResponse.validationError(response, addEmployeeStatus?.message ?? 'Check-In Failed');
        }else{
            
            const checkResult = checkInOutPredefinedConditions(existingData, response,request.body);

            if (checkResult) return; // Immediately return if there's an error response

            const updateStatus = await employeeAttendenceModel.updateEmployeeAttendenceData(request.body);

            return updateStatus.status
                ? apiResponse.successResponse(response, updateStatus?.message ?? 'Check In/Out Successfully')
                : apiResponse.validationError(response, 'Check-In already exists');
        }
    }catch(error){
        console.log("...error...",error?.message)
        request.logger.error("Error while creating add Employee in employeeAttendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}



// get emplyee attendence data based on branch/dept/desg/year/month
export const getEmployessAttendenceData=async(request,response,next)=>{
    
    try{
        const getData=await employeeAttendenceModel.getEmployessAttendenceData(request.body)
        return getData.status&&getData.data.length>=1
                ? apiResponse.successResponseWithData(response, getData?.message ?? 'Data Found Successfully',getData.data)
                : apiResponse.notFoundResponse(response, 'No Data Found');


    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error getEmployessAttendenceData in employeeAttendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}


// Check if shift exists
export const ifShiftExist = async (request, response, next) => {
    try {
        await employeeAttendenceModel.ifShiftExist(request.body)
        .then(result => {
            if (result.status) {
                request.body.shiftData = result.data;
                return next();
            }
        })
        .catch((error) => {
            logger.error("Error while generateTransactionLog in employeeAttendence controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        });
    } catch (error) {
        logger.error("Error while generateTransactionLog in employeeAttendence controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

// generate attendance log
export const generateTransactionLog = async (request, response, next) => {
    try {
        let shiftData = request.body.shiftData
        // const { date } = request.body;
        // const { startTime, endTime } = shiftData;

        // // Parse date, startTime, and endTime into moment objects
        // const transactionMoment = moment(date);
        // const startMoment = moment(date).set({
        //     hour: parseInt(startTime.split(':')[0]),
        //     minute: parseInt(startTime.split(':')[1]),
        //     second: 0,
        //     millisecond: 0
        // });
        // const endMoment = moment(date).set({
        //     hour: parseInt(endTime.split(':')[0]),
        //     minute: parseInt(endTime.split(':')[1]),
        //     second: 0,
        //     millisecond: 0
        // });

        // // Adjust endMoment if it crosses midnight
        // if (endMoment.isBefore(startMoment)) {
        //     endMoment.add(1, 'day');
        // }

        // // Check if transactionMoment is within the shift time range
        // if (!transactionMoment.isBetween(startMoment, endMoment, null, '[]')) {
        //     return apiResponse.validationError(response, 'Transaction date is not within the shift time range.');
        // }

        let approvalBits = {
            isTimeMatch : false,
            isLocationMatch : false,
            isBranchMatch : false,
            isShiftMatch : false,
            approvalStatus : null
        }

        if(request.body.extendAttendance) approvalBits['isExtended'] = attendanceApprovalStatus.pending

        const current = new Date(request.body.transactionDate);

        // check Time Match
        if (request.body.type == 'checkIn') {
            const maxInStart = new Date(request.body.nearestShift.shiftStart);
            if (request.body.nearestShift.maxIn) {
                const [maxInHours, maxInMinutes] = request.body.nearestShift.maxIn.split(':').map(Number);
                maxInStart.setHours(maxInHours, maxInMinutes, 59, 59);
            }
            if (current <= maxInStart) approvalBits['isTimeMatch'] = attendanceApprovalStatus.approved;
        }
        else if (request.body.type == 'checkOut' && request.body.existingCheckInOutData && (request.body.shift || request.body.branch)) {
            const endDate = new Date();
            const [hour, min] = request.body[request.body.existingCheckInOutData.workTimingType].endTime.split(':').map(Number)
            endDate.setHours(hour, min, 0, 0) 
            if (request.body[request.body.existingCheckInOutData.workTimingType].minOut) {
                const [minOutHours, minOutMinutes] = request.body[request.body.existingCheckInOutData.workTimingType].minOut.split(':').map(Number);
                endDate.setHours(minOutHours, minOutMinutes, 0, 0);
            }
            let difMls = current - new Date(request.body.existingCheckInOutData.transactionDate);
            let difHours = difMls /  (1000 * 60 * 60).toFixed(2);
            if (current >= endDate || difHours >= request.body.existingCheckInOutData.duration) approvalBits['isTimeMatch'] = attendanceApprovalStatus.approved;
        }

        //Check Location Match
        request.body.branchRadius = await branch.getBranchOne(request.body)
        request.body.branchDetails = await branch.isCheckinWithinBranch(request.body)

        //location match cases
        if((request.body.branchDetails.status && !request.body.existingCheckInOutData) || (request.body.branchDetails.status && request.body.existingCheckInOutData && request.body.existingCheckInOutData.branchId.toString() == request.body.branchId.toString())) approvalBits['isLocationMatch'] = attendanceApprovalStatus.approved;
    

        // if(request.body.existingCheckInOutLog) { // when check-out
        //     //Check Branch Match
        //     if(request.body.existingCheckInOutLog.branchId.toString() == request.body.branchId.toString()) approvalBits['isBranchMatch'] = attendanceApprovalStatus.approved;

        //     //Check Shift Match
        //     if(request.body.existingCheckInOutLog.shiftId.toString() == request.body.shiftId.toString()) approvalBits['isShiftMatch'] = attendanceApprovalStatus.approved;
        // }
        // else if(request.body.shiftByDate && request.body.shiftByDate.length > 0) { // when check-in

        //     let getShiftByDate = request.body.shiftByDate.find(sbd => sbd.currentShiftId.toString() == request.body.shiftId.toString());
        //     //Check Branch Match
        //     if ((getShiftByDate?.branchId?.toString() ?? getShiftByDate?.clientBranchId?.toString()) == request.body.branchId.toString()) approvalBits['isBranchMatch'] = attendanceApprovalStatus.approved;

        //     //Check Shift Match
        //     if (getShiftByDate.currentShiftId.toString() == request.body.shiftId.toString()) approvalBits['isShiftMatch'] = attendanceApprovalStatus.approved;

        //     //check only if client shift assigned
        //     if (getShiftByDate.clientBranchId && getShiftByDate.clientMappedId) {
        //         approvalBits['isClientMatch'] = getShiftByDate.clientBranchId.toString() == request.body.branchId.toString() ? attendanceApprovalStatus.approved : attendanceApprovalStatus.rejected;
        //     }
        // }
        // else if(request.body.shiftGroupDataListResponse) { // when check-in

        //     let shiftGroup = request.body.shiftGroupDataListResponse
        //     //Check Branch Match
        //     if ((shiftGroup?.branchId?.toString() ?? shiftGroup?.clientBranchId?.toString()) == request.body.branchId.toString()) approvalBits['isBranchMatch'] = attendanceApprovalStatus.approved;

        //     //Check Shift Match
        //     if (shiftGroup.currentShiftId.toString() == request.body.shiftId.toString()) approvalBits['isShiftMatch'] = attendanceApprovalStatus.approved;

        //     //check only if client shift assigned
        //     if (shiftGroup.clientBranchId && shiftGroup.clientMappedId) {
        //         approvalBits['isClientMatch'] = shiftGroup.clientBranchId.toString() == request.body.branchId.toString() ? attendanceApprovalStatus.approved : attendanceApprovalStatus.rejected;
        //     }
        // }

        let validationTypeData = ['existingCheckInOutLog','shiftByDate','shiftGroupDataListResponse']

        for (let i = 0; i < validationTypeData.length; i++) {
            const type = validationTypeData[i];
            if(request.body[type] && request.body[type]?.length) {
                let data;

                if(Array.isArray(request.body[type])) {
                    data = request.body[type].find(item => item.currentShiftId?.toString() == request.body.shiftId.toString() || item.shiftId?.toString() == request.body.shiftId.toString());
                }
                else {
                    data = request.body[type];
                }

                //Check Branch Match
                if ((data?.branchId?.toString() ?? data?.clientBranchId?.toString()) == request.body.branchId.toString()) approvalBits['isBranchMatch'] = attendanceApprovalStatus.approved;

                //Check Shift Match
                if ((data.currentShiftId?.toString() ?? data.shiftId?.toString()) == request.body.shiftId?.toString() || type == 'existingCheckInOutLog') approvalBits['isShiftMatch'] = attendanceApprovalStatus.approved;

            }
        }

        //overall approval status
        if(!Object.values(approvalBits).includes(false)) approvalBits['approvalStatus'] = attendanceApprovalStatus.approved;
        request.body.approvalBits = approvalBits;
        const getData = await employeeAttendenceModel.generateTransactionLog(request.body)
        if(getData.status){

            request.body.attendenceId =  getData.data.insertedId

            // const res_UpdateAttendanceApproval = await employeeAttendenceModel.updateAttendeceApproval(request.body)
            // const res_UpdateEmployeeAttendence = await employeeAttendenceModel.updateEmployeeAttendence(request.body)

            if(!request.body.existingCheckInOutData || !request.body.extendAttendance || request.body.type === 'checkOut')
            {
                request.body.checkExisting = await employeeAttendenceModel.getEmployeeStats(request.body)
                request.body.checkExistingDaily = await employeeAttendenceModel.getEmployeeStatsDaily(request.body)
                await employeeAttendenceModel.addEmployeeAttendenceStats2(request.body)
            }


            return next();
        }
    } catch (error) {
        logger.error("Error while generateTransactionLog in employeeAttendence controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

export const getMessage = async (request, response, next) => {
    try
    {
        let shiftData
        if(request.body.nearestShift)
            shiftData= request.body.nearestShift
        else if(request.body.assignedShift)
            shiftData = request.body.assignedShift
        else
        {
            const getShift = await shiftModel.getOneShift(request.body)
            if(getShift.status)
            {
                shiftData = getShift.data
            }
        }

        const { startTime, endTime, minIn, maxIn, minOut, maxOut } = shiftData;
        const loginDate = moment(request.body.transactionDate); // login/logout time

        const txnTime = moment(request.body.transactionDate);
        const expectedInTime = moment(txnTime.format('YYYY-MM-DD') + startTime, 'YYYY-MM-DD HH:mm'); 

        const diffTime = txnTime.diff(expectedInTime); // ms
        const intNum = parseFloat((diffTime / 60000).toFixed(2)); // in minutes

        // const expectedOutTime = moment(txnTime.format('YYYY-MM-DD') + endTime, 'YYYY-MM-DD HH:mm');
        // const earlyCheckOutMinutes = expectedOutTime.diff(txnTime, 'minutes'); // if > 0 = 
        const shiftEnd = moment(`${txnTime.format('YYYY-MM-DD')} ${endTime}`, 'YYYY-MM-DD HH:mm');
        const earlyCheckOutMinutes = txnTime.diff(shiftEnd, 'minutes');
        let message = '';
        let messageStatus = 0

        let minInDateTime = moment()
        let maxInDateTime = moment()
        minInDateTime = helper.setGraceTime(minInDateTime,startTime, minIn,0)
        maxInDateTime = helper.setGraceTime(maxInDateTime,startTime, maxIn,59)
        console.log(minInDateTime,maxInDateTime,);
        
        // Handle "In" (login)
        if(request.body.type === 'checkIn')
        {
            if (startTime) {
              if (loginDate.isBefore(minInDateTime)) {
                message = 'Early In'
                messageStatus = 1
              } else if (loginDate.isAfter(maxInDateTime)) {
                message = 'Late In';
                messageStatus = 2
              }else {
                message = 'On Time Check in';
                messageStatus = 3
              }
            }

        }
        else if(request.body.type === 'checkOut')
        {
            
            let minOutDateTime = moment()
            let maxOutDateTime = moment()
            minOutDateTime = helper.setGraceTime(minOutDateTime,endTime, minOut,0)
            maxOutDateTime = helper.setGraceTime(maxOutDateTime,endTime, maxOut,59)
            console.log(minInDateTime,maxInDateTime,minOutDateTime,maxOutDateTime);
            
            if (endTime) {
              if (loginDate.isBefore(minOutDateTime)) {
                message = 'Early Out'
                messageStatus = 4
              } else if (loginDate.isAfter(maxOutDateTime)) {
                message = 'Late Out';
                messageStatus = 5
              }else {
                message = 'On Time Check Out';
                messageStatus = 6
              }
            }
            
        }

        request.body.message = message;
        request.body.messageStatus = messageStatus;
        return next();
    } catch (error) {
        logger.error("Error while getMessage in employeeAttendence controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

// add attendance data
export const addAttendenceData = async (request, response, next) => {
    try {
        if(request.body.existingCheckInOutData && !request.body.extendAttendance)return next()
        await employeeAttendenceModel.addAttendenceData(request.body)
            .then((result) => {
                if (result.status) {
                    request.body.attendence = result.data;
                    request.body.employeeAttendenceId=result.data.insertedId
                    return next();
                }
            })
            .catch((error) => {
                logger.error("Error while addAttendenceData in employeeAttendence controller ", { stack: error.stack });
                return apiResponse.somethingResponse(response, error?.message)
            });
    } catch (error) {
        logger.error("Error while addAttendenceData in employeeAttendence controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}


// get attendence data of specific emplyee on date range
export const getAttendenceDataUserId=async(request,response,next)=>{
    try{
        const getData=await employeeAttendenceModel.getAttendenceDataUserId(request.body)
        console.log("....getData....",getData)
        return getData.status&&getData.data.length>=1
                ? apiResponse.successResponseWithData(response, getData?.message ?? 'Data Found Successfully',getData.data)
                : apiResponse.notFoundResponse(response, 'No Data Found');


    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error while getAttendenceDataUserId in employeeAttendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

//get attendence summary data by userid
export const getAttendanceSummaryDataByUserId=async(request,response,next)=>{
    try{
        const attendanceData = await employeeAttendenceModel.getAttendanceSummaryDataByUserId(request.body);

        if (attendanceData.status && attendanceData.data) {
        const formattedData = formatAttendanceResponse(attendanceData.data);
        return apiResponse.successResponseWithData(response, 'Data Found Successfully', formattedData);
        } else {
        return apiResponse.notFoundResponse(response, 'No Data Found');
        }

    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error while getAttendanceSummaryDataByUserId in employeeAttendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

// Utility Function to Format Response
// const formatAttendanceResponse = (attendanceData) => {
//     const response = {
//       employeeId: attendanceData.employeeId,
//       employeeName: attendanceData.employeeName,
//       orgId: attendanceData.orgId,
//       organisationName: attendanceData.organisationName,
//       branch: attendanceData.branch,
//       department: attendanceData.department,
//       designation: attendanceData.designation,
//       totalWorkingDays: attendanceData.attendance?.length || 0,
//       workingDays: 0,
//       absentDays: 0,
//       lateCheckIns: 0,
//       earlyCheckOuts: 0,
//       manualApprovedAttendance: 0,
//       absentDaysDetails: [],
//       lateCheckInDetails: [],
//       earlyCheckOutDetails: [],
//       manualApproveAttendanceDetails: [],
//       attendanceDetails: []
//     };
  
//     attendanceData.attendance.forEach(day => {
//       const attendanceDetail = {
//         date: day.date,
//         firstHalf: day.firstHalf,
//         secondHalf: day.secondHalf,
//         totalHoursWorked: day.totalHoursWorked,
//         wholeDayStatus: day.wholeDayStatus,
//         manualApproved: day.manualApproved
//       };
  
//       response.attendanceDetails.push(attendanceDetail);
  
//       // Absent day
//       if (day.wholeDayStatus === "Absent") {
//         response.absentDays++;
//         response.absentDaysDetails.push({
//           date: day.date,
//           reason: "No check-in or check-out recorded"
//         });
//       } else {
//         response.workingDays++;
//       }
  
//       // Late check-in
//       if (day.firstHalf?.checkIn > "10:30") {
//         response.lateCheckIns++;
//         response.lateCheckInDetails.push({
//           date: day.date,
//           checkInTime: day.firstHalf?.checkIn,
//           threshold: "10:30",
//           exceededBy: calculateTimeDifference("10:30", day.firstHalf?.checkIn)
//         });
//       }
  
//       // Early check-out
//       if (day.secondHalf?.checkOut < "19:00") {
//         response.earlyCheckOuts++;
//         response.earlyCheckOutDetails.push({
//           date: day.date,
//           checkOutTime: day.secondHalf?.checkOut,
//           threshold: "19:00",
//           earlyBy: calculateTimeDifference(day.secondHalf?.checkOut, "19:00")
//         });
//       }
  
//       // Manual approval
//       if (day.manualApproved) {
//         response.manualApprovedAttendance++;
//         response.manualApproveAttendanceDetails.push({
//           date: day.date,
//           approvedBy: "HR Manager",
//           approvalReason: "Late check-in due to network issues"
//         });
//       }
//     });
  
//     return response;
//   };

const formatAttendanceResponse = (attendanceData) => {
    const response = {
    employeeId: attendanceData.employeeId,
    employeeName: attendanceData.employeeName,
    orgId: attendanceData.orgId,
    organisationName: attendanceData.organisationName,
    branch: attendanceData.branch,
    department: attendanceData.department,
    designation: attendanceData.designation,
    totalWorkingDays: Array.isArray(attendanceData.attendance) ? attendanceData.attendance.length : 0,
    workingDays: 0,
    absentDays: 0,
    lateCheckIns: 0,
    earlyCheckOuts: 0,
    manualApprovedAttendance: 0,
    absentDaysDetails: [],
    lateCheckInDetails: [],
    earlyCheckOutDetails: [],
    manualApproveAttendanceDetails: [],
    attendanceDetails: []
    };

    // Ensure attendanceData.attendance is defined and is an array
    if (Array.isArray(attendanceData.attendance)) {
    attendanceData.attendance.forEach(day => {
        const attendanceDetail = {
        date: day.date,
        firstHalf: day.firstHalf,
        secondHalf: day.secondHalf,
        totalHoursWorked: day.totalHoursWorked,
        wholeDayStatus: day.wholeDayStatus,
        manualApproved: day.manualApproved
        };

        response.attendanceDetails.push(attendanceDetail);

        // Absent day
        if (day.wholeDayStatus === "Absent") {
        response.absentDays++;
        response.absentDaysDetails.push({
            date: day.date,
            reason: "No check-in or check-out recorded"
        });
        } else {
        response.workingDays++;
        }

        // Late check-in
        if (day.firstHalf?.checkIn > "10:30") {
        response.lateCheckIns++;
        response.lateCheckInDetails.push({
            date: day.date,
            checkInTime: day.firstHalf?.checkIn,
            threshold: "10:30",
            exceededBy: calculateTimeDifference("10:30", day.firstHalf?.checkIn)
        });
        }

        // Early check-out
        if (day.secondHalf?.checkOut < "19:00") {
        response.earlyCheckOuts++;
        response.earlyCheckOutDetails.push({
            date: day.date,
            checkOutTime: day.secondHalf?.checkOut,
            threshold: "19:00",
            earlyBy: calculateTimeDifference(day.secondHalf?.checkOut, "19:00")
        });
        }

        // Manual approval
        if (day.manualApproved) {
        response.manualApprovedAttendance++;
        response.manualApproveAttendanceDetails.push({
            date: day.date,
            approvedBy: "HR Manager",
            approvalReason: "Late check-in due to network issues"
        });
        }
    });
    } else {
    console.error("Attendance data is not an array or is undefined:", attendanceData.attendance);
    }

    return response;
};


  
export const getAttendanceDataRejected=async(request,response,next)=>{
    try{
        const getData=await employeeAttendenceModel.getAttendanceDataRejected(request.body)
        return getData.status&&getData.data.length>=1
                ? apiResponse.successResponseWithData(response, getData?.message ?? 'Data Found Successfully',getData.data)
                : apiResponse.notFoundResponse(response, 'No Data Found');

    }catch(error){
        console.log("....error....",error?.message)
        request.logger.error("Error while getAttendanceDataRejected in employeeAttendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}
  

export const getAttendanceDataRejectedUserId=async(request,response,next)=>{
    try{
        const getData=await employeeAttendenceModel.getAttendanceDataRejectedUserId(request.body)
        return getData.status&&getData.data.length>=1
                ? apiResponse.successResponseWithData(response, getData?.message ?? 'Data Found Successfully',getData.data)
                : apiResponse.notFoundResponse(response, 'No Data Found');

    }catch(error){
        console.log("....error....",error?.message)
        request.logger.error("Error while getAttendanceDataRejectedUserId in employeeAttendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}



// manually  approved attendnece data
export const approvedAttendenceDataManually=async(request,response,next)=>{
    try{
        const getDataResponse=await employeeAttendenceModel.approvedAttendenceDataManually(request.body)
        return getDataResponse.status
                ? apiResponse.successResponseWithData(response, getDataResponse?.message ?? 'Data approved/rejecetd Successfully',getDataResponse?.message)
                : apiResponse.notFoundResponse(response, 'Failed to upadte');

    }catch(error){
        console.log("....error....",error?.message)
        request.logger.error("Error while creating approvedAttendenceDataManually in employeeAttendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}


// Get branch-wise attendance data with percentages and employee count
export const getBranchWiseAttendanceData = async (request, response, next) => {
        try {
            
            // Call the model to get the attendance data
            const attendanceData = await employeeAttendenceModel.getBranchWiseAttendanceData(request.body);

            // Check if data exists and respond accordingly
            return attendanceData.status && attendanceData.data.length >= 1
                ? apiResponse.successResponseWithData(response, 'Attendance data found successfully', attendanceData.data)
                : apiResponse.notFoundResponse(response, 'No attendance data found for the given range');

        } catch (error) {
            console.log("Error in getBranchWiseAttendanceData: ", error?.message);
            request.logger.error("Error in fetching branch-wise attendance data", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message);
        }
};


// Get department-wise attendance data for a specific branch
export const getDepartmentWiseAttendanceData = async (request, response, next) => {
    try {
        // Call the model to get the department-wise attendance data
        const attendanceData = await employeeAttendenceModel.getDepartmentWiseAttendanceData(request.body);

        // Check if data exists and respond accordingly
        return attendanceData.status && attendanceData.data.length >= 1
            ? apiResponse.successResponseWithData(response, 'Department-wise attendance data found successfully', attendanceData.data)
            : apiResponse.notFoundResponse(response, 'No department-wise attendance data found for the given range');

    } catch (error) {
        console.log("Error in getDepartmentWiseAttendanceData: ", error?.message);
        request.logger.error("Error in fetching department-wise attendance data", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};

// Get designation-wise attendance data for a specific branch
export const getDesignationwiseAttendanceData = async (request, response, next) => {
    try {
        // Call the model to get the department-wise attendance data
        const attendanceData = await employeeAttendenceModel.getDesignationWiseAttendanceData(request.body);

        // Check if data exists and respond accordingly
        return attendanceData.status && attendanceData.data.length >= 1
            ? apiResponse.successResponseWithData(response, 'Designation-wise attendance data found successfully', attendanceData.data)
            : apiResponse.notFoundResponse(response, 'No designation-wise attendance data found for the given range');

    } catch (error) {
        console.log("Error in getDesignationWiseAttendanceData: ", error?.message);
        request.logger.error("Error in fetching designation-wise attendance data", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};

// Get designation-wise attendance data for a specific branch
export const getEmployeesSummaryAttendenceData = async (request, response, next) => {
    try {
        // Call the model to get the department-wise attendance data
        const attendanceData = await employeeAttendenceModel.getEmployeesSummaryAttendenceData(request.body);

        // Check if data exists and respond accordingly
        return attendanceData.status && attendanceData.data.length >= 1
            ? apiResponse.successResponseWithData(response, 'Employees Summary Attendence Data attendance data found successfully', attendanceData.data)
            : apiResponse.notFoundResponse(response, 'No  attendance data found for the given range');

    } catch (error) {
        console.log("Error in getEmployees Summary Attendence: ", error?.message);
        request.logger.error("Error in Error in getEmployees Summary Attendence", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};


// Get designation-wise attendance data for a specific branch
export const getEmployeeSummaryAttendenceDataUserId = async (request, response, next) => {
    try {
        // Call the model to get the department-wise attendance data
        const attendanceData = await employeeAttendenceModel.getEmployeeSummaryAttendenceDataUserId(request.body);

        // Check if data exists and respond accordingly
        return attendanceData.status && attendanceData.data.length >= 1
            ? apiResponse.successResponseWithData(response, 'Employee Summary Attendence Data attendance data found successfully', attendanceData.data)
            : apiResponse.notFoundResponse(response, 'No  attendance data found for the given range');

    } catch (error) {
        console.log("Error in getEmployee Summary Attendence On UserId: ", error?.message);
        request.logger.error("Error in fetching getEmployee Summary Attendence On UserId attendance data", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};

export const setImageToAws = async (request,response,next) => {
    try{
        const { imagePath} = request.files;
        const {employeeId} = request.body
        const result = await indexUserFace(imagePath,employeeId);
        return apiResponse.successResponse(response,result)
    }catch(error){
        request.logger.error("Error while setImageToAws in attendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)  
    }
}


export const searchUserByFace = async (request,response,next) => {
    try{
        const { imagePath} = request.files;
        //const {employeeId} = request.body
        const result = await searchUserFace(imagePath);
    
        if(!result){
            return apiResponse.somethingResponse(response,"Unable to find user")
        }
        request.body.userId = result.Face.ExternalImageId
        return next();
    }catch(error){
        request.logger.error("Error while setImageToAws in attendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)  
    }
};


/**
 * get single current day attendence data of logdin user.
 */
export const getSingleCurrentDayAttendence = async (request,response,next) => {
    try{
        const result = await employeeAttendenceModel.getAttendanceDetails(request.body);
        if(!result.data.length){
            request.body.attendanceDetails = {status:false}
            return next();
        }
        request.body.data.attendanceDetails = result;
        return next();
    }catch(error){
        request.logger.error("Error while getSingleCurrentDayAttendence in attendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
};

/**get attendance details */
export const getaAttendanceDetails = async (request,response,next) => {
    try{
        request.body.orgId = request.body.user.orgId;
        const result = await employeeAttendenceModel.listAttendence(request.body);
        // if(!result.data.length){
        //     request.body.attendanceDetails = {status:false}
        //     return next();
        // }
        request.body.attendanceDetails = result;
        return next();
    }catch(error){
        request.logger.error("Error while getaAttendanceDetails in attendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
};

export const getLatestAttendanceLogs = async (request,response,next) => {
    try{
        const result = await employeeAttendenceModel.getLatestAttendanceLogs(request.body);
        if(!result.status) throw {}

        if(result.data[0].type != 'checkIn' && request.body.extendAttendance) return apiResponse.validationError(response, 'User Already Checked-Out.');
        request.body.latestAttendanceData = result.data[0] || {};
        return next();  
    }catch(error){
        request.logger.error("Error while getAttendanceLogs in attendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
}

export const defaultCheckOut = async (request,response,next) => {
    try{

        const result = await employeeAttendenceModel.generateTransactionLog(request.body);
        if(!result.status) throw {}

        request.body.attendenceId =  result.data.insertedId
        let message = [
         { key: "body", value: JSON.stringify(request.body) }
        ]
        // Send message to Kafka for processing attendance stats
        logger.info("attendanceApprovals", message);
        // await kafka.sendMessage("attendance-approvals", message);

        const resUpdateAttendanceApproval = await employeeAttendenceModel.updateAttendeceApproval(request.body)
        const resUpdateEmployeeAttendence = await employeeAttendenceModel.updateEmployeeAttendence(request.body)
        return next();  
    }catch(error){
        request.logger.error("Error while getAttendanceLogs in attendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
}

export const updateStatus = async (request,response,next) => {
    try{
        const result = await employeeAttendenceModel.updateStatus(request.body);
        if(!result.status) throw {}

        return next();  
    }catch(error){
        request.logger.error("Error while updateStatus in attendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
}

export const getAttendanceLogs = async (request,response,next) => {
    try{
        const result = await employeeAttendenceModel.getAttendanceLogs(request.body);
        if(!result.status) throw {}

        let total = {workingSec : 0, breakSec :0}
        let date = new Date(request.body.date)
        for (const item of result.data) {
            let workingSeconds = 0
            let breakSeconds = 0
            let prevCheckIn = null
            let prevCheckOut = null
            // const firstTransaction = item.transactions[0];
            // if(firstTransaction.isTimeMatch!=null&&firstTransaction.isLocationMatch!=null&&firstTransaction.isBranchMatch!=null&&firstTransaction.isShiftMatch!=null){
            //     item.shiftLogsTimeMatch=true
            //     item.shiftLogsLocationMatch=true
            //     item.shiftLogsBranchMatch=true
            //     item.shiftLogsShiftMatch=true
            // }else{

            // }
            let {adjustedShiftStart, adjustedShiftEnd} = helper.getShiftDates(item, date)

            approvalBits.forEach(bit => {
                const allTrue = item.transactions.every(transaction => transaction[bit] === true);

                // if(request.body.shiftTimeValidation)
                if (date >= adjustedShiftEnd || (moment(date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) || item.transactions[item.transactions.length - 1].type === 'checkOut') {
                    if (allTrue) {
                        item[bit] = true;
                    } else if (bit == 'isClientMatch') {
                        {
                            const someHasClientMatchField = item.transactions.some(obj => 'isClientMatch' in obj);
                            if (someHasClientMatchField) {
                                item[bit] = false;
                            }
                            // else: do nothing (leave item[bit] unchanged)
                        }
                    }
                    else if (bit == 'isExtended') {
                        const someHasExtendedField = item.transactions.some(obj => 'isExtended' in obj);
                        if (someHasExtendedField) {
                            item[bit] = false;
                        }
                        // else: do nothing (leave item[bit] unchanged)
                    }
                    else if (bit == 'isTimeMatch') {
                        if (item.transactions[0].isTimeMatch && item.transactions[item.transactions.length - 1].type === 'checkOut' && item.transactions[item.transactions.length - 1].isTimeMatch) {
                            item[bit] = true;
                        }
                        else item[bit] = false;
                    }
                    else {
                        item[bit] = false;
                    }
                    item['action'] = true
                }
                // else {
                //     item['shiftEndError']  = "Shift not ended yet"
                // }
            });
            
            // let assignedShiftIds = request.body.currentShifts.reduce((acc, obj) => {
            //     acc[obj._id.toString()] = obj

            //     return acc;
            // }, {});

            // item['shiftAssigned'] = assignedShiftIds[item.shiftId] ? {} 
            
            for(const transaction of item.transactions) {
                if(transaction.approvalStatus != true) {
                    item.approvalStatus = attendanceApprovalStatusBits[transaction.approvalStatus] || "Pending";
                    item.approvalStatusError = item.approvalStatus;
                }
                if(transaction.approvalStatus == true && !item.approvalStatusError){
                    item.approvalStatus = "Approved";
                }
                if(transaction.hasOwnProperty("isExtended")) {
                    transaction['isExtended'] = true
                    delete transaction.extendApproveStatus
                }
                if(transaction.type === 'checkIn') {
                    if(prevCheckOut) {
                        // Calculate break time
                        const diffMs = moment(transaction.transactionDate).diff(moment(prevCheckOut));
                        breakSeconds += diffMs;
                        total['breakSec'] += diffMs
                    }
                    prevCheckIn = transaction.transactionDate;
                }
                if(transaction.type === 'checkOut') {
                    if(prevCheckIn) {
                        // Calculate working hours
                        const diffMs = moment(transaction.transactionDate).diff(moment(prevCheckIn));
                        workingSeconds += diffMs;
                        total['workingSec'] += diffMs
                    }
                    prevCheckOut = transaction.transactionDate;
                }
                // if(transaction.isTimeMatch===false || transaction.isTimeMatch==null)item.shiftLogsTimeMatch=false
                // if(transaction.isLocationMatch===false ||  transaction.isLocationMatch==null)item.shiftLogsLocationMatch=false
                // if(transaction.isBranchMatch===false ||  transaction.isBranchMatch==null)item.shiftLogsBranchMatch=false
                // if(transaction.isShiftMatch===false ||  transaction.isShiftMatch==null)item.shiftLogsShiftMatch=false
            }
            item.approvalStatus = item.approvalStatus
            if(prevCheckOut < prevCheckIn) {
                item.approvalStatusError = "Check Out is missing!"
                item.approvalStatus = "Error"
            }
            item.workingHours = helper.calcuateTime(workingSeconds);
            item.breakMinutes = helper.calcuateTime(breakSeconds); // Store break minutes
            // delete item.transactions
        }

        result['work'] = helper.calcuateTime(total['workingSec']);
        result['break'] = helper.calcuateTime(total['breakSec']);
        result.data = result.data.sort((a,b) => b.transactionDate - a.transactionDate);
        request.body.data = result
        return next();  
    }catch(error){
        request.logger.error("Error while getAttendanceLogs in attendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
}

export const getAllUserLogStatus = async (request,response,next) => {
    try{
        const result = await employeeAttendenceModel.getAllUserLogStatus(request.body);
        if(!result.status) throw {}
        for (let us of result.data) {
            let workingSeconds = 0
            let breakSeconds = 0
            let prevCheckIn = null
            let prevCheckOut = null
            let shifts = []

            // if(us.approvalStatus && us.transactions.length % 2 != 0) us['approvalStatus'] = 'pending';
            
            for(const transaction of us.transactions) {
                // console.log(transaction.shiftId.toString())
                if(!shifts.includes(transaction.shiftId.toString())) shifts.push(transaction.shiftId.toString())
                if(transaction.type === 'checkIn') {
                    if(prevCheckOut) {
                        // Calculate break time
                        const diffMs = moment(transaction.transactionDate).diff(moment(prevCheckOut));
                        breakSeconds += diffMs;
                    }
                    prevCheckIn = transaction.transactionDate;
                }
                if(transaction.type === 'checkOut') {
                    if(prevCheckIn) {
                        // Calculate working hours
                        const diffMs = moment(transaction.transactionDate).diff(moment(prevCheckIn));
                        workingSeconds += diffMs;
                    }
                    prevCheckOut = transaction.transactionDate;
                }
            }
            // us.approvalStatus = us.approvalStatus
            us.workingHours = helper.calcuateTime(workingSeconds);
            us.breakMinutes = helper.calcuateTime(breakSeconds); // Store break minutes
            // console.log(request.body.allUsers[us.userId.toString()].name)
            us['name'] = request.body.allUsers[us.userId.toString()]?.name
            us['noOfShifts'] = shifts.length
        }
        result.totalRecord = result.data.length;
        result.data = result.data.sort((a,b) => b.transactionDate - a.transactionDate);
        request.body.data = result
        return next();  
    }catch(error){
        request.logger.error("Error while getAttendanceLogs in attendence controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
}


// get all user wise statistics
export const getAllEmployeeAttendenceStats = async (request, response, next) => {
    try
    {
        const getData = await employeeAttendenceModel.getAllUsersAttendenceStats(request.body)
        if (getData.status) {
            getData.data = getData.data.map(item => {
                const {workingDays,monthDays} = helper.getWorkingDaysTillToday(item.year, item.month);
                const present = item.presentDays || 0;
                const absent = Math.max(item.workingDays - present, 0);
                
                return {
                  ...item,
                  monthName:moment().month(item.month - 1).format('MMMM'),
                  monthDays,
                  lateIn:item.lateIn ?? 0,
                  weekOff: Math.max(monthDays - item.workingDays, 0),
                  absentDays: absent
                };
              });
            return apiResponse.successResponseWithData(response, 'Data Found Successfully', {totalRecord:getData.totalRecord,next_page:getData.next_page,data:getData.data})
        } else {
            return apiResponse.notFoundResponse(response, 'No Data Found');
        }

    }
    catch (error) {
        console.error("Error in getEmployeeAttendenceStats:", error.message)
        return apiResponse.ErrorResponse(response, error.message)
    }
}


export const userAttendanceTransactions= async (request, response, next) => {
    try
    {
        const getData = await employeeAttendenceModel.getUserMonthAttendenceLogs(request.body)
        if (getData.status) {
            for (const item of getData.data) {
                let workingSeconds = 0
                let breakSeconds = 0
                let prevCheckIn = null
                let prevCheckOut = null
                
                for(const transaction of item.transactions) {
                    if(transaction.approvalStatus != true) {
                        item.approvalStatus = attendanceApprovalStatusBits[transaction.approvalStatus] || "Pending";
                        item.approvalStatusError = item.approvalStatus;
                    }
                    if(transaction.approvalStatus == true && !item.approvalStatusError){
                        item.approvalStatus = "Approved";
                    }
                    if(transaction.type === 'checkIn') {
                        if(prevCheckOut) {
                            // Calculate break time
                            const diffMs = moment(transaction.transactionDate).diff(moment(prevCheckOut));
                            breakSeconds += diffMs;
                        }
                        prevCheckIn = transaction.transactionDate;
                    }
                    if(transaction.type === 'checkOut') {
                        if(prevCheckIn) {
                            // Calculate working hours
                            const diffMs = moment(transaction.transactionDate).diff(moment(prevCheckIn));
                            workingSeconds += diffMs;
                        }
                        prevCheckOut = transaction.transactionDate;
                    }
                }
                item.approvalStatus = item.approvalStatus
                if(prevCheckOut < prevCheckIn) {
                    item.approvalStatusError = "Check Out is missing!"
                    item.approvalStatus = "Error"
                }

                item.workingHours = helper.calcuateTime(workingSeconds);
                item.breakMinutes = helper.calcuateTime(breakSeconds); // Store break minutes
                delete item.transactions
            }
            // console.log("getData.data", getData)
            // request.body.result = {
            //     totalRecord: request.body.totalRecord,
            //     next_page: request.body.next_page,
            //     data: getData.data
            // };
            // return next()
            return apiResponse.successResponseWithData(response, 'Data Found Successfully', getData)
        } else {
            return apiResponse.notFoundResponse(response, 'No Data Found');
        }

    }
    catch (error) {
        console.error("Error in getEmployeeAttendenceStats:", error.message)
        return apiResponse.ErrorResponse(response, error.message)
    }
}


//dahsboard status
export const dashboardStatus= async (request, response, next) => {
    try 
    {
        // if (!request.body.existingCheckInOutData?.shiftId) {
        //     request.body.dashboardStatus = 'false'
        //     request.body.checkNearestShift=false
        //     // request.body.transactionDate=undefined
        //     return next()
        // }
        const getData = await employeeAttendenceModel.getUserAttendenceDashboardStatus(request.body)
        if (getData.status&& getData.data.length>=1) {
            const index=getData.data.length
            request.body.type=getData.data[index-1].type === 'checkIn'
            request.body.shiftId=getData.data[index-1].shiftId
            return next()
            // return apiResponse.successResponseWithData(response, 'Data Found Successfully', getData)
        } else {
            // return apiResponse.notFoundResponse(response, 'No Data Found');
            request.body.dashboardStatus='false'
            // request.body.checkNearestShift=true
            request.body.transactionDate=undefined
            return next()

        }

    }
    catch (error) {
        console.error("Error in getEmployeeAttendenceStats:", error.message)
        return apiResponse.ErrorResponse(response, error.message)
    }
}


export const getLatestAttendenceDoc=async(request,response,next)=>{
    try {
        const existingCheckIn = await employeeAttendenceModel.getExistingCheckInShiftId(request.body);
        if(!existingCheckIn.status) throw {}
        const existingData = existingCheckIn?.data;
        request.body.existingCheckInOutData = existingData;
        if (existingData?.shiftId) request.body.shiftId = existingData?.shiftId;
        return next();
    } catch (error) {
        logger.error("Error while getLatestAttendenceDoc in attendence controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const validateCheckInOutSequence = async (request, response, next) => {
    try {
      const { user, shiftId, transactionDate, type } = request.body;
      if (!user || !user._id || !shiftId) {
        return apiResponse.validationError(response, "Missing user or shift information.");
      }
  
      const txnDate = new Date(transactionDate);
      const shiftStart = moment(txnDate).startOf('day').toDate();
      const shiftEnd = moment(txnDate).endOf('day').toDate();
  
      const logsResult = await employeeAttendenceModel.getAttendanceLogs({
        ...request.body,
        user,
        shiftId,
        date: moment(transactionDate).format("YYYY-MM-DD"),
        limit: 1000,
        sortBy: "transactionDate",
        sortOrder: 1,
      });
      const logs = logsResult.data;
  
      let lastType = null;
      for (const log of logs) {
        if (log.type === 'checkIn') {
          if (lastType === 'checkIn') {
            return apiResponse.validationError(response, "Multiple check-ins without a check-out.");
          }
          lastType = 'checkIn';
        } else if (log.type === 'checkOut') {
          if (lastType !== 'checkIn') {
            return apiResponse.validationError(response, "Check-out without a prior check-in.");
          }
          lastType = 'checkOut';
        }
      }
  
      if (type === 'checkIn' && lastType === 'checkIn') {
        return apiResponse.validationError(response, "Cannot check-in again without checking out.");
      }
  
      if (type === 'checkOut' && lastType !== 'checkIn') {
        return apiResponse.validationError(response, "Cannot check-out without a valid check-in.");
      }
  
      return next();
    } catch (error) {
      logger.error("Error in validateCheckInOutSequence:", { stack: error.stack });
      return apiResponse.somethingResponse(response, error?.message);
    }
  };


  export const addEmployeeAttendenceStats = async (request, response, next) => {
    try {
        
        
        const addStats = await employeeAttendenceModel.addEmployeeAttendenceStats2(request.body);
        
        if (addStats.status) {
            return next();
        } else {
            return apiResponse.validationError(response, 'Failed to add attendance stats');
        }
    } catch (error) {
        logger.error("Error in addEmployeeAttendenceStats:", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
}


// get nearest client branch location
export const getNearestClientBranchLocation=(request,response,next)=>{
    try{
        branch.getNearestLocationBranch(request.body).then((result) => {
            if (result.status) {
                const branch = result.data[0];
                if(branch.client){
                    request.body.clientMappedId = branch.orgId;
                    request.body.isClientBranchMatched = true
                }
                request.body.nearestBranchDetails = branch;
                request.body.branchId = branch._id;
                request.body.isWithinRadius=branch.isWithinRadius;
                request.body.distanceAway = branch.outsideBy
                request.body.branchRadius = branch.radius;

                request.body.branch = request.body.nearestBranchDetails  // to dyanimically set branch or shift timing
                //for branch validation with attendance
                request.body.matchedAssignment = request.body.assignmentDetails?.find(assignment => assignment.branchId.toString() === branch._id.toString());
                
                return next();
            } else {
                // return apiResponse.validationError(response, 'Failed to get nearest branch location');
                request.body.isMisMatchLocation = true
                return next()
            }
        }).catch((error) => {
            logger.error("Error in getNearestClientBranchLocation:", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message);
        })
        ;

    }catch (error) {
        logger.error("Error in addEmployeeAttendenceStats:", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
}

export const getAllUserAttendance = async (request, response, next) => {
    try {
        if(!request.body.attendanceStatus) return next()

        const getData = await employeeAttendenceModel.getAllUserAttendance(request.body);
        if (getData.status) {

            request.body.allUserAttendance = {}
            let result = request.body.allUserAttendance

            for (const item of getData.data) {

                if (item.data[0].type === 'checkIn') item.data = item.data.filter(d => d.type != 'checkOut'); //if the latest log is checkIn, i don't need previous checkout

                result[item._id] = item.data.reduce((acc, curr) => {
                    acc[curr.type] = {logId : curr._id, transactionDate:curr.transactionDate}
                    return acc;
                }, {})

            }

            return next()
        } else {
            return apiResponse.notFoundResponse(response, 'No Data Found');
        }
    } catch (error) {
        console.error("Error in getAllUserAttendance:", error.message)
        return apiResponse.ErrorResponse(response, error.message)
    }
}


export const isAuthorized=(request,response,next)=>{
    try{
        user.isAuthorizedUserBranch(request.body).then((res) => {
            if (res.status) {
                const result=res.data[0]
                request.body.isAuthorized=result.isAuthorized || false;
                return next();
            } else {
                // return apiResponse.validationError(response, 'Failed to get nearest branch location');
                request.body.isAuthorized=false
                return next()
            }
        }).catch((error) => {
            logger.error("Error in isAuthorized in Attendence controller:", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message);
        })
    
    }catch (error) {
        logger.error("Error in isAuthorized in Attendence controller:", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
}


export const getEmployeeAttendenceTotalLogs=(request,response,next)=>{
    try{
        employeeAttendenceModel.getAttendencTotalLogsCount(request.body).then((result) => {
            if (result.status) {
                const page= Number(request.body.page) || 1;
                const limit=Number(request.body.limit) || 10;
                request.body.attendanceTotalLogs = result.data;
                request.body.totalRecord=result.data[0]?.count || 0;
                // request.body.next_page=totalRecord > Number(page) * Number(limit) ? true : false
                request.body.next_page = request.body.totalRecord > page * limit;
                return next();
            } else {
                return apiResponse.notFoundResponse(response, 'No Data Found');
            }
        }).catch((error) => {
            logger.error("Error in getEmployeeAttendenceTotalLogs in Attendence controller:", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message);
        });

    }catch (error) {
        logger.error("Error in getEmployeeAttendenceTotalLogs in Attendence controller:", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
}

export const getLogById=(request,response,next)=>{
    try{
        employeeAttendenceModel.getLogById(request.body).then((result) => {
            if (result.status) {
                request.body.shiftId = result.data.shiftId
                request.body.clientMappedId = result.data.clientMappedId
                request.body.branchId = result.data.branchId
                request.body.logData = result.data
                return next();
            } else {
                return apiResponse.notFoundResponse(response, 'No Data Found');
            }
        }).catch((error) => {
            logger.error("Error in getLogById in Attendence controller:", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message);
        });

    }catch (error) {
        logger.error("Error in getLogById in Attendence controller:", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
}


export const approveRejectAttendenceLogs=(request,response,next)=>{
    try{
        const inputDate = new Date(request.body.transactionDate);
        const today = new Date();

        // Zero out hours, minutes, seconds, milliseconds for both
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (inputDate > today) {
            return apiResponse.validationError(response, 'date cannot be in the future');
        }
        if(!request.body.user.owner===true)return apiResponse.validationError(response, 'You are not authorized,admin role can update approve/reject attendance');
        const hasValidEmployeeAttendanceId = request.body.existingCheckInOutData?._id != null;
        if(!hasValidEmployeeAttendanceId)return apiResponse.notFoundResponse(response, 'No Attendence Data found on this date');
        employeeAttendenceModel.updateApproveRejectAttendenceLogs(request.body).then((result) => {
            if (result.status) {
                return next();
            } else {
                return apiResponse.validationError(response, 'failed to update approve/reject');
            }
        }).catch((error) => {
            logger.error("Error in approveRejectAttendenceLogs in Attendence controller:", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message);
        });
    }catch (error) {
        logger.error("Error in approveRejectAttendenceLogs in Attendence controller:", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
}
  
export const setAssignedShift = async(request,response,next) => {
    try {
        request.body.shiftGroupDataListResponse = request.body.shiftGroupDataListResponse.find(sg => sg.employeeId.toString() == request.body.userId.toString())

        // shift roasters
        let mergedData = [...request.body.shiftByDate]

        // shift groups
        if(request.body.shiftGroupDataListResponse && request.body.shiftGroupDataListResponse.length > 0) mergedData.push(request.body.shiftGroupDataListResponse)

        // client requirements based shifts
        if(!mergedData.length && request.body.shiftIdsFromRequirement && request.body.shiftIdsFromRequirement?.length > 0) mergedData = request.body.shiftIdsFromRequirement.map(id => ({currentShiftId: id}))
        
        // user assigned shifts
        if(!mergedData.length && request.body.user.shiftIds && request.body.user.shiftIds?.length > 0) mergedData = request.body.user.shiftIds.map(id => ({currentShiftId: id}))

        request.body.mergedData = mergedData;
        // console.log("mergedData", mergedData);
        return next();
    } catch (error) {
        logger.error("Error in setAssignedShift:", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
}
