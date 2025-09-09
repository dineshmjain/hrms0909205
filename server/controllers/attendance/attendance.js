import { request, response } from 'express';
import * as apiResponse from '../../helper/apiResponse.js';
import * as employeeAttendanceModel from '../../models/attendence/attendence.js'
import * as shiftModel from '../../models/shift/shift.js'
import * as userModel from '../../models/user/user.js';
import moment from 'moment';
import * as momentzone from 'moment-timezone'
import {indexUserFace ,searchUserFace} from "../../config/aws.js"
import { logger } from '../../helper/logger.js';
import { KafkaService } from '../../utils/kafka/kafka.js';

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
            request.body.checkNearestShift = false
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
                if (!checkInTime.isBetween(minOutTime, maxOutTime, null, '[]')) {
                    request.body.checkNearestShift = true
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
            return next()
        }
    } catch (error) {
        console.error("Error in checkingEmployeeCurrentShift:", error.message)
        return apiResponse.ErrorResponse(response, error.message)
    }
}

export const getEmployeeNearestShift = async (request, response, next) => {
    try 
    {
        if(request.body.checkNearestShift || !request?.body?.transactionDate)
        {
            const result = await userModel.getEmployeeNearestShift(request.body)
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

export const getEmployeeAttendanceStats = async (request, response, next) => {
    try
    {
        const getData = await employeeAttendanceModel.getEmployeeAttendanceStats(request.body)
        if (getData.status) {
            return apiResponse.successResponseWithData(response, 'Data Found Successfully', getData.data)
        } else {
            return apiResponse.notFoundResponse(response, 'No Data Found');
        }

    }
    catch (error) {
        console.error("Error in getEmployeeAttendanceStats:", error.message)
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
        const existingCheckIn = await employeeAttendanceModel.findExistingCheckIn(request.body);
        const existingData = existingCheckIn?.data;
        request.body.existingCheckInOutData = existingData;
        if(existingData?.shiftId) request.body.shiftId=existingData?.shiftId
        let message = [
            { key: "body", value: JSON.stringify(request.body) }
        ];

        // Send message to Kafka for processing (Create or Update)
        logger.info("attendance", message);
        await kafka.sendMessage("attendance-update", message);

        return next();
    } catch (error) {
        logger.error("Error in findExistingCheckIn", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};

//checking employee already checkin/chcekout
export const checkingEmployeeCheckIn=async(request,response,next)=>{
    try{
        // const existingCheckIn = await employeeAttendanceModel.findExistingCheckIn(request.body);


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

            const addEmployeeStatus=await employeeAttendanceModel.addEmployee(request.body)

            return addEmployeeStatus.status
                ? apiResponse.successResponse(response, addEmployeeStatus?.message ?? 'Check-In Successfully')
                : apiResponse.validationError(response, addEmployeeStatus?.message ?? 'Check-In Failed');
        }else{
            
            const checkResult = checkInOutPredefinedConditions(existingData, response,request.body);

            if (checkResult) return; // Immediately return if there's an error response

            const updateStatus = await employeeAttendanceModel.updateEmployeeAttendanceData(request.body);

            return updateStatus.status
                ? apiResponse.successResponse(response, updateStatus?.message ?? 'Check In/Out Successfully')
                : apiResponse.validationError(response, 'Check-In already exists');
        }
    }catch(error){
        console.log("...error...",error?.message)
        request.logger.error("Error while creating add Employee in employeeAttendance controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}



// get emplyee attendance data based on branch/dept/desg/year/month
export const getEmployessAttendanceData=async(request,response,next)=>{
    
    try{
        const getData=await employeeAttendanceModel.getEmployessAttendanceData(request.body)
        return getData.status&&getData.data.length>=1
                ? apiResponse.successResponseWithData(response, getData?.message ?? 'Data Found Successfully',getData.data)
                : apiResponse.notFoundResponse(response, 'No Data Found');


    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error getEmployessAttendanceData in employeeAttendance controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}


// Check if shift exists
export const ifShiftExist = async (request, response, next) => {
    try {
        await employeeAttendanceModel.ifShiftExist(request.body)
        .then(result => {
            if (result.status) {
                request.body.shiftData = result.data;
                return next();
            }
        })
        .catch((error) => {
            logger.error("Error while generateTransactionLog in employeeAttendance controller ", { stack: error.stack });
            return apiResponse.somethingResponse(response, error?.message)
        });
    } catch (error) {
        logger.error("Error while generateTransactionLog in employeeAttendance controller ", { stack: error.stack });
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
        const getData = await employeeAttendanceModel.generateTransactionLog(request.body)
        if(getData.status){

            let message = [
             { key: "body", value: JSON.stringify(request.body) }
            ]
            // Send message to Kafka for processing attendance stats
            logger.info("attendanceStats", message);
            await kafka.sendMessage("attendance-stats", message);

            return next();
        }
    } catch (error) {
        logger.error("Error while generateTransactionLog in employeeAttendance controller ", { stack: error.stack });
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

        let message = '';
        let messageStatus = 0

        // Handle "In" (login)
        if(request.body.type === 'checkIn')
        {
            if (startTime) {
              const shiftStart = moment(startTime, 'HH:mm');
            
              if (minIn && loginDate.isBefore(moment(minIn, 'HH:mm'))) {
                message = 'Early In'
                messageStatus = 1
              } else if (maxIn && loginDate.isAfter(moment(maxIn, 'HH:mm'))) {
                message = 'Late In';
                messageStatus = 2
              } else if (
                (!minIn || loginDate.isSameOrAfter(moment(minIn, 'HH:mm'))) &&
                (!maxIn || loginDate.isSameOrBefore(moment(maxIn, 'HH:mm')))
              ) {
                message = 'On Time Check in';
                messageStatus = 3
              }
            }

        }
        else if(request.body.type === 'checkOut')
        {
            // Handle "Out" (logout)
            if (endTime) {
              const shiftEnd = moment(endTime, 'HH:mm');
            
              if (minOut && loginDate.isBefore(moment(minOut, 'HH:mm'))) {
                message = 'Early Out';
                messageStatus = 4
              } else if (maxOut && loginDate.isAfter(moment(maxOut, 'HH:mm'))) {
                message = 'Late Out';
                messageStatus = 5
              } else if (
                (!minOut || loginDate.isSameOrAfter(moment(minOut, 'HH:mm'))) &&
                (!maxOut || loginDate.isSameOrBefore(moment(maxOut, 'HH:mm')))
              ) {
                message = 'On Time CheckOut';
                messageStatus = 6
              }
            }
        }

        request.body.message = message;
        request.body.messageStatus = messageStatus;
        return next();
    } catch (error) {
        logger.error("Error while getMessage in employeeAttendance controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

// add attendance data
export const addAttendanceData = async (request, response, next) => {
    try {
        await employeeAttendanceModel.addAttendanceData(request.body)
            .then((result) => {
                if (result.status) {
                    request.body.attendance = result.data;
                    return next();
                }
            })
            .catch((error) => {
                logger.error("Error while addAttendanceData in employeeAttendance controller ", { stack: error.stack });
                return apiResponse.somethingResponse(response, error?.message)
            });
    } catch (error) {
        logger.error("Error while addAttendanceData in employeeAttendance controller ", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}


// get attendance data of specific emplyee on date range
export const getAttendanceDataUserId=async(request,response,next)=>{
    try{
        const getData=await employeeAttendanceModel.getAttendanceDataUserId(request.body)
        console.log("....getData....",getData)
        return getData.status&&getData.data.length>=1
                ? apiResponse.successResponseWithData(response, getData?.message ?? 'Data Found Successfully',getData.data)
                : apiResponse.notFoundResponse(response, 'No Data Found');


    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error while getAttendanceDataUserId in employeeAttendance controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

//get attendance summary data by userid
export const getAttendanceSummaryDataByUserId=async(request,response,next)=>{
    try{
        const attendanceData = await employeeAttendanceModel.getAttendanceSummaryDataByUserId(request.body);

        if (attendanceData.status && attendanceData.data) {
        const formattedData = formatAttendanceResponse(attendanceData.data);
        return apiResponse.successResponseWithData(response, 'Data Found Successfully', formattedData);
        } else {
        return apiResponse.notFoundResponse(response, 'No Data Found');
        }

    }catch(error){
        console.log("..error......",error?.message)
        request.logger.error("Error while getAttendanceSummaryDataByUserId in employeeAttendance controller ",{ stack: error.stack });
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
        const getData=await employeeAttendanceModel.getAttendanceDataRejected(request.body)
        return getData.status&&getData.data.length>=1
                ? apiResponse.successResponseWithData(response, getData?.message ?? 'Data Found Successfully',getData.data)
                : apiResponse.notFoundResponse(response, 'No Data Found');

    }catch(error){
        console.log("....error....",error?.message)
        request.logger.error("Error while getAttendanceDataRejected in employeeAttendance controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}
  

export const getAttendanceDataRejectedUserId=async(request,response,next)=>{
    try{
        const getData=await employeeAttendanceModel.getAttendanceDataRejectedUserId(request.body)
        return getData.status&&getData.data.length>=1
                ? apiResponse.successResponseWithData(response, getData?.message ?? 'Data Found Successfully',getData.data)
                : apiResponse.notFoundResponse(response, 'No Data Found');

    }catch(error){
        console.log("....error....",error?.message)
        request.logger.error("Error while getAttendanceDataRejectedUserId in employeeAttendance controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}



// manually  approved attendnece data
export const approvedAttendanceDataManually=async(request,response,next)=>{
    try{
        const getDataResponse=await employeeAttendanceModel.approvedAttendanceDataManually(request.body)
        return getDataResponse.status
                ? apiResponse.successResponseWithData(response, getDataResponse?.message ?? 'Data approved/rejecetd Successfully',getDataResponse?.message)
                : apiResponse.notFoundResponse(response, 'Failed to upadte');

    }catch(error){
        console.log("....error....",error?.message)
        request.logger.error("Error while creating approvedAttendanceDataManually in employeeAttendance controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message)
    }
}

// Get branch-wise attendance data with percentages and employee count
export const getBranchWiseAttendanceData = async (request, response, next) => {
        try {
            
            // Call the model to get the attendance data
            const attendanceData = await employeeAttendanceModel.getBranchWiseAttendanceData(request.body);

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
        const attendanceData = await employeeAttendanceModel.getDepartmentWiseAttendanceData(request.body);

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
        const attendanceData = await employeeAttendanceModel.getDesignationWiseAttendanceData(request.body);

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
export const getEmployeesSummaryAttendanceData = async (request, response, next) => {
    try {
        // Call the model to get the department-wise attendance data
        const attendanceData = await employeeAttendanceModel.getEmployeesSummaryAttendanceData(request.body);

        // Check if data exists and respond accordingly
        return attendanceData.status && attendanceData.data.length >= 1
            ? apiResponse.successResponseWithData(response, 'Employees Summary Attendance Data attendance data found successfully', attendanceData.data)
            : apiResponse.notFoundResponse(response, 'No  attendance data found for the given range');

    } catch (error) {
        console.log("Error in getEmployees Summary Attendance: ", error?.message);
        request.logger.error("Error in Error in getEmployees Summary Attendance", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};


// Get designation-wise attendance data for a specific branch
export const getEmployeeSummaryAttendanceDataUserId = async (request, response, next) => {
    try {
        // Call the model to get the department-wise attendance data
        const attendanceData = await employeeAttendanceModel.getEmployeeSummaryAttendanceDataUserId(request.body);

        // Check if data exists and respond accordingly
        return attendanceData.status && attendanceData.data.length >= 1
            ? apiResponse.successResponseWithData(response, 'Employee Summary Attendance Data attendance data found successfully', attendanceData.data)
            : apiResponse.notFoundResponse(response, 'No  attendance data found for the given range');

    } catch (error) {
        console.log("Error in getEmployee Summary Attendance On UserId: ", error?.message);
        request.logger.error("Error in fetching getEmployee Summary Attendance On UserId attendance data", { stack: error.stack });
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
        request.logger.error("Error while setImageToAws in attendance controller ",{ stack: error.stack });
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
        request.logger.error("Error while setImageToAws in attendance controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)  
    }
};


/**
 * get single current day attendance data of logdin user.
 */
export const getSingleCurrentDayAttendance = async (request,response,next) => {
    try{
        const result = await employeeAttendanceModel.getAttendanceDetails(request.body);
        if(!result.data.length){
            request.body.attendanceDetails = {status:false}
            return next();
        }
        request.body.data.attendanceDetails = result;
        return next();
    }catch(error){
        request.logger.error("Error while getSingleCurrentDayAttendance in attendance controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
};

/**get attendance details */
export const getaAttendanceDetails = async (request,response,next) => {
    try{
        request.body.orgId = request.body.user.orgId;
        const result = await employeeAttendanceModel.listAttendance(request.body);
        // if(!result.data.length){
        //     request.body.attendanceDetails = {status:false}
        //     return next();
        // }
        request.body.attendanceDetails = result;
        return next();
    }catch(error){
        request.logger.error("Error while getaAttendanceDetails in attendance controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
};

export const getAttendanceLogs = async (request,response,next) => {
    try{
        const result = await employeeAttendanceModel.getAttendanceLogs(request.body);
        if(!result.data.length){
            request.body.attendanceDetails = {status:false}
            return next();
        }
        request.body.data = result;
        return next();  
    }catch(error){
        request.logger.error("Error while getAttendanceLogs in attendance controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.toString());
    }
}