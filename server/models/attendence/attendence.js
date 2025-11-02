import { create, getOne, removeOne, findOneAndUpdate, aggregationWithPegination, updateOne, findWithPegination, getMany, bulkWriteOperations,aggregate,updateMany, updateOneWithupsert} from '../../helper/mongo.js';
import { ObjectId } from 'mongodb';
import { logger } from '../../helper/logger.js';
import moment from 'moment-timezone';
import { QueryBuilder } from "../../helper/filter.js";
import { attendanceApprovalStatus } from '../../helper/constants.js';
import { getUTCDateRange, getCurrentDateTime } from '../../helper/formatting.js';


const collectionName = 'employeeAttendence'

const attendance_log_collection = "attendanceLogs";
//this below function for add employee in daily checkin attendence
export const addEmployee = async (body) => {
    try {
        const orgId = body?.user?.orgId
        const userId = body?.user?._id
        

        const shiftStartDate = body.shiftStartTime;  // Returns ISO 8601 string with timezone
        const shiftEndDate = body.shiftEndTime;      // Returns ISO 8601 string with timezone


        if (!userId || !orgId) return { status: false, message: "either userId or orgId Not found" }
        const employeeCheckInData = {
            userId: userId,
            orgId: new ObjectId(orgId),
            session: {
                firstHalf: {
                    checkIn: {
                        "time": new Date(body.transactionDate),
                        "status": true,
                        "location": { lat: body.lat, long: body.long },
                        "address": body.address,
                        "device": {
                            "type": body.deviceType,
                            "deviceId": body.deviceType == 'easyPagarMobileApp' ? 'easyPagarMobileApp' : body.deviceId,
                            "transactionId": body.deviceType == 'easyPagarMobileApp' ? null : body.deviceserialNumber,
                        }
                    },
                    checkOut: null,
                },
                secondHalf: {
                    checkIn: null,
                    checkOut: null
                }
            },
            shiftType:body.shiftName,
            shiftStartTime:body.startTime,
            shiftEndTime:body.endTime,
            shiftStartDate:shiftStartDate,
            shiftEndDate:shiftEndDate,
            transactionLog: [{ deviceId: body.deviceId, deviceserialNumber: body.deviceserialNumber, time: body.transactionDate, deviceType: body.deviceType }],
            wholeDayStatus: "incomplete", // Default to incomplete
            attendanceApprove: "Pending",
            totalHoursWorked: 0,
            createdAt: new Date(body.transactionDate),
        };

        return await create(employeeCheckInData, collectionName);

    } catch (error) {
        console.log("..errror...", error?.message)
        logger.error("Error while creating add employee in employeeAttendence model ");
        throw error
    }
}

// update empoyee attendece data firsthalf checkout and second half checkin/checkout
export const updateEmployeeAttendenceData = async (body) => {
    try {
        const query = Object.create(null);
        query["_id"] = body.existingCheckInOutData._id
        const session = body.existingCheckInOutData.session
        let updateSession;

        if (session.firstHalf?.checkIn?.status && session.firstHalf.checkOut?.status) {
            updateSession = session.secondHalf?.checkIn?.status
                ? 'session.secondHalf.checkOut'
                : 'session.secondHalf.checkIn';
        } else {
            updateSession = 'session.firstHalf.checkOut';
        }

        const firstHalfCheckInTime = body.existingCheckInOutData?.session?.firstHalf?.checkIn?.time
        const differeneceTime = new Date(body.transactionDate) - new Date(firstHalfCheckInTime)
        const diffHours = (differeneceTime / 3600000).toFixed(2); // Keep 2 decimal places
        const intDiffHours = parseFloat(diffHours)

        if (session.firstHalf?.checkIn?.status && !session.firstHalf?.checkOut && !session.secondHalf?.checkIn && !session.secondHalf?.checkOut && diffHours >= 6) {
            updateSession = 'session.secondHalf.checkOut';
        }


        if (session.firstHalf.checkIn.status && !session.firstHalf.checkout?.status) {
            const sessionObject = {

                "time": new Date(body.transactionDate),
                "status": true,
                "location": { lat: body.lat, long: body.long },
                "address": body.address,
                "device": {
                    "type": body.deviceType,
                    "deviceId": body.deviceType == 'easyPagarMobileApp' ? 'easyPagarMobileApp' : body.deviceId,
                    "transactionId": body.deviceType == 'easyPagarMobileApp' ? null : body.deviceserialNumber
                }
            }
            const wholeDayStatus = intDiffHours >= 9 ? 'FullDay Complete' : (intDiffHours >= 4 ? 'HalfDay Complete' : 'FullDay Incomplete');
            const update = {
                $set: { [updateSession]: sessionObject, totalHoursWorked: +diffHours, wholeDayStatus: wholeDayStatus, modifiedDate: new Date(body.transactionDate) }
            }
            const result = await updateOne(query, update, collectionName)
            // Extract the part after the last dot (checkOut)
            const messagePart = updateSession.slice(updateSession.lastIndexOf('.') + 1); // 'checkOut'

            // Extract the part between the last dot and the second last dot (firstHalf)
            const messagePart2 = updateSession.slice(updateSession.lastIndexOf('.', updateSession.lastIndexOf('.') - 1) + 1, updateSession.lastIndexOf('.')); // 'firstHalf'

            // Combine both parts (optional)
            const combinedMessage = messagePart2 + messagePart; // 'firstHalfcheckOut'
            return result.status ? { status: true, message: combinedMessage + ' Successfully' } : { status: false, message: combinedMessage + ' Failed' };

        }



    } catch (error) {
        console.log("..errror...", error?.message)
        logger.error("Error while  updateEmployeeAttendenceData employee in employeeAttendence model ");
        throw error
    }
}

//update attendanceApprove auto approve for cron job
export const attendanceApprove = async (query, update) => {
    try {

        console.log("....query...", query)
        console.log("....update...", update)
        const updateWithSet = {
            $set: update
        };
        return await updateOne(query, updateWithSet, collectionName)

    } catch (error) {
        console.log("..errror...", error?.message)
        logger.error("Error while updating attendanceApprove in employeeAttendence model ");
        throw error
    }
}
// calculate hours for next day shift between start time and checkintime of next day
function calculateDifferenceInHours(startTime, transactionDate) {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const startDateTime = new Date(new Date(transactionDate).setHours(startHours, startMinutes, 0, 0));

    const transactionDateTime = new Date(transactionDate);
    let diffInMilliseconds = transactionDateTime - startDateTime;
    // If the difference is negative, the transaction happened the next day, so add 24 hours
    if (diffInMilliseconds < 0) {
        diffInMilliseconds += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
    }

    // Convert milliseconds to hours
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    return diffInHours;
}

// this below function for employee is already checkin or not
export const findExistingCheckIn = async (body) => {
    try {
        const orgId = body?.user?.orgId
        const userId = body.employeeId ? new ObjectId(body.employeeId) : body?.user?._id

        if (!userId || !orgId) return { status: false, message: "either userId or orgId Not found" }

        // Get the current date
        const currentDate = body.transactionDate ? new Date(body.transactionDate) : body.date ? new Date(body.date) : new Date(); // This sets to the current date and time       
        // const momentDate = moment(body.transactionDate)

        // Convert the finalStartDate to Date object and set it to the start of the day
        let start = new Date(currentDate);
        start.setUTCHours(0, 0, 0, 0); // Start of the day

        // Convert the finalEndDate to Date object and set it to the end of the day
        let end = new Date(currentDate);
        end.setUTCHours(23, 59, 59, 999); // End of the day
        // end.setUTCHours(0, 0, 0, 0); // End of the day
        let startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Start of today (00:00:00)
        let endOfDay = new Date(startOfDay); // Copy startOfDay
        endOfDay.setDate(endOfDay.getDate() + 1); // Start of tomorrow (00:00:00 next day)

        if (body.dayCrossStatus) {

            startOfDay = new Date(body.transactionDate);
            startOfDay.setDate(startOfDay.getDate() - 1);
            startOfDay.setHours(0, 0, 0, 0);  // Set time to 00:00:00

            // Set endOfDay to the current transaction date with time 23:59:59
            endOfDay = new Date(body.transactionDate);
            endOfDay.setHours(23, 59, 59, 999);  // Set time to 23:59:59   
        }

        const query = {
            userId: new ObjectId(userId),
            orgId: new ObjectId(orgId),
            transactionDate : { $gte: startOfDay, $lt: endOfDay },
            // shiftId : body.shiftId // Query for today
            // "session.firstHalf.checkIn.status": true
        };

        if (body.shiftId && body.type != 'checkOut') query.shiftId = new ObjectId(body.shiftId)

        if(body.employeeId!=null){
            query.userId = new ObjectId(body.employeeId) // if employeeId is provided, use it instead of userId this change bceause of attendece approve reject api
        }

        let aggregationQuery = [
            {
                $match : query,
            },
            {
                $sort:
                {
                    transactionDate: -1
                }
            },
            {
                $limit: 1
            }
        ]
        console.log(JSON.stringify(aggregationQuery))
        const getOneStatus = await aggregate(aggregationQuery, collectionName);

        // if (getOneStatus.status) {
        //     return await findOneAndUpdate(query, {
        //         $push: {
        //             transactionLog: {
        //                 deviceId: body.deviceId,
        //                 deviceSerialNumber: body.deviceserialNumber,
        //                 time: body.transactionDate,
        //                 deviceType: body.deviceType
        //             }
        //         }
        //     }, collectionName);
        // }
        return getOneStatus

    } catch (error) {
        console.log("...error..", error?.message)
        logger.error("Error while creating add employee in employeeAttendence model ");
        throw error;
    }
}

// this below function for employee is already checkin or not
export const findExistingCheckInLog = async (body) => {
    try {

        const query = {
            employeeAttendanceId : body.existingCheckInOutData?._id,
        };

        let aggregationQuery = [
            {
                $match : query,
            },
            {
                $sort:
                {
                    transactionDate: -1
                }
            },
            {
                $limit: 1
            }
        ]
        console.log(JSON.stringify(aggregationQuery))
        return await aggregate(aggregationQuery, "attendanceLogs");


    } catch (error) {
        console.log("...error..", error?.message)
        logger.error("Error while creating add employee in employeeAttendence model ");
        throw error;
    }
}


//get employees data based on branch/dept/desg/year/month
export const getEmployessAttendenceData = async (body) => {
    try {
        const orgId = body?.user?.orgId
        const userId = body?.user?._id
        const { branchId, departmentId, designationId } = body

        if (!userId || !orgId || !branchId || !departmentId || !designationId) return { status: false, message: "parameters are missing" }
        // Create a date range for the specified month and year

        const startDate = new Date(`${body.year}-${body.month}-01T00:00:00Z`);
        const endDate = new Date(`${body.year}-${body.month + 1}-01T00:00:00Z`); // Start of the next month


        const query = {
            orgId: orgId,
            createdAt: {
                $gte: startDate,
                $lt: endDate // Exclude the next month's records
            }
        }


        const aggregationFilter = [
            {
                $match: {
                    orgId: orgId,
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate // Exclude the next month's records
                    }
                }
            },

            { $lookup: { from: "user", localField: "userId", foreignField: "_id", as: "userDetails" } },
            { $unwind: "$userDetails" },

            { $lookup: { from: "assignment", localField: "userDetails.assignmentId", foreignField: "_id", as: "assignmentDetails" } }, { $unwind: "$assignmentDetails" },

            { $lookup: { from: "organization", localField: "assignmentDetails.orgId", foreignField: "_id", as: "organisationDetails" } }, { $unwind: "$organisationDetails" },

            { $lookup: { from: "branches", localField: "assignmentDetails.branchId", foreignField: "_id", as: "branchDetails" } }, { $unwind: "$branchDetails" },

            { $lookup: { from: "department", localField: "assignmentDetails.departmentId", foreignField: "_id", as: "departmentDetails" } }, { $unwind: "$departmentDetails" },

            { $lookup: { from: "designation", localField: "assignmentDetails.designationId", foreignField: "_id", as: "designationDetails" } }, { $unwind: "$designationDetails" },
            {
                $match: {
                    "branchDetails._id": new ObjectId(branchId),
                    "departmentDetails._id": new ObjectId(departmentId),
                    "designationDetails._id": new ObjectId(designationId),
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate // Exclude the next month's records
                    }
                }
            },
            {
                $group: {
                    _id: {
                        employeeId: "$userDetails._id",
                        orgId: "$organisationDetails._id",
                        organisationName: "$organisationDetails.name",
                        employeeName: { $concat: ["$userDetails.name.firstName", " ", "$userDetails.name.lastName"] },
                        branch: "$branchDetails.name",
                        department: "$departmentDetails.name",
                        designation: "$designationDetails.name"

                    },
                    attendance: {
                        $push: {
                            date: { $dateToString: { format: "%Y-%m-%d", date: "$session.firstHalf.checkIn.time" } },
                            firstHalf: {
                                checkIn: { $dateToString: { format: "%H:%M", date: "$session.firstHalf.checkIn.time" } },
                                checkOut: { $dateToString: { format: "%H:%M", date: "$session.firstHalf.checkOut.time" } }
                            },
                            secondHalf: {
                                checkIn: { $dateToString: { format: "%H:%M", date: "$session.secondHalf.checkIn.time" } },
                                checkOut: { $dateToString: { format: "%H:%M", date: "$session.secondHalf.checkOut.time" } }
                            },
                            totalHoursWorked: "$totalHoursWorked",
                            wholeDayStatus: "$wholeDayStatus"
                        }
                    }
                }

            },

            {
                $project: {
                    _id: 0,
                    employeeId: "$_id.employeeId",
                    orgId: "$_id.orgId",
                    organisationName: "$_id.organisationName",
                    employeeName: "$_id.employeeName",
                    branch: "$_id.branch",
                    department: "$_id.department",
                    designation: "$_id.designation",
                    attendance: 1
                }
            }

        ]

        return await aggregationWithPegination(aggregationFilter, body, collectionName, query);

    } catch (error) {
        console.log("...error..", error?.message)
        logger.error("Error while getting employee attendence data in employeeAttendence model ");
        throw error
    }
}

//set start date and end date
function setStartAndEndDate(params) {
    const { startDate, endDate } = params;

    // If only startDate is provided, use it for both startDate and endDate
    const finalStartDate = startDate || endDate;
    const finalEndDate = endDate || startDate;

    // If both are undefined, return current date for both startDate and endDate
    if (!finalStartDate || !finalEndDate) {
        const currentDate = new Date();
        return {
            startDate: new Date(currentDate.setUTCHours(0, 0, 0, 0)),   // Start of the current day
            endDate: new Date(currentDate.setUTCHours(23, 59, 59, 999)) // End of the current day
        };
    }

    // Convert the finalStartDate to Date object and set it to the start of the day
    const start = new Date(finalStartDate);
    start.setUTCHours(0, 0, 0, 0); // Start of the day

    // Convert the finalEndDate to Date object and set it to the end of the day
    const end = new Date(finalEndDate);
    end.setUTCHours(23, 59, 59, 999); // End of the day
    // end.setUTCHours(0, 0, 0, 0); // End of the day

    return {
        startDate: start,
        endDate: end,
    };
}

export const addAttendenceData = async (body) => {
    try {
        const orgId = body?.user?.orgId;
        const userId = body?.user?._id;

        if (!userId || !orgId) return { status: false, message: "Either userId or orgId Not found" };

        const transactionDate = new Date(body.transactionDate);
        const startOfDay = moment(transactionDate).startOf('day').add(5, 'hours').add(30, 'minutes').toDate();
        const endOfDay = moment(transactionDate).endOf('day').add(5, 'hours').add(30, 'minutes').toDate();
        
        let query = {
            userId: new ObjectId(userId),
            orgId: new ObjectId(orgId),
            transactionDate: transactionDate,
            workTimingType: body.nearestShift.workTimingType,
            // location: body.location,
        };
        
        if(body.extendAttendance) query['isExtended'] = true;
        
        // if(body.shift) {
            query['startTime'] = body[body.nearestShift.workTimingType]?.startTime,
            query['endTime'] = body[body.nearestShift.workTimingType]?.endTime
        // }

        if (body.shiftId && body.nearestShift.workTimingType != 'branch') query.shiftId = new ObjectId(body.shiftId);

        if (body.branchId) query.branchId = new ObjectId(body.branchId);
        // if (body.assignmentData?.branchId) query.branchId = new ObjectId(body.assignmentData.branchId);
        // if (body.assignmentData?.departmentId) query.departmentId = new ObjectId(body.assignmentData.departmentId);
        // if (body.assignmentData?.designationId) query.designationId = new ObjectId(body.assignmentData.designationId);

        let updateData = {};
        // if (['checkIn', 'checkOut'].includes(body.type)) {
        //     const key = body.type; // Dynamically set 'checkIn' or 'checkOut'
        //     query[key] = updateData[key] = {
        //         time: transactionDate,
        //         location: body.location,
        //     };
        // }
        // Check if an attendance record exists for the same user, org, and the same day (ignoring time)
        // const existingRecord = await getOne(
        //     {
        //         userId: new ObjectId(userId),
        //         orgId: new ObjectId(orgId),
        //         transactionDate: { $gte: startOfDay, $lte: endOfDay } // Match only within the same day
        //     },
        //     collectionName
        // );

        if (body.existingCheckInOutData && !body.extendAttendance) {
            // Update existing record
            updateData.modifiedAt = new Date();
            updateData.transactionDate = transactionDate;
            
            //update working hours old one
            // if(body.type == 'checkOut') {
            //     if(!body.existingCheckInOutData.modifiedAt){
            //         const diffMs = Math.abs(new Date(body.existingCheckInOutData.checkIn.time) - new Date(transactionDate));
            //         const diffMinutes = Math.floor(diffMs / (1000 * 60));
            //         const hours = Math.floor(diffMinutes / 60);
            //         const minutes = diffMinutes % 60;
                
            //         // updateData.workingHours =   hours + '.' + minutes;
            //     }else{
            //         const diffMs = Math.abs(new Date(body.existingCheckInOutData.modifiedAt) - new Date(transactionDate));
            //         const diffMinutes = Math.floor(diffMs / (1000 * 60));
            //         const hours = Math.floor(diffMinutes / 60);
            //         const minutes = diffMinutes % 60;
                
            //         // updateData.workingHours = parseFloat(body.existingCheckInOutData.workingHours) + parseFloat(hours + '.' + minutes);                
            //     }
            // }

            if(updateData.checkIn) delete updateData.checkIn;
            const updatedRecord = await updateOne(
                {
                    // userId: new ObjectId(userId), 
                    // orgId: new ObjectId(orgId), 
                    // transactionDate: { $gte: startOfDay, $lte: endOfDay } 
                    _id: new ObjectId(body.existingCheckInOutData._id)
                },
                { $set: updateData },
                collectionName
            );

            return updatedRecord;
        } else {
            // No existing record → Create new one
            // if (!body.shiftId)return {status:true} // without shiftId cant create
            query.createdDate = new Date();
            
            const newRecord = await create(query, collectionName);


            // if (newRecord.data.insertedId) {
            //     // Update new record with employeeAttendanceId
            //     await updateOne(
            //         {
            //             userId: new ObjectId(userId),
            //             orgId: new ObjectId(orgId),
            //             transactionDate: { $gte: startOfDay, $lte: endOfDay }, // Match only within the same day
            //         },
            //         { $set: { employeeAttendanceId: newRecord.data.insertedId } },
            //         'attendanceLogs'
            //     );
            // }

            return newRecord;
        }
    } catch (error) {
        console.log(error)
        logger.error("Error while creating or updating employee attendance in employeeAttendence model",{stack: error.message });
        throw error;
    }
}   

export const updateEmployeeAttendence = async (body) =>  {
    try {
        console.log(body.existingCheckInOutData?._id);
        console.log(body.employeeAttendenceId);
        let employeeAttendenceId = body.existingCheckInOutData?._id || body.employeeAttendenceId;
        let query = {_id:new ObjectId(employeeAttendenceId)};
        
        let setObj = { $set : {approvalStatus: false}}
        
        if(body.type == 'checkOut' && body.latestAttendanceData?.approvalStatus && (body.latestAttendanceData?.extendApproveStatus == undefined || body.latestAttendanceData.extendApproveStatus == true) ) setObj['$set']['approvalStatus'] = true
        
        console.log(JSON.stringify(query))
        console.log(JSON.stringify(setObj))
        return await updateOne(query, setObj, collectionName);
    }
    catch (error) {
        logger.error("Error while updating employee attendance in employeeAttendence model",{stack: error.message });
        throw error;
    }
}
//Update the attendence status of users
export const updateAttendeceApproval = async(body)=>{
    try
    {
        // if(body.branchDetails.status)
        // {
            let setObj = { isLocationMatched : false, isOnTime : false }

            if(body.branchDetails?.status) setObj['isLocationMatched'] = attendanceApprovalStatus.approved

            const current = new Date(body.transactionDate);
            if(body.nearestShift) {
                if(body.type == 'checkIn') {
                    const maxInStart = new Date(body.nearestShift.shiftStart);
                    if(body.nearestShift.maxIn) {
                        const [maxInHours, maxInMinutes] = body.nearestShift.maxIn.split(':').map(Number);
                        maxInStart.setHours(maxInHours, maxInMinutes, 0, 0);
                    }
                    if(current <= maxInStart) setObj['isOnTime'] = attendanceApprovalStatus.approved;
                    if(body.extendAttendance) setObj['extendApproveStatus'] = attendanceApprovalStatus.pending
                }
                else if(body.type == 'checkOut') {
                    const minOutStart = new Date(body.nearestShift.shiftEnd);
                    if(body.nearestShift.minOut) {
                        const [minOutHours, minOutMinutes] = body.nearestShift.minOut.split(':').map(Number);
                        minOutStart.setHours(minOutHours, minOutMinutes, 0, 0);
                    }
                    if(current >= minOutStart) setObj['isOnTime'] = attendanceApprovalStatus.approved;
                    if(body.extendAttendance) setObj['extendApproveStatus'] = attendanceApprovalStatus.pending
                }
            }

            if(setObj.isLocationMatched && setObj.isOnTime) setObj['approvalStatus'] = attendanceApprovalStatus.approved;

            const result = await updateOne(
                    { _id: new ObjectId(body.attendenceId) },
                    { $set: setObj },
                    'attendanceLogs'
                )
            return result
        // }
        // else return

    }
    catch (error) {
        console.log(error.message)
        logger.error("Error while updateAttendeceApproval in attendence model",{stack: error.stack });
        throw error;
    }
}

export const getEmployeeStats = async(body)=>{
    try
    {
        const { user, message, type, messageStatus} = body
        const date = moment(body.transactionDate)
        const year = date.year()
        const month = date.month() + 1
      
        const query ={
            userId: new ObjectId(user._id),
            orgId: new ObjectId(user.orgId),
            year: year,
            month: month

        }
        return await getOne(query, 'attendenceStatistics')

    }
    catch (error) {
        logger.error("Error while get employee attendance statistics in getEmployeeStats model",{stack: error.stack });
        throw error;
    }
}

export const getEmployeeStatsDaily = async(body)=>{
    try
    {
        const { user, message, type, messageStatus} = body
        const date = moment(body.transactionDate)
        const year = date.year()
        const month = date.month() + 1
      
        const query ={
            userId: new ObjectId(user._id),
            orgId: new ObjectId(user.orgId),
            year: year,
            month: month,
            date: body.nearestShift?.isDayCross && body.type == 'checkOut' ? moment(body.transactionDate).subtract(1, 'days').format('YYYY-MM-DD') : date.format('YYYY-MM-DD')
        }

        return await getOne(query, 'ShiftAttendanceSummary')

    }
    catch (error) {
        logger.error("Error while get employee attendance statistics in getEmployeeStats model",{stack: error.stack });
        throw error;
    }
}

//Add attendence statistics 
export const addEmployeeAttendenceStats = async (body) => {
  try {
    const { user, type, messageStatus, checkExisting, existingCheckInOutData } = body;
    
    const date = moment(body.transactionDate);
    // const today = date.format("YYYY-MM-DD");
    const todayStr = date.format("YYYY-MM-DD");
    const timeStr = date.format("HH:mm:ss");
    const year = date.year();
    const month = date.month() + 1;

    const query = {
      userId: new ObjectId(user._id),
      orgId: new ObjectId(user.orgId),
      year,
      month
    };

    const doc = checkExisting?.data
    const attendanceId = existingCheckInOutData?._id

    const update = {};
    const $inc = {};
    const $set = {};

    // const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    if (!doc) {
        const startOfMonth = moment(`${year}-${month}-01`, "YYYY-MM-DD");
        const endOfMonth = moment(startOfMonth).endOf('month');

        let workingDays = 0;
        for (let d = startOfMonth.clone(); d.isSameOrBefore(endOfMonth); d.add(1, 'day')) {
            if (d.day() !== 0) { // 0 = Sunday
                workingDays++;
            }
        }
        $set["monthDays"] = workingDays;
        $set["presentDays"] = 1;
        $set['createdAt']=new Date()
    }


    let today = doc?.today || {
        date: todayStr,
        earlyIn: 0,
        lateIn: 0,
        onTimeIn: 0,
        earlyOut: 0,
        lateOut: 0,
        onTimeOut: 0,
        totalBreakMinutes: 0,
        totalWorkingMinutes: 0
    };

    const isNewDay = today.date !== todayStr;

    if (isNewDay && doc?.today) {
        const y = doc.today;
        $inc["earlyIn"] = y.earlyIn || 0;
        $inc["lateIn"] = y.lateIn || 0;
        $inc["onTimeIn"] = y.onTimeIn || 0;
        $inc["earlyOut"] = y.earlyOut || 0;
        $inc["lateOut"] = y.lateOut || 0;
        $inc["onTimeOut"] = y.onTimeOut || 0;
        $inc["totalMonthlyBreakMinutes"] = y.totalBreakMinutes || 0;
        $inc["totalMonthlyWorkingMinutes"] = y.totalWorkingMinutes || 0;
        
        $inc["presentDays"] = 1;

        today = {
          date: todayStr,
          earlyIn: 0,
          lateIn: 0,
          onTimeIn: 0,
          earlyOut: 0,
          lateOut: 0,
          onTimeOut: 0,
          totalBreakMinutes: 0,
          totalWorkingMinutes: 0
        };
    }

    // if (type === "checkOut") {
    //   const last = doc?.today;

    //   const isDifferentDate = last?.date !== today;
    //   const isDifferentAttendance = last?.attendanceId?.toString() !== attendanceId?.toString()

    //   if (last && (isDifferentDate || isDifferentAttendance)) {
    //     // Increment based on last status
    //     if (last.status === 4) $inc["earlyOut"] = 1;
    //     else if (last.status === 5) $inc["lateOut"] = 1;
    //     else if (last.status === 6) $inc["onTimeOut"] = 1;
    //   }

    //   // Overwrite the today
    //   $set["today"] = {
    //     date: today,
    //     status: messageStatus,
    //     attendanceId: new ObjectId(attendanceId)
    //   };
    // }

    // if (type === "checkIn") {
    //   if (messageStatus === 1) $inc["earlyIn"] = 1;
    //   else if (messageStatus === 2) $inc["lateIn"] = 1;
    //   else if (messageStatus === 3) $inc["onTimeIn"] = 1;
    // }

    if (type === "checkIn") {
        if (today.lastOutTime) {
          const lastOutTime = moment(`${todayStr} ${today.lastOutTime}`, "YYYY-MM-DD HH:mm:ss");
          const currentInTime = moment(`${todayStr} ${timeStr}`, "YYYY-MM-DD HH:mm:ss");
          const breakMinutes = currentInTime.diff(lastOutTime, "minutes");
          if (breakMinutes > 0) today.totalBreakMinutes += breakMinutes;
        }
  
        today.lastInTime = timeStr;
  
        if (messageStatus === 1) today.earlyIn += 1;
        if (messageStatus === 2) today.lateIn += 1;
        if (messageStatus === 3) today.onTimeIn += 1;
    }

    if (type === "checkOut") {
        

        // if (today.lastAttendanceId.toString() === attendanceId?.toString()) {
        //     return; // Already processed, skip this check-out
        // }

        today.lastOutTime = timeStr;
        today.lastAttendanceId = new ObjectId(attendanceId);
  
        if (messageStatus === 4) today.earlyOut += 1;
        if (messageStatus === 5) today.lateOut += 1;
        if (messageStatus === 6) today.onTimeOut += 1;
  
        if (today.lastInTime) {
          const inTime = moment(`${todayStr} ${today.lastInTime}`, "YYYY-MM-DD HH:mm:ss");
          const outTime = moment(`${todayStr} ${timeStr}`, "YYYY-MM-DD HH:mm:ss");
          const worked = outTime.diff(inTime, "minutes");
          if (worked > 0) today.totalWorkingMinutes += worked;
        }
    }
    $set["today"] = today;

    if (Object.keys($inc).length) update["$inc"] = $inc;
    if (Object.keys($set).length) update["$set"] = $set;

    if (!Object.keys(update).length) return;

    return await findOneAndUpdate(query, update, "attendenceStatistics");
  } catch (error) {
    logger.error("Error in addEmployeeAttendenceStats", { stack: error.stack });
    throw error;
  }
};


//get attendence summary data by userId
// export const getEmployeeAttendenceStats = async (body) => {
//   try
//   {
//     const query = {
//       userId: new ObjectId(body.userId),
//       orgId: new ObjectId(body.user.orgId),
//       year: body.year,
//       ...(body.month && {month:body.month})  
//     }

//     const aggregateQuery =[
//         {$match :query},
//         {
//             $group: {
//                 _id: {
//                   userId: "$userId",
//                   orgId: "$orgId",
//                 },
//                 earlyIn: {$sum:{$ifNull: ["$earlyIn", 0]}},
//                 lateIn: {$sum:{$ifNull: ["$lateIn", 0]}},
//                 onTimeIn: {$sum:{$ifNull: ["$onTimeIn", 0]}},
//                 earlyOut: {$sum:{$ifNull: ["$earlyOut", 0]}},
//                 lateOut: {$sum:{$ifNull: ["$lateOut", 0]}},
//                 onTimeOut: {$sum:{$ifNull: ["$onTimeOut", 0]}},
//             },
//         }
//     ]

//     let result = await aggregate(aggregateQuery,'attendenceStatistics')

//     if(result.data.length === 0)
//     {
//         result = { status: true , 
//             data: [{ _id:{userId: query.userId, orgId: query.orgId}, 
//                 earlyIn:0, 
//                 lateIn:0, 
//                 onTimeIn:0, 
//                 earlyOut:0, 
//                 lateOut:0, 
//                 onTimeOut:0
//             }]}
//     }

//     return result

//   }
//   catch (error) {
//     console.error("Error in getEmployeeAttendenceStats in User model:", error.message);
//     throw error;
//   }
// }

export const getEmployeeAttendenceStats = async (body) => {
    try {
        const query = {
            userId: new ObjectId(body.userId),
            orgId: new ObjectId(body.user.orgId),
            year: body.year,
            ...(body.month && { month: body.month })
        }

        const document = await getOne(query, "attendenceStatistics");

        if (!document.status) {
            // No stats yet for the user this month
            return {
                status: true,
                data: {
                    earlyIn: 0,
                    lateIn: 0,
                    onTimeIn: 0,
                    earlyOut: 0,
                    lateOut: 0,
                    onTimeOut: 0,
                    totalMonthlyBreakMinutes: 0,
                    totalMonthlyWorkingMinutes: 0
                }
            };
        }

        // Pull base values from document (monthly totals)
        let {
            earlyIn = 0,
            lateIn = 0,
            onTimeIn = 0,
            earlyOut = 0,
            lateOut = 0,
            onTimeOut = 0,
            totalMonthlyBreakMinutes = 0,
            totalMonthlyWorkingMinutes = 0,
            today = {}
        } = document.data;


        // Add today's values to the current month's total
        earlyIn += today.earlyIn || 0;
        lateIn += today.lateIn || 0;
        onTimeIn += today.onTimeIn || 0;
        earlyOut += today.earlyOut || 0;
        lateOut += today.lateOut || 0;
        onTimeOut += today.onTimeOut || 0;
        totalMonthlyBreakMinutes += today.totalBreakMinutes || 0;
        totalMonthlyWorkingMinutes += today.totalWorkingMinutes || 0;

        return {
            status: true,
            data: {
                earlyIn,
                lateIn,
                onTimeIn,
                earlyOut,
                lateOut,
                onTimeOut,
                totalMonthlyBreakMinutes,
                totalMonthlyWorkingMinutes
            }
        };


    }
    catch (error) {
        console.error("Error in getEmployeeAttendenceStats in User model:", error.message);
        throw error;
    }
}

//get userId attendence data on date range
export const getAttendenceDataUserId = async (body) => {
    try {

        const orgId = body?.user?.orgId
        const params = Object.create(null);
        if (!body.employeeUserId || !orgId) return { status: false, message: "parameters are missing" }

        params["orgId"] = new ObjectId(orgId);
        params["userId"] = new ObjectId(body.employeeUserId);

        const { startDate, endDate } = setStartAndEndDate(body);
        console.log("..date", startDate, endDate)
        params["createdAt"] = {
            $gte: startDate,
            $lte: endDate // Exclude the next month's records
        }

        console.log("...params..", params)

        const aggregationFilter = [
            {
                $match: {
                    orgId: orgId,
                    userId: new ObjectId(body.employeeUserId),
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate // Exclude the next month's records
                    }
                }
            },

            { $lookup: { from: "user", localField: "userId", foreignField: "_id", as: "userDetails" } },
            { $unwind: "$userDetails" },

            { $lookup: { from: "assignment", localField: "userDetails.assignmentId", foreignField: "_id", as: "assignmentDetails" } }, { $unwind: "$assignmentDetails" },

            { $lookup: { from: "organization", localField: "assignmentDetails.orgId", foreignField: "_id", as: "organisationDetails" } }, { $unwind: "$organisationDetails" },

            { $lookup: { from: "branches", localField: "assignmentDetails.branchId", foreignField: "_id", as: "branchDetails" } }, { $unwind: "$branchDetails" },

            { $lookup: { from: "department", localField: "assignmentDetails.departmentId", foreignField: "_id", as: "departmentDetails" } }, { $unwind: "$departmentDetails" },

            { $lookup: { from: "designation", localField: "assignmentDetails.designationId", foreignField: "_id", as: "designationDetails" } }, { $unwind: "$designationDetails" },
            {
                $match: {
                    orgId: orgId,
                    userId: new ObjectId(body.employeeUserId),
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate // Exclude the next month's records
                    }
                }
            },
            {
                $group: {
                    _id: {
                        employeeId: "$userDetails._id",
                        orgId: "$organisationDetails._id",
                        organisationName: "$organisationDetails.name",
                        employeeName: { $concat: ["$userDetails.name.firstName", " ", "$userDetails.name.lastName"] },
                        branch: "$branchDetails.name",
                        department: "$departmentDetails.name",
                        designation: "$designationDetails.name"

                    },
                    attendance: {
                        $push: {
                            date: { $dateToString: { format: "%Y-%m-%d", date: "$session.firstHalf.checkIn.time" } },
                            firstHalf: {
                                checkIn: { $dateToString: { format: "%H:%M", date: "$session.firstHalf.checkIn.time",timezone: "+05:30" } },
                                checkOut: { $dateToString: { format: "%H:%M", date: "$session.firstHalf.checkOut.time",timezone: "+05:30" } }
                            },
                            secondHalf: {
                                checkIn: { $dateToString: { format: "%H:%M", date: "$session.secondHalf.checkIn.time",timezone: "+05:30" } },
                                checkOut: { $dateToString: { format: "%H:%M", date: "$session.secondHalf.checkOut.time" ,timezone: "+05:30"} }
                            },
                            totalHoursWorked: "$totalHoursWorked",
                            wholeDayStatus: "$wholeDayStatus",
                            attendanceApprove:"$attendanceApprove"
                        }
                    },
                    // Add shift details directly from the employeeAttendance collection
                    shiftType: { $first: "$shiftType" },
                    shiftStartTime: { $first: "$shiftStartTime" },
                    shiftEndTime: { $first: "$shiftEndTime" },
                    shiftStartDate: { $first: "$shiftStartDate" },
                    shiftEndDate: { $first: "$shiftEndDate" }
                }

            },

            {
                $project: {
                    _id: 0,
                    employeeId: "$_id.employeeId",
                    orgId: "$_id.orgId",
                    organisationName: "$_id.organisationName",
                    employeeName: "$_id.employeeName",
                    branch: "$_id.branch",
                    department: "$_id.department",
                    designation: "$_id.designation",
                    shiftType: 1,
                    shiftStartTime: 1,
                    shiftEndTime: 1,
                    shiftStartDate: 1,
                    shiftEndDate: 1,
                    attendance: 1
                }
            }

        ]
        console.log("....aggregationFilter....",aggregationFilter)
        return await aggregationWithPegination(aggregationFilter, body, collectionName, params);

    } catch (error) {
        console.log("...error..", error?.message)
        logger.error("Error while getting employee attendence data in employeeAttendence model ");
        throw error
    }
}


//get attendence summary data by userId
export const getAttendanceSummaryDataByUserId = async (body) => {
    try {
        const orgId = body?.user?.orgId;
        if (!body.employeeUserId || !orgId) return { status: false, message: "parameters are missing" };

        const { startDate, endDate } = setStartAndEndDate(body); // Assuming this function returns start and end date
        const params = {
            orgId: new ObjectId(orgId),
            userId: new ObjectId(body.employeeUserId),
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };

        const aggregationFilter = [
            { $match: params },
            // Add any necessary lookup and unwind operations

            {
                $group: {
                    _id: {
                        employeeId: "$userDetails._id",
                        orgId: "$organisationDetails._id",
                        organisationName: "$organisationDetails.name",
                        employeeName: { $concat: ["$userDetails.name.firstName", " ", "$userDetails.name.lastName"] },
                        branch: "$branchDetails.name",
                        department: "$departmentDetails.name",
                        designation: "$designationDetails.name"
                    },
                    attendance: {
                        $push: {
                            date: { $dateToString: { format: "%Y-%m-%d", date: "$session.firstHalf.checkIn.time" } },
                            firstHalf: {
                                checkIn: { $dateToString: { format: "%H:%M", date: "$session.firstHalf.checkIn.time" } },
                                checkOut: { $dateToString: { format: "%H:%M", date: "$session.firstHalf.checkOut.time" } }
                            },
                            secondHalf: {
                                checkIn: { $dateToString: { format: "%H:%M", date: "$session.secondHalf.checkIn.time" } },
                                checkOut: { $dateToString: { format: "%H:%M", date: "$session.secondHalf.checkOut.time" } }
                            },
                            totalHoursWorked: "$totalHoursWorked",
                            wholeDayStatus: "$wholeDayStatus",
                            manualApproved: "$manualApproved"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: "$_id.employeeId",
                    orgId: "$_id.orgId",
                    organisationName: "$_id.organisationName",
                    employeeName: "$_id.employeeName",
                    branch: "$_id.branch",
                    department: "$_id.department",
                    designation: "$_id.designation",
                    attendance: 1
                }
            }
        ];

        return await aggregationWithPegination(aggregationFilter, body, collectionName, params);


    } catch (error) {
        console.log("...error..", error?.message)
        logger.error("Error while getting employee attendence data in employeeAttendence model ");
        throw error
    }
}


export const getAllAttendenceData = async (body) => {
    try {
        const { startDate, endDate } = setStartAndEndDate(body); // Assuming this function returns start and end date
        console.log("..................", startDate, endDate)
        const params = {
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };

        // Separate projection object
        const projection = {
            _id: 1,
            orgId: 1,
            userId: 1
        };

        return await getMany(params, collectionName, projection)

    } catch (error) {
        console.log("...error..", error?.message)
        logger.error("Error while getting employee attendence data in employeeAttendence model ");
        throw error
    }
}

//get attendence data rejected on branch/dept/desg
export const getAttendanceDataRejected = async (body) => {
    try {
        const orgId = body?.user?.orgId
        const userId = body?.user?._id
        const { branchId, departmentId, designationId, attendanceApprove } = body

        const status = attendanceApprove ? attendanceApprove : 'Approved'


        if (!userId || !orgId || !branchId || !departmentId || !designationId) return { status: false, message: "parameters are missing" }
        // Create a date range for the specified month and year

        // const startDate = new Date(`${body.year}-${body.month}-01T00:00:00Z`);
        // const endDate = new Date(`${body.year}-${body.month + 1}-01T00:00:00Z`); // Start of the next month

        const { startDate, endDate } = setStartAndEndDate(body); // Assuming this function returns start and end date
        const query = {
            orgId: orgId,
            createdAt: {
                $gte: startDate,
                $lt: endDate // Exclude the next month's records
            }
        }


        const aggregationFilter = [
            {
                $match: {
                    orgId: orgId,
                    attendanceApprove: status,
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate // Exclude the next month's records
                    }
                }
            },

            { $lookup: { from: "user", localField: "userId", foreignField: "_id", as: "userDetails" } },
            { $unwind: "$userDetails" },

            { $lookup: { from: "assignment", localField: "userDetails.assignmentId", foreignField: "_id", as: "assignmentDetails" } }, { $unwind: "$assignmentDetails" },

            { $lookup: { from: "organization", localField: "assignmentDetails.orgId", foreignField: "_id", as: "organisationDetails" } }, { $unwind: "$organisationDetails" },

            { $lookup: { from: "branches", localField: "assignmentDetails.branchId", foreignField: "_id", as: "branchDetails" } }, { $unwind: "$branchDetails" },

            { $lookup: { from: "department", localField: "assignmentDetails.departmentId", foreignField: "_id", as: "departmentDetails" } }, { $unwind: "$departmentDetails" },

            { $lookup: { from: "designation", localField: "assignmentDetails.designationId", foreignField: "_id", as: "designationDetails" } }, { $unwind: "$designationDetails" },
            {
                $match: {
                    "branchDetails._id": new ObjectId(branchId),
                    "departmentDetails._id": new ObjectId(departmentId),
                    "designationDetails._id": new ObjectId(designationId),
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate // Exclude the next month's records
                    }
                }
            },
            {
                $group: {
                    _id: {
                        employeeId: "$userDetails._id",
                        orgId: "$organisationDetails._id",
                        organisationName: "$organisationDetails.name",
                        employeeName: { $concat: ["$userDetails.name.firstName", " ", "$userDetails.name.lastName"] },
                        branch: "$branchDetails.name",
                        department: "$departmentDetails.name",
                        designation: "$designationDetails.name",
                        attendanceApprove: "$attendanceApprove"

                    },
                    // attendance: {
                    //   $push: {
                    //     date: { $dateToString: { format: "%Y-%m-%d", date: "$session.firstHalf.checkIn.time" } },
                    //     firstHalf: {
                    //       checkIn: { $dateToString: { format: "%H:%M", date: "$session.firstHalf.checkIn.time" } },
                    //       checkOut: { $dateToString: { format: "%H:%M", date: "$session.firstHalf.checkOut.time" } }
                    //     },
                    //     secondHalf: {
                    //       checkIn: { $dateToString: { format: "%H:%M", date: "$session.secondHalf.checkIn.time" } },
                    //       checkOut: { $dateToString: { format: "%H:%M", date: "$session.secondHalf.checkOut.time" } }
                    //     },
                    //     totalHoursWorked: "$totalHoursWorked",
                    //     wholeDayStatus: "$wholeDayStatus"
                    //   }
                    // }
                    attendance: {
                        $push: {
                            date: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$session.firstHalf.checkIn.time",
                                    timezone: "+05:30"  // Convert date to IST
                                }
                            },
                            firstHalf: {
                                checkIn: {
                                    $dateToString: {
                                        format: "%H:%M",
                                        date: "$session.firstHalf.checkIn.time",
                                        timezone: "+05:30"  // Convert checkIn to IST
                                    }
                                },
                                checkOut: {
                                    $dateToString: {
                                        format: "%H:%M",
                                        date: "$session.firstHalf.checkOut.time",
                                        timezone: "+05:30"  // Convert checkOut to IST
                                    }
                                }
                            },
                            secondHalf: {
                                checkIn: {
                                    $dateToString: {
                                        format: "%H:%M",
                                        date: "$session.secondHalf.checkIn.time",
                                        timezone: "+05:30"  // Convert checkIn to IST
                                    }
                                },
                                checkOut: {
                                    $dateToString: {
                                        format: "%H:%M",
                                        date: "$session.secondHalf.checkOut.time",
                                        timezone: "+05:30"  // Convert checkOut to IST
                                    }
                                }
                            },
                            totalHoursWorked: "$totalHoursWorked",
                            wholeDayStatus: "$wholeDayStatus"
                        }
                    }

                }

            },

            {
                $project: {
                    _id: 0,
                    employeeId: "$_id.employeeId",
                    orgId: "$_id.orgId",
                    organisationName: "$_id.organisationName",
                    employeeName: "$_id.employeeName",
                    branch: "$_id.branch",
                    department: "$_id.department",
                    designation: "$_id.designation",
                    attendanceApprove: "$_id.attendanceApprove",
                    attendance: 1
                }
            }

        ]

        return await aggregationWithPegination(aggregationFilter, body, collectionName, query);

    } catch (error) {
        console.log("...error..", error?.message)
        logger.error("Error while getting employee attendence data in employeeAttendence model ");
        throw error
    }
}


// export const getAttendanceDataRejectedUserId=async(body)=>{
//     try{
//         const orgId=body?.user?.orgId
//         const userId=body?.user?._id
//         const{branchId,departmentId,designationId,attendanceApprove}=body

//         const status=attendanceApprove?attendanceApprove:'Approved'


//         if(!userId || !orgId || !branchId || !departmentId || !designationId) return {status:false,message:"parameters are missing"}

//         const { startDate, endDate } = setStartAndEndDate(body); // Assuming this function returns start and end date
//         const query={
//             orgId:orgId,
//             userId:userId,
//             createdAt: {
//                 $gte: startDate,
//                 $lt: endDate // Exclude the next month's records
//             }
//         }


//         const aggregationFilter=[
//             {
//               $match: {
//                     orgId:orgId,
//                     attendanceApprove:status,
//                     createdAt: {
//                         $gte: startDate,
//                         $lt: endDate // Exclude the next month's records
//                     }
//                 }
//             },

//             { $lookup: { from: "user", localField: "userId", foreignField: "_id", as: "userDetails" } }, 
//             { $unwind: "$userDetails" },

//             { $lookup: { from: "assignment", localField: "userDetails.assignmentId", foreignField: "_id", as: "assignmentDetails" } }, {$unwind:"$assignmentDetails"},

//             { $lookup: { from: "organization", localField: "assignmentDetails.orgId", foreignField: "_id", as: "organisationDetails" } }, { $unwind: "$organisationDetails" },

//             { $lookup: { from: "branches", localField: "assignmentDetails.branchId", foreignField: "_id", as: "branchDetails" } }, { $unwind: "$branchDetails" },

//             { $lookup: { from: "department", localField: "assignmentDetails.departmentId", foreignField: "_id", as: "departmentDetails" } }, { $unwind: "$departmentDetails" },

//             { $lookup: { from: "designation", localField: "assignmentDetails.designationId", foreignField: "_id", as: "designationDetails" } }, { $unwind: "$designationDetails" },
//             {
//                 $match:{
//                     "branchDetails._id": new ObjectId(branchId),
//                     "departmentDetails._id": new ObjectId(departmentId),
//                     "designationDetails._id": new ObjectId(designationId),
//                     createdAt: {
//                         $gte: startDate,
//                         $lt: endDate // Exclude the next month's records
//                     }
//                 }
//             },
//             {
//                 $group:{
//                     _id: {
//                       employeeId: "$userDetails._id",
//                       orgId:"$organisationDetails._id",
//                       organisationName:"$organisationDetails.name",
//                       employeeName: { $concat: ["$userDetails.name.firstName", " ", "$userDetails.name.lastName"] },
//                       branch: "$branchDetails.name",
//                       department: "$departmentDetails.name",
//                       designation: "$designationDetails.name",
//                       attendanceApprove:"$attendanceApprove"

//                     },

//                     attendance: {
//                         $push: {
//                           date: { 
//                             $dateToString: { 
//                               format: "%Y-%m-%d", 
//                               date: "$session.firstHalf.checkIn.time", 
//                               timezone: "+05:30"  // Convert date to IST
//                             } 
//                           },
//                           firstHalf: {
//                             checkIn: { 
//                               $dateToString: { 
//                                 format: "%H:%M", 
//                                 date: "$session.firstHalf.checkIn.time", 
//                                 timezone: "+05:30"  // Convert checkIn to IST
//                               } 
//                             },
//                             checkOut: { 
//                               $dateToString: { 
//                                 format: "%H:%M", 
//                                 date: "$session.firstHalf.checkOut.time", 
//                                 timezone: "+05:30"  // Convert checkOut to IST
//                               } 
//                             }
//                           },
//                           secondHalf: {
//                             checkIn: { 
//                               $dateToString: { 
//                                 format: "%H:%M", 
//                                 date: "$session.secondHalf.checkIn.time", 
//                                 timezone: "+05:30"  // Convert checkIn to IST
//                               } 
//                             },
//                             checkOut: { 
//                               $dateToString: { 
//                                 format: "%H:%M", 
//                                 date: "$session.secondHalf.checkOut.time", 
//                                 timezone: "+05:30"  // Convert checkOut to IST
//                               } 
//                             }
//                           },
//                           totalHoursWorked: "$totalHoursWorked",
//                           wholeDayStatus: "$wholeDayStatus"
//                         }
//                       }

//                 }

//             },  

//             {
//                 $project: {
//                     _id: 0,
//                     employeeId: "$_id.employeeId",
//                     orgId: "$_id.orgId",
//                     organisationName: "$_id.organisationName",
//                     employeeName: "$_id.employeeName",
//                     branch: "$_id.branch",
//                     department: "$_id.department",
//                     designation: "$_id.designation",
//                     attendanceApprove:"$_id.attendanceApprove",
//                     attendance: 1
//                 }
//             }

//         ]

//         return await aggregationWithPegination(aggregationFilter,body,collectionName,query);

//     }catch(error){
//         console.log("...error..",error?.message)
//         logger.error("Error while getting employee attendence data in employeeAttendence model ");
//         throw error
//     }
// }

// export const getAttendanceDataRejectedUserId = async (body) => {
//     try {
//         const orgId = body?.user?.orgId;
//         const userId = body?.user?._id;
//         const { branchId, departmentId, designationId, attendanceApprove } = body;

//         const status = attendanceApprove ? attendanceApprove : 'Approved';

//         // Validate required parameters
//         if (!userId || !orgId || !branchId || !departmentId || !designationId) {
//             return { status: false, message: "parameters are missing" };
//         }

//         const { startDate, endDate } = setStartAndEndDate(body); // Assuming this function returns start and end date
//         const query = {
//             orgId: orgId,
//             userId: userId,
//             createdAt: {
//                 $gte: startDate,
//                 $lt: endDate // Exclude the next month's records
//             }
//         };

//         const aggregationFilter = [
//             {
//                 $match: {
//                     orgId: orgId,
//                     attendanceApprove: status,
//                     createdAt: {
//                         $gte: startDate,
//                         $lt: endDate // Exclude the next month's records
//                     }
//                 }
//             },
//             { $lookup: { from: "user", localField: "userId", foreignField: "_id", as: "userDetails" } },
//             { $unwind: "$userDetails" },
//             { $lookup: { from: "assignment", localField: "userDetails.assignmentId", foreignField: "_id", as: "assignmentDetails" } },
//             { $unwind: "$assignmentDetails" },
//             { $lookup: { from: "organization", localField: "assignmentDetails.orgId", foreignField: "_id", as: "organisationDetails" } },
//             { $unwind: "$organisationDetails" },
//             { $lookup: { from: "branches", localField: "assignmentDetails.branchId", foreignField: "_id", as: "branchDetails" } },
//             { $unwind: "$branchDetails" },
//             { $lookup: { from: "department", localField: "assignmentDetails.departmentId", foreignField: "_id", as: "departmentDetails" } },
//             { $unwind: "$departmentDetails" },
//             { $lookup: { from: "designation", localField: "assignmentDetails.designationId", foreignField: "_id", as: "designationDetails" } },
//             { $unwind: "$designationDetails" },
//             {
//                 $match: {
//                     "branchDetails._id": new ObjectId(branchId),
//                     "departmentDetails._id": new ObjectId(departmentId),
//                     "designationDetails._id": new ObjectId(designationId),
//                     createdAt: {
//                         $gte: startDate,
//                         $lt: endDate // Exclude the next month's records
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: {
//                         employeeId: "$userDetails._id",
//                         orgId: "$organisationDetails._id",
//                         organisationName: "$organisationDetails.name",
//                         employeeName: { $concat: ["$userDetails.name.firstName", " ", "$userDetails.name.lastName"] },
//                         branch: "$branchDetails.name",
//                         department: "$departmentDetails.name",
//                         designation: "$designationDetails.name",
//                         attendanceApprove: "$attendanceApprove"
//                     },
//                     attendance: {
//                         $push: {
//                             date: {
//                                 $dateToString: {
//                                     format: "%Y-%m-%d",
//                                     date: "$session.firstHalf.checkIn.time",
//                                     timezone: "+05:30" // Convert date to IST
//                                 }
//                             },
//                             firstHalf: {
//                                 checkIn: {
//                                     $dateToString: {
//                                         format: "%H:%M", // Use 12-hour format with AM/PM
//                                         date: "$session.firstHalf.checkIn.time",
//                                         timezone: "+05:30" // Convert checkIn to IST
//                                     }
//                                 },
//                                 checkOut: {
//                                     $dateToString: {
//                                         format: "%H:%M", // Use 12-hour format with AM/PM
//                                         date: "$session.firstHalf.checkOut.time",
//                                         timezone: "+05:30" // Convert checkOut to IST
//                                     }
//                                 }
//                             },
//                             secondHalf: {
//                                 checkIn: {
//                                     $dateToString: {
//                                         format: "%H:%M", // Use 12-hour format with AM/PM
//                                         date: "$session.secondHalf.checkIn.time",
//                                         timezone: "+05:30" // Convert checkIn to IST
//                                     }
//                                 },
//                                 checkOut: {
//                                     $dateToString: {
//                                         format: "%H:%M", // Use 12-hour format with AM/PM
//                                         date: "$session.secondHalf.checkOut.time",
//                                         timezone: "+05:30" // Convert checkOut to IST
//                                     }
//                                 }
//                             },
//                             totalHoursWorked: "$totalHoursWorked",
//                             wholeDayStatus: "$wholeDayStatus"
//                         }
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     employeeId: "$_id.employeeId",
//                     orgId: "$_id.orgId",
//                     organisationName: "$_id.organisationName",
//                     employeeName: "$_id.employeeName",
//                     branch: "$_id.branch",
//                     department: "$_id.department",
//                     designation: "$_id.designation",
//                     attendanceApprove: "$_id.attendanceApprove",
//                     attendance: 1
//                 }
//             }
//         ];

//         return await aggregationWithPegination(aggregationFilter, body, collectionName, query);
//     } catch (error) {
//         console.log("...error..", error?.message);
//         logger.error("Error while getting employee attendance data in employeeAttendance model");
//         throw error;
//     }
// };



export const getAttendanceDataRejectedUserId = async (body) => {
    try {
        const orgId = body?.user?.orgId;
        const userId = body?.user?._id;
        console.log("...userId...", userId)
        const { branchId, departmentId, designationId, attendanceApprove } = body;

        const status = attendanceApprove ? attendanceApprove : 'Approved';

        // Validate required parameters
        if (!userId || !orgId || !branchId || !departmentId || !designationId) {
            return { status: false, message: "parameters are missing" };
        }

        const { startDate, endDate } = setStartAndEndDate(body); // Assuming this function returns start and end date
        const query = {
            orgId: orgId,
            userId: userId,
            createdAt: {
                $gte: startDate,
                $lt: endDate // Exclude the next month's records
            }
        };

        const aggregationFilter = [
            {
                $match: {
                    orgId: orgId,
                    userId: userId,
                    attendanceApprove: status,
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate // Exclude the next month's records
                    }
                }
            },
            { $lookup: { from: "user", localField: "userId", foreignField: "_id", as: "userDetails" } },
            { $unwind: "$userDetails" },
            { $lookup: { from: "assignment", localField: "userDetails.assignmentId", foreignField: "_id", as: "assignmentDetails" } },
            { $unwind: "$assignmentDetails" },
            { $lookup: { from: "organization", localField: "assignmentDetails.orgId", foreignField: "_id", as: "organisationDetails" } },
            { $unwind: "$organisationDetails" },
            { $lookup: { from: "branches", localField: "assignmentDetails.branchId", foreignField: "_id", as: "branchDetails" } },
            { $unwind: "$branchDetails" },
            { $lookup: { from: "department", localField: "assignmentDetails.departmentId", foreignField: "_id", as: "departmentDetails" } },
            { $unwind: "$departmentDetails" },
            { $lookup: { from: "designation", localField: "assignmentDetails.designationId", foreignField: "_id", as: "designationDetails" } },
            { $unwind: "$designationDetails" },
            {
                $match: {
                    "branchDetails._id": new ObjectId(branchId),
                    "departmentDetails._id": new ObjectId(departmentId),
                    "designationDetails._id": new ObjectId(designationId),
                }
            },
            {
                $group: {
                    _id: {
                        employeeId: "$userDetails._id",
                        orgId: "$organisationDetails._id",
                        organisationName: "$organisationDetails.name",
                        employeeName: { $concat: ["$userDetails.name.firstName", " ", "$userDetails.name.lastName"] },
                        branch: "$branchDetails.name",
                        department: "$departmentDetails.name",
                        designation: "$designationDetails.name",
                        attendanceApprove: "$attendanceApprove"
                    },
                    attendance: {
                        $push: {
                            date: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$session.firstHalf.checkIn.time",
                                    timezone: "+05:30" // Convert date to IST
                                }
                            },
                            firstHalf: {
                                checkIn: {
                                    $dateToString: {
                                        format: "%H:%M", // Use 12-hour format with AM/PM
                                        date: "$session.firstHalf.checkIn.time",
                                        timezone: "+05:30" // Convert checkIn to IST
                                    }
                                },
                                checkOut: {
                                    $dateToString: {
                                        format: "%H:%M", // Use 12-hour format with AM/PM
                                        date: "$session.firstHalf.checkOut.time",
                                        timezone: "+05:30" // Convert checkOut to IST
                                    }
                                }
                            },
                            secondHalf: {
                                checkIn: {
                                    $dateToString: {
                                        format: "%H:%M", // Use 12-hour format with AM/PM
                                        date: "$session.secondHalf.checkIn.time",
                                        timezone: "+05:30" // Convert checkIn to IST
                                    }
                                },
                                checkOut: {
                                    $dateToString: {
                                        format: "%H:%M", // Use 12-hour format with AM/PM
                                        date: "$session.secondHalf.checkOut.time",
                                        timezone: "+05:30" // Convert checkOut to IST
                                    }
                                }
                            },
                            totalHoursWorked: "$totalHoursWorked",
                            wholeDayStatus: "$wholeDayStatus",
                            attendanceApprove: status
                        }
                    }
                }

            },
            { $unwind: "$attendance" },
            {
                $group: {
                    _id: "$_id.employeeId",
                    employeeId: { $first: "$_id.employeeId" },
                    orgId: { $first: "$_id.orgId" },
                    organisationName: { $first: "$_id.organisationName" },
                    employeeName: { $first: "$_id.employeeName" },
                    branch: { $first: "$_id.branch" },
                    department: { $first: "$_id.department" },
                    designation: { $first: "$_id.designation" },
                    attendance: { $push: "$attendance" },
                    // Count statuses based on the collected array
                    totalApproved: { $sum: { $cond: [{ $eq: ["$attendanceApprove", "Approved"] }, 1, 0] } },
                    totalRejected: { $sum: { $cond: [{ $eq: ["$attendanceApprove", "Rejected"] }, 1, 0] } },
                    totalPending: { $sum: { $cond: [{ $eq: ["$attendanceApprove", "Pending"] }, 1, 0] } }
                }
            },

            {
                $project: {
                    _id: 0,
                    employeeId: 1,
                    orgId: 1,
                    organisationName: 1,
                    employeeName: 1,
                    branch: 1,
                    department: 1,
                    designation: 1,
                    attendance: 1,
                    statistics: {
                        totalApproved: "$totalApproved",
                        totalRejected: "$totalRejected",
                        totalPending: "$totalPending"
                    }
                }
            }
        ];

        return await aggregationWithPegination(aggregationFilter, body, collectionName, query);
    } catch (error) {
        console.log("...error..", error?.message);
        logger.error("Error while getting employee attendance data in employeeAttendance model");
        throw error;
    }
};


//approved data manually
export const approvedAttendenceDataManually = async (body) => {
    try {
        const orgId = body?.user?.orgId;
        const { attendanceUpdates, attendanceDate } = body;
        const currentDate = new Date(attendanceDate); // This sets to the current date and time
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Start of today (00:00:00)
        const endOfDay = new Date(startOfDay); // Copy startOfDay
        endOfDay.setDate(endOfDay.getDate() + 1); // Start of tomorrow (00:00:00 next day)
        // Loop through each attendance update and apply status updates
        const bulkOperations = attendanceUpdates.map(({ userId, attendanceStatus }) => ({
            updateOne: {
                filter: {
                    userId: new ObjectId(userId),
                    orgId: orgId,
                    createdAt: {
                        $gte: startOfDay,
                        $lt: endOfDay // Exclude the next month's records
                    }

                },
                update: {
                    $set: { attendanceApprove: attendanceStatus }
                }
            }
        }));

        // Perform bulk write operation
        return await bulkWriteOperations(bulkOperations, collectionName);


    } catch (error) {
        console.log("...error..", error?.message);
        logger.error("Error while getting employee attendance data in employeeAttendance model");
        throw error;
    }

}


// Get branch-wise attendance data with percentages and employee count
export const getBranchWiseAttendanceData = async (body) => {
    try {
        const orgId = body?.user?.orgId;
        const { startDate, endDate } = setStartAndEndDate(body);
        const query = {
            orgId: orgId,
            createdAt: {
                $gte: startDate,
                $lt: endDate // Exclude the next month's records
            }
        };
        const aggregationFilter = [
            {
                $match: {
                    orgId: orgId,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate // Exclude the next month's records
                    }
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "assignment",
                    localField: "userDetails.assignmentId",
                    foreignField: "_id",
                    as: "assignmentDetails"
                }
            },
            { $unwind: "$assignmentDetails" },
            {
                $lookup: {
                    from: "branches",
                    localField: "assignmentDetails.branchId",
                    foreignField: "_id",
                    as: "branchDetails"
                }
            },
            { $unwind: "$branchDetails" },
            {
                $group: {
                    _id: {
                        branchId: "$branchDetails._id",
                        branchName: "$branchDetails.name"
                    },
                    totalEmployees: { $sum: 1 },
                    presentCount: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
                    absentCount: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
                    checkInLateCount: { $sum: { $cond: [{ $eq: ["$checkInStatus", "late"] }, 1, 0] } },
                    earlyCheckOutCount: { $sum: { $cond: [{ $eq: ["$checkOutStatus", "early"] }, 1, 0] } },
                    pendingApprovalCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.pending] }, 1, 0] } },
                    approvedCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.approved] }, 1, 0] } },
                    rejectedCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.rejected] }, 1, 0] } }
                }
            },
            {
                $addFields: {
                    presentPercentage: { $multiply: [{ $divide: ["$presentCount", "$totalEmployees"] }, 100] },
                    absentPercentage: { $multiply: [{ $divide: ["$absentCount", "$totalEmployees"] }, 100] },
                    checkInLatePercentage: { $multiply: [{ $divide: ["$checkInLateCount", "$totalEmployees"] }, 100] },
                    earlyCheckOutPercentage: { $multiply: [{ $divide: ["$earlyCheckOutCount", "$totalEmployees"] }, 100] },
                    pendingApprovalPercentage: { $multiply: [{ $divide: ["$pendingApprovalCount", "$totalEmployees"] }, 100] },
                    approvedPercentage: { $multiply: [{ $divide: ["$approvedCount", "$totalEmployees"] }, 100] },
                    rejectedPercentage: { $multiply: [{ $divide: ["$rejectedCount", "$totalEmployees"] }, 100] }
                }
            },
            {
                $project: {
                    _id: 0,
                    branchId: "$_id.branchId",
                    branchName: "$_id.branchName",
                    totalEmployees: 1,
                    presentCount: 1,
                    presentPercentage: 1,
                    absentCount: 1,
                    absentPercentage: 1,
                    checkInLateCount: 1,
                    checkInLatePercentage: 1,
                    earlyCheckOutCount: 1,
                    earlyCheckOutPercentage: 1,
                    pendingApprovalCount: 1,
                    pendingApprovalPercentage: 1,
                    approvedCount: 1,
                    approvedPercentage: 1,
                    rejectedCount: 1,
                    rejectedPercentage: 1
                }
            }
        ];


        return await aggregationWithPegination(aggregationFilter, body, collectionName, query);



    } catch (error) {
        console.error("Error in getBranchWiseAttendanceData: ", error.message);
        throw error

    }
};



// Get department-wise attendance data for a specific branch
export const getDepartmentWiseAttendanceData = async (body) => {
    try {
        const orgId = body?.user?.orgId;
        const { branchId } = body; // assuming branchId is passed in the request body
        const { startDate, endDate } = setStartAndEndDate(body);

        const aggregationFilter = [
            {
                $match: {
                    orgId: orgId,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "assignment",
                    localField: "userDetails.assignmentId",
                    foreignField: "_id",
                    as: "assignmentDetails"
                }
            },
            { $unwind: "$assignmentDetails" },
            {
                $match: {
                    "assignmentDetails.branchId": new ObjectId(branchId) // Match the branchId from assignmentDetails
                }
            },
            {
                $lookup: {
                    from: "department",
                    localField: "assignmentDetails.departmentId",
                    foreignField: "_id",
                    as: "departmentDetails"
                }
            },
            { $unwind: "$departmentDetails" },
            {
                $group: {
                    _id: {
                        departmentId: "$departmentDetails._id",
                        departmentName: "$departmentDetails.name"
                    },
                    totalEmployees: { $sum: 1 },
                    presentCount: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
                    absentCount: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
                    checkInLateCount: { $sum: { $cond: [{ $eq: ["$checkInStatus", "late"] }, 1, 0] } },
                    earlyCheckOutCount: { $sum: { $cond: [{ $eq: ["$checkOutStatus", "early"] }, 1, 0] } },
                    pendingApprovalCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.pending] }, 1, 0] } },
                    approvedCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.approved] }, 1, 0] } },
                    rejectedCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.rejected] }, 1, 0] } }
                }
            },
            {
                $addFields: {
                    presentPercentage: { $multiply: [{ $divide: ["$presentCount", "$totalEmployees"] }, 100] },
                    absentPercentage: { $multiply: [{ $divide: ["$absentCount", "$totalEmployees"] }, 100] },
                    checkInLatePercentage: { $multiply: [{ $divide: ["$checkInLateCount", "$totalEmployees"] }, 100] },
                    earlyCheckOutPercentage: { $multiply: [{ $divide: ["$earlyCheckOutCount", "$totalEmployees"] }, 100] },
                    pendingApprovalPercentage: { $multiply: [{ $divide: ["$pendingApprovalCount", "$totalEmployees"] }, 100] },
                    approvedPercentage: { $multiply: [{ $divide: ["$approvedCount", "$totalEmployees"] }, 100] },
                    rejectedPercentage: { $multiply: [{ $divide: ["$rejectedCount", "$totalEmployees"] }, 100] }
                }
            },
            {
                $project: {
                    _id: 0,
                    departmentId: "$_id.departmentId",
                    departmentName: "$_id.departmentName",
                    totalEmployees: 1,
                    presentCount: 1,
                    presentPercentage: 1,
                    absentCount: 1,
                    absentPercentage: 1,
                    checkInLateCount: 1,
                    checkInLatePercentage: 1,
                    earlyCheckOutCount: 1,
                    earlyCheckOutPercentage: 1,
                    pendingApprovalCount: 1,
                    pendingApprovalPercentage: 1,
                    approvedCount: 1,
                    approvedPercentage: 1,
                    rejectedCount: 1,
                    rejectedPercentage: 1
                }
            }
        ];

        return await aggregationWithPegination(aggregationFilter, body, collectionName);

    } catch (error) {
        console.error("Error in getDepartmentWiseAttendanceData: ", error.message);
        throw error;
    }
};

export const getDesignationWiseAttendanceData = async (body) => {
    try {
        const orgId = body?.user?.orgId;
        const { branchId, departmentId } = body; // assuming branchId and departmentId are passed in the request body
        const { startDate, endDate } = setStartAndEndDate(body);

        const query = {
            orgId: orgId,
            createdAt: {
                $gte: startDate,
                $lt: endDate // Exclude the next month's records
            }
        };

        const aggregationFilter = [
            {
                $match: {
                    orgId: orgId,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "assignment",
                    localField: "userDetails.assignmentId",
                    foreignField: "_id",
                    as: "assignmentDetails"
                }
            },
            { $unwind: "$assignmentDetails" },
            {
                $match: {
                    "assignmentDetails.branchId": new ObjectId(branchId),
                    "assignmentDetails.departmentId": new ObjectId(departmentId) // Filtering by departmentId
                }
            },
            {
                $lookup: {
                    from: "designation",
                    localField: "assignmentDetails.designationId",
                    foreignField: "_id",
                    as: "designationDetails"
                }
            },
            { $unwind: "$designationDetails" },
            {
                $group: {
                    _id: {
                        designationId: "$designationDetails._id",
                        designationName: "$designationDetails.name"
                    },
                    totalEmployees: { $sum: 1 },
                    presentCount: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
                    absentCount: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
                    checkInLateCount: { $sum: { $cond: [{ $eq: ["$checkInStatus", "late"] }, 1, 0] } },
                    earlyCheckOutCount: { $sum: { $cond: [{ $eq: ["$checkOutStatus", "early"] }, 1, 0] } },
                    pendingApprovalCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.pending] }, 1, 0] } },
                    approvedCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.approved] }, 1, 0] } },
                    rejectedCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.rejected] }, 1, 0] } }
                }
            },
            {
                $addFields: {
                    presentPercentage: { $multiply: [{ $divide: ["$presentCount", "$totalEmployees"] }, 100] },
                    absentPercentage: { $multiply: [{ $divide: ["$absentCount", "$totalEmployees"] }, 100] },
                    checkInLatePercentage: { $multiply: [{ $divide: ["$checkInLateCount", "$totalEmployees"] }, 100] },
                    earlyCheckOutPercentage: { $multiply: [{ $divide: ["$earlyCheckOutCount", "$totalEmployees"] }, 100] },
                    pendingApprovalPercentage: { $multiply: [{ $divide: ["$pendingApprovalCount", "$totalEmployees"] }, 100] },
                    approvedPercentage: { $multiply: [{ $divide: ["$approvedCount", "$totalEmployees"] }, 100] },
                    rejectedPercentage: { $multiply: [{ $divide: ["$rejectedCount", "$totalEmployees"] }, 100] }
                }
            },
            {
                $project: {
                    _id: 0,
                    designationId: "$_id.designationId",
                    designationName: "$_id.designationName",
                    totalEmployees: 1,
                    presentCount: 1,
                    presentPercentage: 1,
                    absentCount: 1,
                    absentPercentage: 1,
                    checkInLateCount: 1,
                    checkInLatePercentage: 1,
                    earlyCheckOutCount: 1,
                    earlyCheckOutPercentage: 1,
                    pendingApprovalCount: 1,
                    pendingApprovalPercentage: 1,
                    approvedCount: 1,
                    approvedPercentage: 1,
                    rejectedCount: 1,
                    rejectedPercentage: 1
                }
            }
        ];

        return await aggregationWithPegination(aggregationFilter, body, collectionName, query);

    } catch (error) {
        console.error("Error in getDesignationWiseAttendanceData: ", error.message);
        throw error;
    }
};



export const getEmployeesSummaryAttendenceData = async (body) => {
    try {
        const orgId = body?.user?.orgId;
        const { branchId, departmentId, designationId } = body; // branchId, departmentId are passed in the request body
        const { startDate, endDate } = setStartAndEndDate(body);

        const query = {
            orgId: orgId,
            createdAt: {
                $gte: startDate,
                $lt: endDate // Exclude the next month's records
            }
        };

        const aggregationFilter = [
            {
                $match: {
                    orgId: orgId,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "assignment",
                    localField: "userDetails.assignmentId",
                    foreignField: "_id",
                    as: "assignmentDetails"
                }
            },
            { $unwind: "$assignmentDetails" },
            {
                $lookup: {
                    from: "organization",
                    localField: "assignmentDetails.orgId",
                    foreignField: "_id",
                    as: "organizationDetails"
                }
            },
            { $unwind: "$organizationDetails" },
            {
                $lookup: {
                    from: "branches",
                    localField: "assignmentDetails.branchId",
                    foreignField: "_id",
                    as: "branchDetails"
                }
            },
            { $unwind: "$branchDetails" },
            {
                $lookup: {
                    from: "designation",
                    localField: "assignmentDetails.designationId",
                    foreignField: "_id",
                    as: "designationDetails"
                }
            },
            { $unwind: "$designationDetails" },
            {
                $match: {
                    "assignmentDetails.branchId": new ObjectId(branchId),
                    "assignmentDetails.departmentId": new ObjectId(departmentId),
                    "assignmentDetails.designationId": new ObjectId(designationId) // Filter by designationId
                }
            },

            {
                $group: {
                    _id: "$userId",
                    employeeId: { $first: "$userDetails._id" },
                    employeeName: { $first: "$userDetails.name" },
                    branchId: { $first: "$assignmentDetails.branchId" },
                    departmentId: { $first: "$assignmentDetails.departmentId" },
                    designationId: { $first: "$assignmentDetails.designationId" },
                    organizationName: { $first: "$organizationDetails.name" },
                    branchName: { $first: "$branchDetails.name" }, // Added branchName
                    designationName: { $first: "$designationDetails.name" },
                    totalAttendanceRecords: { $sum: 1 },
                    presentCount: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
                    absentCount: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
                    checkInLateCount: { $sum: { $cond: [{ $eq: ["$checkInStatus", "late"] }, 1, 0] } },
                    earlyCheckOutCount: { $sum: { $cond: [{ $eq: ["$checkOutStatus", "early"] }, 1, 0] } },
                    pendingApprovalCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.pending] }, 1, 0] } },
                    approvedCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.approved] }, 1, 0] } },
                    rejectedCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.rejected] }, 1, 0] } }
                }
            },
            {
                $addFields: {
                    presentPercentage: { $multiply: [{ $divide: ["$presentCount", "$totalAttendanceRecords"] }, 100] },
                    absentPercentage: { $multiply: [{ $divide: ["$absentCount", "$totalAttendanceRecords"] }, 100] },
                    checkInLatePercentage: { $multiply: [{ $divide: ["$checkInLateCount", "$totalAttendanceRecords"] }, 100] },
                    earlyCheckOutPercentage: { $multiply: [{ $divide: ["$earlyCheckOutCount", "$totalAttendanceRecords"] }, 100] },
                    pendingApprovalPercentage: { $multiply: [{ $divide: ["$pendingApprovalCount", "$totalAttendanceRecords"] }, 100] },
                    approvedPercentage: { $multiply: [{ $divide: ["$approvedCount", "$totalAttendanceRecords"] }, 100] },
                    rejectedPercentage: { $multiply: [{ $divide: ["$rejectedCount", "$totalAttendanceRecords"] }, 100] }
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: 1,
                    employeeName: 1,
                    branchId: 1,
                    departmentId: 1,
                    designationId: 1,
                    organizationName: 1,
                    branchName: 1,
                    designationName: 1,
                    totalAttendanceRecords: 1,
                    presentCount: 1,
                    presentPercentage: 1,
                    absentCount: 1,
                    absentPercentage: 1,
                    checkInLateCount: 1,
                    checkInLatePercentage: 1,
                    earlyCheckOutCount: 1,
                    earlyCheckOutPercentage: 1,
                    pendingApprovalCount: 1,
                    pendingApprovalPercentage: 1,
                    approvedCount: 1,
                    approvedPercentage: 1,
                    rejectedCount: 1,
                    rejectedPercentage: 1
                }
            }
        ];

        return await aggregationWithPegination(aggregationFilter, body, collectionName, query);

    } catch (error) {
        console.error("Error in getEmployeesSummaryAttendenceData: ", error.message);
        throw error;
    }
};


export const getEmployeeSummaryAttendenceDataUserId = async (body) => {
    try {
        const orgId = body?.user?.orgId;
        const { branchId, departmentId, designationId } = body; // branchId, departmentId are passed in the request body
        const { startDate, endDate } = setStartAndEndDate(body);

        const query = {
            orgId: orgId,
            createdAt: {
                $gte: startDate,
                $lt: endDate // Exclude the next month's records
            }
        };

        const aggregationFilter = [
            {
                $match: {
                    orgId: orgId,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "assignment",
                    localField: "userDetails.assignmentId",
                    foreignField: "_id",
                    as: "assignmentDetails"
                }
            },
            { $unwind: "$assignmentDetails" },
            {
                $lookup: {
                    from: "organization",
                    localField: "assignmentDetails.orgId",
                    foreignField: "_id",
                    as: "organizationDetails"
                }
            },
            { $unwind: "$organizationDetails" },
            {
                $lookup: {
                    from: "branches",
                    localField: "assignmentDetails.branchId",
                    foreignField: "_id",
                    as: "branchDetails"
                }
            },
            { $unwind: "$branchDetails" },
            {
                $lookup: {
                    from: "designation",
                    localField: "assignmentDetails.designationId",
                    foreignField: "_id",
                    as: "designationDetails"
                }
            },
            { $unwind: "$designationDetails" },
            {
                $match: {
                    "userDetails._id": new ObjectId(body.employeeUserId) // Assuming userId is passed in the request body
                }
            },
            {
                $match: {
                    "assignmentDetails.branchId": new ObjectId(branchId),
                    "assignmentDetails.departmentId": new ObjectId(departmentId),
                    "assignmentDetails.designationId": new ObjectId(designationId) // Filter by designationId
                }
            },

            {
                $group: {
                    _id: "$userId",
                    employeeId: { $first: "$userDetails._id" },
                    employeeName: { $first: "$userDetails.name" },
                    branchId: { $first: "$assignmentDetails.branchId" },
                    departmentId: { $first: "$assignmentDetails.departmentId" },
                    designationId: { $first: "$assignmentDetails.designationId" },
                    organizationName: { $first: "$organizationDetails.name" },
                    branchName: { $first: "$branchDetails.name" }, // Added branchName
                    designationName: { $first: "$designationDetails.name" },
                    totalAttendanceRecords: { $sum: 1 },
                    presentCount: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
                    absentCount: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
                    checkInLateCount: { $sum: { $cond: [{ $eq: ["$checkInStatus", "late"] }, 1, 0] } },
                    earlyCheckOutCount: { $sum: { $cond: [{ $eq: ["$checkOutStatus", "early"] }, 1, 0] } },
                    pendingApprovalCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.pending] }, 1, 0] } },
                    approvedCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.approved] }, 1, 0] } },
                    rejectedCount: { $sum: { $cond: [{ $eq: ["$approvalStatus", attendanceApprovalStatus.rejected] }, 1, 0] } }
                }
            },
            {
                $addFields: {
                    presentPercentage: { $multiply: [{ $divide: ["$presentCount", "$totalAttendanceRecords"] }, 100] },
                    absentPercentage: { $multiply: [{ $divide: ["$absentCount", "$totalAttendanceRecords"] }, 100] },
                    checkInLatePercentage: { $multiply: [{ $divide: ["$checkInLateCount", "$totalAttendanceRecords"] }, 100] },
                    earlyCheckOutPercentage: { $multiply: [{ $divide: ["$earlyCheckOutCount", "$totalAttendanceRecords"] }, 100] },
                    pendingApprovalPercentage: { $multiply: [{ $divide: ["$pendingApprovalCount", "$totalAttendanceRecords"] }, 100] },
                    approvedPercentage: { $multiply: [{ $divide: ["$approvedCount", "$totalAttendanceRecords"] }, 100] },
                    rejectedPercentage: { $multiply: [{ $divide: ["$rejectedCount", "$totalAttendanceRecords"] }, 100] }
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: 1,
                    employeeName: 1,
                    branchId: 1,
                    departmentId: 1,
                    designationId: 1,
                    organizationName: 1,
                    branchName: 1,
                    designationName: 1,
                    totalAttendanceRecords: 1,
                    presentCount: 1,
                    presentPercentage: 1,
                    absentCount: 1,
                    absentPercentage: 1,
                    checkInLateCount: 1,
                    checkInLatePercentage: 1,
                    earlyCheckOutCount: 1,
                    earlyCheckOutPercentage: 1,
                    pendingApprovalCount: 1,
                    pendingApprovalPercentage: 1,
                    approvedCount: 1,
                    approvedPercentage: 1,
                    rejectedCount: 1,
                    rejectedPercentage: 1
                }
            }
        ];

        return await aggregationWithPegination(aggregationFilter, body, collectionName, query);

    } catch (error) {
        console.error("Error in getEmployeesSummaryAttendenceData: ", error.message);
        throw error;
    }
};


// get attendence data of pending for cron job to update approved/rejecetd
export const getAttendanceDataPending = async (body) => {
    try {
        const { startDate, endDate } = setStartAndEndDate(body);

        const query = {
            createdAt: { $gte: startDate, $lte: endDate },
            attendanceApprove: 'Pending'
        }

        console.log("....query...", query)
        return await getMany(query, collectionName)

    } catch (error) {
        console.error("Error in getAttendanceDataPending: ", error.message);
        throw error;
    }
}

/**
 * get attendance data from attendanceLog with shift details.
 */
export const getAttendanceDetails = async (body) => {
    try{
        const {_id,orgId} = body.user;
        const query = {
            userId: new ObjectId(_id),
            orgId: new ObjectId(orgId)
        };

        const shiftDetails = body.shiftDetails[0].currentShiftDetails;
        const now = new Date();
        let startDate = new Date(now);
        let endDate = new Date(now);
    
        // Convert shift start and end to Date objects
        const shiftStartTime = new Date(now);
        const shiftEndTime = new Date(now);

        const [startHour, startMinute] = shiftDetails.startTime.split(":").map(Number);
        const [endHour, endMinute] = shiftDetails.endTime.split(":").map(Number);

        shiftStartTime.setHours(startHour, startMinute, 0, 0);
        shiftEndTime.setHours(endHour, endMinute, 0, 0);
    
        shiftStartTime.setHours(shiftStartTime.getHours() - 2);
        shiftEndTime.setHours(shiftEndTime.getHours() + 2);
        
        if (startHour > endHour) {
            if (now.getHours() < 6) {
                startDate.setDate(now.getDate() - 1);
            }else{
                endDate.setDate(now.getDate() + 1);
            }
        }

        startDate.setHours(shiftStartTime.getHours(), shiftStartTime.getMinutes(), 0, 0);
        endDate.setHours(shiftEndTime.getHours(), shiftEndTime.getMinutes(), 0, 0);

        query.createdAt = {
            $gte: startDate,
            $lte: endDate
        }

        logger.debug(JSON.stringify(query))

        const aggregationPipeline = [
            {
                $match: query

            },
            {
                $lookup: {
                    from: "attendanceLogs",
                    localField: "_id",
                    foreignField: "employeeAttendanceId",
                    as: "attendanceLog"
                }
            },
        ];

        return aggregate(aggregationPipeline,collectionName);
    }catch (error) {
        console.error("Error in getAttendanceDetails in attendence module");
        throw error;
    }
};

/**
 * get attendence details.
 */

export const listAttendence = async (body) => {
    try{
        
        let params = Object.create(null);
        if(body._id) params["_id"] = body._id
        if(body.user_id) params["userId"] = new ObjectId(body.user_id);
        if(body.orgId) params["orgId"] = new ObjectId(body.orgId);
        if(body.shiftId) params["shiftId"] = new ObjectId(body.shiftId);
        if(body.date) {
            params["transactionDate"] = {$gte: new Date(body.date.startDate), $lte: new Date(body.date.endDate)};
        };
        if(body.branchId) params["branchId"] = new ObjectId(body.branchId);

        const aggregationPipeline = [
            {
                $match: params
            },
            {
                $lookup: {
                    from: "shift",
                    localField: "shiftId",
                    foreignField: "_id",
                    as: "shiftDetails"
                }
            },
            {
                $unwind: "$shiftDetails"
            },
            {
                $addFields: {
                    startHour: {$toInt: {$substr: ["$shiftDetails.startTime", 0, 2]}},
                   // startMinute: {$toInt: {$substr: ["$shiftDetails.startTime", 3, 2]}},
                    endHour: {$toInt: {$substr: ["$shiftDetails.endTime", 0, 2]}},
                    //endMinute: {$toInt: {$substr: ["$shiftDetails.endTime", 3, 2]}},
                    date:{
                        $cond: {
                            if: {$gt: ["$startHour", "$endHour"]},
                            then: {
                                $cond: {
                                    if: {$lt: [{$hour: "$transactionDate"}, 6]},
                                    then:"$transactionDate",
                                    else: {
                                        $dateAdd: {
                                            startDate: "$transactionDate",
                                            unit: "day",
                                            amount: -1
                                        }
                                    }
                                }
                            },
                            else: "$transactionDate"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    shiftDetails: {
                        _id: 1,
                        name:1,
                        startTime:1,
                        endTime:1
                    },
                    workingHours:1,
                    date: 1,
                    type: 1,
                    checkIn:1,
                    checkOut:1

                }
            }
        ];

        return await aggregationWithPegination(aggregationPipeline,body,collectionName)
    }catch(error){
        logger.error("Error while listAttendence in attendence module");
        throw error;
    }
}

export const generateTransactionLog = async (body) => {
    try {
        const { user, shiftId,branchId,transactionDate, type, existingCheckInOutData, geoJson, geoLocation, nearestShift} = body
        const query = {
            orgId : new ObjectId(user.orgId),
            userId : new ObjectId(user._id),
            shiftId : new ObjectId(shiftId),
            ...(body.branchId && { branchId: new ObjectId(body.branchId) }),
            transactionDate : new Date(transactionDate),
            geoJson: geoJson,
            geoLocation: geoLocation,
            type : type,
            source : nearestShift?.source,
            createdDate: new Date(),
            createdBy : new ObjectId(body.authUserId),
            // location: body.location,
            imagePath: body.imagePath,
            ...(body.clientId && { clientId: new ObjectId(body.clientId) }),
            ...(body.clientMappedId && { clientMappedId: new ObjectId(body.clientMappedId)}),
            ...(body.distanceAway && { distanceAway: body.distanceAway}),
            ...(body.branchRadius && { branchRadius: body.branchRadius }),
            ...body.approvalBits
        };
        // console.log("......existingCheckInOutData...",existingCheckInOutData)
        if(existingCheckInOutData?._id) query.employeeAttendanceId = existingCheckInOutData._id
        if(body.employeeAttendenceId) query.employeeAttendanceId = body.employeeAttendenceId

        return await create(query, 'attendanceLogs');
    } catch (error) {
        console.error("Error in generateTransactionLog: ", error.message);
        throw error;
    }
}

// check if shift exists
export const ifShiftExist = async (body) => {
    try {
        let query = {
            orgId: body?.user?.orgId,
            isActive: true
        }
        if (body.shiftId) query._id = new ObjectId(body.shiftId)
        return await getOne(query, 'shift')
    } catch (error) {
        console.error("Error in generateTransactionLog: ", error.message);
        throw error;
    }
};

export const getAttendanceLogs = async (body) => {
    try{
        body.orgId = body.user.orgId;

        let params = Object.create(null);

        if(body._id) params["_id"] = body._id;
        if(body.userId)
        {
            params["userId"] = new ObjectId(body.userId);
        }
        else
        {
            params["userId"] = new ObjectId(body.user._id);
        }
        if(body.orgId) params["orgId"] = new ObjectId(body.orgId);
        if(body.shiftId) params["shiftId"] = new ObjectId(body.shiftId);
        if(body.employeeAttendanceId) params["employeeAttendanceId"] = new ObjectId(body.employeeAttendanceId);
        if (body.date) {
            let {startDate, endDate} = getUTCDateRange(body.date, 0)

            params["transactionDate"] = {$gte: startDate,$lte: endDate}
        }

        let timingQuery = {
            shift: [
                {
                    $lookup: {
                        from: "shift",
                        localField: "shiftId",
                        foreignField: "_id",
                        as: "shift"
                    }
                },
                {
                    $group: {
                        _id: "$shiftId",
                        shiftName: {
                            $first: {
                                $arrayElemAt: ["$shift.name", 0]
                            }
                        },
                        startTime: {
                            $first: {
                                $arrayElemAt: ["$shift.startTime", 0]
                            }
                        },
                        endTime: {
                            $first: {
                                $arrayElemAt: ["$shift.endTime", 0]
                            }
                        },
                        transactionDate: {
                            $first: "$transactionDate"
                        },
                        transactions: {
                            $push: {
                                _id: "$_id",
                                type: "$type",
                                transactionDate: "$transactionDate",
                                approvalStatus: "$approvalStatus",
                                geoJson: "$geoJson",
                                geoLocation: "$geoLocation",
                                imagePath: "$imagePath",
                                extendApproveStatus: "$extendApproveStatus",
                                isTimeMatch: "$isTimeMatch",
                                isLocationMatch: "$isLocationMatch",
                                isBranchMatch: "$isBranchMatch",
                                isShiftMatch: "$isShiftMatch",
                                isClientMatch: "$isClientMatch",
                            }
                        }
                    }
                },
            ],
            branch: [
                {
                    $lookup: {
                        from: "branches",
                        localField: "branchId",
                        foreignField: "_id",
                        as: "branch"
                    }
                },
                {
                    $group: {
                        _id: "$branchId",
                        branchName: {
                            $first: {
                                $arrayElemAt: ["$branch.name", 0]
                            }
                        },
                        startTime: {
                            $first: {
                                $arrayElemAt: ["$branch.startTime", 0]
                            }
                        },
                        endTime: {
                            $first: {
                                $arrayElemAt: ["$branch.endTime", 0]
                            }
                        },
                        transactionDate: {
                            $first: "$transactionDate"
                        },
                        transactions: {
                            $push: {
                                _id: "$_id",
                                type: "$type",
                                transactionDate: "$transactionDate",
                                approvalStatus: "$approvalStatus",
                                geoJson: "$geoJson",
                                geoLocation: "$geoLocation",
                                imagePath: "$imagePath",
                                extendApproveStatus: "$extendApproveStatus",
                                isTimeMatch: "$isTimeMatch",
                                isLocationMatch: "$isLocationMatch",
                                isBranchMatch: "$isBranchMatch",
                                isShiftMatch: "$isShiftMatch",
                                isClientMatch: "$isClientMatch",
                            }
                        }
                    }
                },
            ]
        }

        let query = [
            {
                $match: params
            },
            ...timingQuery[body.existingCheckInOutData?.workTimingType],
            {
                $project: {
                    shiftName: 1,
                    branchName: 1,
                    startTime:1,
                    endTime:1,
                    noOfShifts: 1,
                    transactions: 1,
                    transactionDate:1,
                    _id: 0
                }
            }
        ]
        let projectQuery = query[query.length - 1]['$project']
        body.existingCheckInOutData?.workTimingType ? query[query.length - 1]['$project'] = {[`${body.existingCheckInOutData?.workTimingType}Id`]: "$_id",...projectQuery}: null
        console.log(JSON.stringify(query))
        return await aggregationWithPegination(query,{limit: body.limit, page: body.page},'attendanceLogs');
    }catch(error){
        logger.error("Error while getAttendanceLogs in attendence module");
        throw error;
    }
}

export const getAllUserLogStatus = async (body) => {
    try{
        body.orgId = body.user.orgId;

        let params = Object.create(null);

        if(body._id) params["_id"] = body._id;
        // if(body.userId)
        // {
        //     params["userId"] = new ObjectId(body.userId);
        // }
        // else
        // {
        //     params["userId"] = new ObjectId(body.user._id);
        // }
        if(body.orgId) params["orgId"] = new ObjectId(body.orgId);
        if(body.shiftId) params["shiftId"] = new ObjectId(body.shiftId);
        if(body.employeeAttendanceId) params["employeeAttendanceId"] = new ObjectId(body.employeeAttendanceId);
        if (body.date) {
            let {startDate, endDate} = getUTCDateRange(body.date, 0)

            params["transactionDate"] = {$gte: startDate,$lte: endDate}
        }
        let userIds = Object.keys(body.allUsers)
        params['userId'] = {$in : body.employeeIds && body.employeeIds.length > 0 ? userIds.filter(id => body.employeeIds.includes(id)).map(mapid => new ObjectId(mapid)) : userIds.map(mapid => new ObjectId(mapid))}

        let query = [
            {
                $match: params
            },
            {
                $group: {
                    _id: "$userId",
                    transactionDate: {
                        $first: "$transactionDate"
                    },
                    transactions: {
                        $push: {
                            _id: "$_id",
                            shiftId: "$shiftId",
                            type: "$type",
                            transactionDate: "$transactionDate",
                            approvalStatus: "$approvalStatus",
                            geoJson: "$geoJson",
                            geoLocation: "$geoLocation",
                            imagePath: "$imagePath",
                            extendApproveStatus:
                                "$extendApproveStatus"
                        }
                    }
                }
            },
            {
                $addFields: {
                    approvalStatus: {
                        $switch: {
                            branches: [
                                // 1. If ANY approvalStatus is null OR array length is odd → "pending"
                                {
                                    case: {
                                        $or: [
                                            {
                                                $gt: [
                                                    {
                                                        $size: {
                                                            $filter: {
                                                                input: "$transactions",
                                                                cond: { $eq: ["$$this.approvalStatus", null] }
                                                            }
                                                        }
                                                    },
                                                    0
                                                ]
                                            },
                                            {
                                                $eq: [
                                                    { $mod: [{ $size: "$transactions" }, 2] },
                                                    1
                                                ]
                                            }
                                        ]
                                    },
                                    then: "pending"
                                },
                                // 2. If ALL approvalStatus are true → "approval"
                                {
                                    case: {
                                        $eq: [
                                            {
                                                $size: {
                                                    $filter: {
                                                        input: "$transactions",
                                                        cond: { $eq: ["$$this.approvalStatus", true] }
                                                    }
                                                }
                                            },
                                            { $size: "$transactions" }
                                        ]
                                    },
                                    then: "approved"
                                },
                                // 3. If ALL approvalStatus are false → "rejected"
                                {
                                    case: {
                                        $eq: [
                                            {
                                                $size: {
                                                    $filter: {
                                                        input: "$transactions",
                                                        cond: { $eq: ["$$this.approvalStatus", false] }
                                                    }
                                                }
                                            },
                                            { $size: "$transactions" }
                                        ]
                                    },
                                    then: "rejected"
                                }
                            ],
                            default: "mixed"
                        }
                    }
                }

            },
            {
                $project: {
                    userId: "$_id",
                    shiftId: "$shiftId",
                    shiftName: 1,
                    startTime: 1,
                    endTime: 1,
                    noOfShifts: 1,
                    transactions: 1,
                    transactionDate: 1,
                    approvalStatus: 1,
                    _id: 0
                }
            },
            {
                $match:
                {
                    approvalStatus: body.statusType
                }
            }
        ]
        console.log(JSON.stringify(query))
        return await aggregationWithPegination(query,{limit: body.limit, page: body.page},'attendanceLogs');
    }catch(error){
        logger.error("Error while getAttendanceLogs in attendence module");
        throw error;
    }
}

export const updateStatus = async (body) => {
    try{
        let query = {
            _id: new ObjectId(body.attendanceLogId),
            orgId: new ObjectId(body.user.orgId)
        }

        let updateData = {
            approvalStatus: body.approvalStatus,
            updatedBy: new ObjectId(body.user._id),
            updatedAt: new Date()
        }

        if (body.approvalStatus === "approved") {
            updateData.approvedBy = new ObjectId(body.user._id);
            updateData.approvedAt = new Date();
        } else if (body.approvalStatus === "rejected") {
            updateData.rejectedBy = new ObjectId(body.user._id);
            updateData.rejectedAt = new Date();
        }

        return await updateOne(query, updateData, 'attendanceLogs');
    }catch(error){
        logger.error("Error while updateStatus in attendence module");
        throw error;
    }
}

export const getLatestAttendanceLogs = async (body) => {
    try{
        let query = [
            {
                $match:
                {
                    employeeAttendanceId: body.existingCheckInOutData?._id
                }
            },
            {
                $sort:
                {
                    _id: -1
                }
            },
            {
                $limit: 1
            }
        ]

        return await aggregate(query, 'attendanceLogs');
    }catch(error){
        logger.error("Error while getAttendanceLogs in attendence module");
        throw error;
    }
}

export const defaultCheckOut = async (body) => {
    try{
        let query = {
            orgId : new ObjectId(body.user.orgId),
            userId : new ObjectId(body.user._id),
            shiftId : new ObjectId(body.shiftId),
            branchId : new ObjectId(body.branchId),
            transactionDate : new Date(body.transactionDate),
            geoJson: body.geoJson,
            geoLocation: body.geoLocation,
            type: body.type,
            createdAt: new Date(),
            // location: body.location,
            imagePath: body.imagePath,
            ...(body.clientId && { clientId: new ObjectId(body.clientId) }),
            ...(body.clientMappedId && { clientMappedId: new ObjectId(body.clientMappedId) }),
            approvalStatus: null,
            employeeAttendanceId: body.existingCheckInOutData._id,
        }

        return await create(query, 'attendanceLogs');
    }catch(error){
        logger.error("Error while getAttendanceLogs in attendence module");
        throw error;
    }
}

// all users attendece statistics
export const getAllUsersAttendenceStats= async (body) => {
      try
      {
        const query = {
        //   userId: new ObjectId(body.userId),
          orgId: new ObjectId(body.user.orgId),
          year: body.year,
          ...(body.month && {month:body.month}) 
        //   ...(body.employeeId && {userId:new ObjectId(body.employeeId)})  
        }

        
        
    
        const aggregateQuery =[
            {$match :query},
            {
                $lookup:{
                    from:'user',
                    localField:'userId',
                    foreignField:'_id',
                    as:'userDetails'
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
              $lookup: {
                from: "assignment",
                localField: "userDetails.assignmentId",
                foreignField: "_id",
                as: "matchedAssignments"
              }
            },
            {
              $unwind: {path:"$matchedAssignments"}
            },
            {
                $project:{
                    userId:1,
                    name:"$userDetails.name",
                    month:1,
                    workingDays:"$monthDays",
                    presentDays:1,
                    // lateIn:{ $add: ["$lateIn", "$today.lateIn"] },
                    lateIn: { $add: [ { $ifNull: ["$lateIn", 0] }, "$today.lateIn" ] },
                    earlyIn: { $add: [ { $ifNull: ["$earlyIn", 0] }, "$today.earlyIn" ] },
                    onTimeIn: { $add: [ { $ifNull: ["$onTimeIn", 0] }, "$today.onTimeIn" ] },
                    earlyOut: { $add: [ { $ifNull: ["$earlyOut", 0] }, "$today.earlyOut" ] },
                    lateOut: { $add: [ { $ifNull: ["$lateOut", 0] }, "$today.lateOut" ] },
                    onTimeOut: { $add: [ { $ifNull: ["$onTimeOut", 0] }, "$today.onTimeOut" ] },
                    noOfShifts: { $add: [ { $ifNull: ["$noOfShifts", 0] }, {$ifNull:["$today.noOfShifts",0]} ]}
                }
            }
        ]

        let matchQuery = {};
        if(body.orgIds && body.orgIds.length>0) matchQuery["matchedAssignments.subOrgId"] = {$in: body.orgIds.map(id => new ObjectId(id))}
        if(body.branchIds && body.branchIds.length>0) matchQuery["matchedAssignments.branchId"] = {$in: body.branchIds.map(id => new ObjectId(id))}
        if(body.departmentIds && body.departmentIds.length>0) matchQuery["matchedAssignments.departmentId"] = {$in: body.departmentIds.map(id => new ObjectId(id))}
        if(body.designationIds && body.designationIds.length>0) matchQuery["matchedAssignments.designationId"] = {$in: body.designationIds.map(id => new ObjectId(id))}
        if(body.employeeIds && body.employeeIds.length>0) matchQuery["userDetails._id"] = {$in: body.employeeIds.map(id => new ObjectId(id))}

        if (Object.keys(matchQuery).length > 0) {
            aggregateQuery.splice(5, 0, { $match: matchQuery })
        }
        console.log(".....query...",JSON.stringify(aggregateQuery))
        return await aggregationWithPegination(aggregateQuery,{page:body.page|| 1 ,limit:body.limit || 10},'attendenceStatistics')
      }
      catch (error) {
        logger.error("Error in getAllUsersAttendenceStats in attendence model")
        throw error;
      }
}

export const getUserMonthAttendenceLogs = async (body) => {
    try {
        const year = body.year;
        const month = body.month;
        
        const start = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00.000Z`);
        const endMonth = month === 12 ? 1 : month + 1;
        const endYear = month === 12 ? year + 1 : year;
        const end = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`);
        const page = Number(body.page) || 1;
        const limit = Number(body.limit) || 10;
        const skip = (page - 1) * limit;
        const query = {
            userId: new ObjectId(body.employeeId),
            orgId: new ObjectId(body.user.orgId),
            // transactionDate: {
            //   $gte: new Date(`${body.year}-${body.month}-01T00:00:00.000Z`),
            //   $lt: new Date(`${body.month === 12 ? body.year + 1 : body.year}-${body.month === 12 ? 1 : body.month + 1}-01T00:00:00.000Z`)
            // }
            transactionDate: {
                $gte: start,
                $lt: end
            }
        };
  
      const aggregateQuery = [
        { $match: query },
        {
          $addFields: {
            dateStr: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$transactionDate",
                timezone: "Asia/Kolkata"
              }
            }
          }
        },
        {
          $sort: {
            transactionDate: 1
          }
        },
        {
          $group: {
            _id: "$dateStr",
            shifts: {
              $addToSet: "$shiftId"
            },
            transactions: {
              $push: {
                type: "$type",
                transactionDate: "$transactionDate",
                approvalStatus: "$approvalStatus"
              }
            },
            allCheckOuts: {
              $push: {
                $cond: [
                  {
                    $eq: ["$type", "checkOut"]
                  },
                  "$transactionDate",
                  "$$REMOVE"
                ]
              }
            }
          }
        },
        {
          $addFields: {
            noOfShifts: {
              $size: "$shifts"
            }
          }
        },
        {
          $project: {
            date: "$_id",
            checkIn: 1,
            noOfShifts: 1,
            transactions: 1,
            _id: 0
          }
        },

      ];

    //   console.log("....aggregateQuery...",JSON.stringify(aggregateQuery))
    //   return await aggregate(aggregateQuery,'attendanceLogs');
    let paginationQuery={
        page: page,
        limit: limit,
        sortBy:"date", 
        sortOrder:1
    }
      return await aggregationWithPegination(aggregateQuery, paginationQuery,'attendanceLogs');
    } catch (error) {
      logger.error("Error in getUserMonthAttendenceLogs in attendence model")
      throw error;
    }
};


// attendence dashboard status
export const getUserAttendenceDashboardStatus= async (body) => {
    try
    {
      
        if(!body.existingCheckInOutData?._id)return{status:false,data:[]}
        const query = {
      //   userId: new ObjectId(body.userId),
        employeeAttendanceId:new ObjectId(body.existingCheckInOutData._id),
        orgId: new ObjectId(body.user.orgId),
        userId: new ObjectId(body.user._id),  
      }
      
      const aggregation=[
        {$match:{...query}},
        {$project:{
            _id:1,
            type:1,
            shiftId:1
        }}
      ]
      console.log(".....query...",JSON.stringify(aggregation))
  
      return await aggregationWithPegination(aggregation,{sortBy:'transactionDate',sortOrder: -1},'attendanceLogs')
    }
    catch (error) {
      logger.error("Error in getAllUsersAttendenceStats in attendence model")
      throw error;
    }
}

export const getExistingCheckInShiftId=async(body)=>{
    try {
        const orgId = body?.user?.orgId;
        const userId = body?.user?._id;
        // const txnTime = new Date('2025-06-30T10:19:00.000Z');
        const txnTimeUTC = new Date()
        const txnTimeIST = new Date(txnTimeUTC.getTime() + 5.5 * 60 * 60 * 1000);
        const txnTime=txnTimeUTC

        if (!userId || !orgId) return { status: false, message: "Missing IDs" };

        const startOfDay = new Date(txnTime);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(txnTime);
        endOfDay.setHours(23, 59, 59, 999);


        const aggregation = [
            {
              $match: {
                orgId: new ObjectId(orgId),
                userId: new ObjectId(userId),
                transactionDate: { $gte: startOfDay, $lte: endOfDay }
              }
            },
            // {
            //   $lookup: {
            //     from: "shift",
            //     localField: "shiftId",
            //     foreignField: "_id",
            //     as: "shiftDetails"
            //   }
            // },
            // { $unwind: "$shiftDetails" },
            // {
            //   $addFields: {
            //     shiftStart: {
            //       $dateFromParts: {
            //         year: { $year: txnTime },
            //         month: { $month: txnTime },
            //         day: { $dayOfMonth: txnTime },
            //         hour: {
            //           $toInt: {
            //             $arrayElemAt: [{ $split: ["$shiftDetails.startTime", ":"] }, 0]
            //           }
            //         },
            //         minute: {
            //           $toInt: {
            //             $arrayElemAt: [{ $split: ["$shiftDetails.startTime", ":"] }, 1]
            //           }
            //         }
            //       }
            //     },
            //     shiftEnd: {
            //       $dateFromParts: {
            //         year: { $year: txnTime },
            //         month: { $month: txnTime },
            //         day: { $dayOfMonth: txnTime },
            //         hour: {
            //           $toInt: {
            //             $arrayElemAt: [{ $split: ["$shiftDetails.endTime", ":"] }, 0]
            //           }
            //         },
            //         minute: {
            //           $toInt: {
            //             $arrayElemAt: [{ $split: ["$shiftDetails.endTime", ":"] }, 1]
            //           }
            //         }
            //       }
            //     }
            //   }
            // },
            // {
            //   $match: {
            //     $expr: {
            //       $and: [
            //         { $lte: ["$shiftStart", txnTime] },
            //         { $gte: ["$shiftEnd", txnTime] }
            //       ]
            //     }
            //   }
            // },
            { $sort: { transactionDate: -1 } },
            { $limit: 1 }
        ];
      

        // console.log("......aggregation....",JSON.stringify(aggregation))

        const result = await aggregationWithPegination(aggregation,{},collectionName);

        if (result.data.length<1) return { status: false, data: null };
        return { status: true, data: result.data[0] };

    } catch (error) {
        // console.error("Error in getExistingCheckInShiftId:", error.message);
        logger.error("Error in getExistingCheckInShiftId in attendence model")
        throw error;
    }
}


export const addEmployeeAttendenceStats2 = async (body) => {
    try {
      const { user, type, messageStatus, checkExisting, checkExistingDaily, existingCheckInOutData,employeeAttendenceId } = body;
  
      const date = moment(body.transactionDate);
      const todayStr = body.nearestShift?.dayCross && body.type == 'checkOut' ? moment(body.transactionDate).subtract(1, 'days').format('YYYY-MM-DD') : date.format('YYYY-MM-DD');
      const timeStr = date.format("HH:mm:ss");
      const year = date.year();
      const month = date.month() + 1;
      const attendanceId = existingCheckInOutData?._id ?? body.employeeAttendenceId;
  
      const query = {
        userId: new ObjectId(user._id),
        orgId: new ObjectId(user.orgId),
        year,
        month
      };
  
      const doc = checkExisting?.data;
      const docDaily = checkExistingDaily?.data;
      const update = {};
      const $inc = {};
      const $set = {};
  
      if (!doc) {
        const startOfMonth = moment(`${year}-${month}-01`);
        const endOfMonth = moment(startOfMonth).endOf('month');
        let workingDays = 0;
        for (let d = startOfMonth.clone(); d.isSameOrBefore(endOfMonth); d.add(1, 'day')) {
          if (d.day() !== 0) workingDays++;
        }
        $set.monthDays = workingDays;
        $set.presentDays = 1;
        $set.createdDate = new Date();
      }
  
      const today = doc?.today || {
        date: todayStr,
        earlyIn: 0,
        lateIn: 0,
        onTimeIn: 0,
        earlyOut: 0,
        lateOut: 0,
        onTimeOut: 0,
        totalBreakMinutes: 0,
        totalWorkingMinutes: 0,
        checkInCount: 0,
        checkOutCount: 0,
        noOfShifts: 0,
        shifts: {}
      };
      today.shifts = today.shifts || {}; 
  
      const isNewDay = today.date !== todayStr;
      if (isNewDay && doc?.today) {
        const y = doc.today;
        // Backup flat today summary
        await create({
            ...query,
            date: y.date,
            createdAt: new Date(),
            ...y
        }, "ShiftAttendanceSummary");

         // Backup each shift in separate collection
        const shiftEntries = Object.entries(y.shifts || {});
        for (const [shiftId, shift] of shiftEntries) {
            await create({
            ...query,
            shiftId,
            date: y.date,
            createdAt: new Date(),
            ...shift
            }, "ShiftAttendanceDetails");
        }

        $inc.earlyIn = y.earlyIn || 0;
        $inc.lateIn = y.lateIn || 0;
        $inc.onTimeIn = y.onTimeIn || 0;
        $inc.earlyOut = y.earlyOut || 0;
        $inc.lateOut = y.lateOut || 0;
        $inc.onTimeOut = y.onTimeOut || 0;
        $inc.totalMonthlyBreakMinutes = y.totalBreakMinutes || 0;
        $inc.totalMonthlyWorkingMinutes = y.totalWorkingMinutes || 0;
        $inc.presentDays = 1;
        $inc.noOfShifts = Object.keys(y.shifts || {}).length;
        $inc.checkInCount = y.checkInCount || 0;
        $inc.checkOutCount = y.checkOutCount || 0;
  
        today.date = todayStr;
        today.earlyIn = 0;
        today.lateIn = 0;
        today.onTimeIn = 0;
        today.earlyOut = 0;
        today.lateOut = 0;
        today.onTimeOut = 0;
        today.totalBreakMinutes = 0;
        today.totalWorkingMinutes = 0;
        today.checkInCount = 0;
        today.checkOutCount = 0;
        today.noOfShifts = 0;
        today.shifts = {};
      }
  
      const shiftKey = attendanceId.toString();
      const isNewShift = !today.shifts[shiftKey];
      today.shifts[shiftKey] = today.shifts[shiftKey] || {
        date: todayStr,
        checkInCount: 0,
        checkOutCount: 0,
        earlyIn: 0,
        lateIn: 0,
        onTimeIn: 0,
        earlyOut: 0,
        lateOut: 0,
        onTimeOut: 0,
        workingMinutes: 0,
        breakMinutes: 0,
        // lastInTime: null,
        // lastOutTime: null,
        // messageStatus: null
      };
      if (isNewShift) {
        today.noOfShifts += 1;
      }
      const shiftStats = today.shifts[shiftKey];
  
      // Correct call inside model layer
      const logsResult = await findWithPegination(
        {
          userId: new ObjectId(user._id),
          employeeAttendanceId: new ObjectId(attendanceId),
          transactionDate: {
            $gte: new Date(`${todayStr}T00:00:00.000Z`),
            $lte: new Date(`${todayStr}T23:59:59.999Z`)
          }
        },
        { orgId: 0 },
        { limit: 1000, sortBy: "transactionDate", sortOrder: 1 },
        'attendanceLogs'
      );
  
      const logs = logsResult.data || [];
  
      let totalBreak = 0;
      for (let i = 0; i < logs.length - 1; i++) {
        if (logs[i].type === 'checkOut' && logs[i + 1].type === 'checkIn') {
          const out = moment(logs[i].transactionDate);
          const nextIn = moment(logs[i + 1].transactionDate);
          const diff = nextIn.diff(out, 'minutes');
          if (diff > 0) totalBreak += diff;
        }
      }
  
      today.totalBreakMinutes = totalBreak;
      shiftStats.breakMinutes = totalBreak;
  
    //   if (type === 'checkIn') {
    //     shiftStats.checkInCount++;
    //     // shiftStats.lastInTime = timeStr;
    //     today.checkInCount++;
    //     if (messageStatus === 1) {
    //         today.earlyIn++;
    //         shiftStats.earlyIn++;
    //     }
    //     if (messageStatus === 2){
    //         today.lateIn++;
    //         shiftStats.lateIn++;
    //     } 
    //     if (messageStatus === 3){
    //         today.onTimeIn++;
    //         shiftStats.onTimeIn++;
    //     }
    //   }
    if (type === 'checkIn') {
        shiftStats.checkInCount++;
        today.checkInCount++;
  
        if (!shiftStats.firstCheckInTime) {
          shiftStats.firstCheckInTime = timeStr;
          if (messageStatus === 1) {
            shiftStats.earlyIn++;
          }
          if (messageStatus === 2) {
            shiftStats.lateIn++;
          }
          if (messageStatus === 3) {
            shiftStats.onTimeIn++;
          }
        }
        shiftStats.latestCheckInTime = timeStr;
      }
  
    //   if (type === 'checkOut') {
    //     shiftStats.checkOutCount++;
    //     shiftStats.lastOutTime = timeStr;
    //     today.checkOutCount++;
  
        // if (shiftStats.lastInTime) {
        //   const mins = moment(`${todayStr} ${timeStr}`, 'YYYY-MM-DD HH:mm:ss')
        //     .diff(moment(`${todayStr} ${shiftStats.lastInTime}`, 'YYYY-MM-DD HH:mm:ss'), 'minutes');
        //   if (mins > 0) {
        //     shiftStats.workingMinutes += mins;
        //     today.totalWorkingMinutes += mins;
        //   }
        // }
  
    //     if (messageStatus === 4){
    //         today.earlyOut++;
    //         shiftStats.earlyOut++;
    //     }
    //     if (messageStatus === 5){
    //         today.lateOut++;
    //         shiftStats.lateOut++;
    //     }
    //     if (messageStatus === 6){
    //         today.onTimeOut++;
    //         shiftStats.onTimeOut++;
    //     }
    //   }
    if (type === 'checkOut') {
        shiftStats.checkOutCount++;
        today.checkOutCount++;
  
        shiftStats.latestCheckOutTime = timeStr;
  
        // Recalculate working minutes from checkIn → checkOut pairs
        let workingMinutes = 0;
        for (let i = 0; i < logs.length - 1; i++) {
        if (logs[i].type === 'checkIn' && logs[i + 1].type === 'checkOut') {
            const checkIn = moment(logs[i].transactionDate);
            const checkOut = moment(logs[i + 1].transactionDate);
            const diff = checkOut.diff(checkIn, 'minutes');
            if (diff > 0) workingMinutes += diff;
        }
        }
        shiftStats.workingMinutes = workingMinutes;

  
        // if (messageStatus === 4) shiftStats.earlyOut++;
        // if (messageStatus === 5) shiftStats.lateOut++;
        // if (messageStatus === 6) shiftStats.onTimeOut++;

        // Reset previous checkout status before applying new one
        shiftStats.earlyOut = 0;
        shiftStats.lateOut = 0;
        shiftStats.onTimeOut = 0;

        if (messageStatus === 4) shiftStats.earlyOut = 1;
        if (messageStatus === 5) shiftStats.lateOut = 1;
        if (messageStatus === 6) shiftStats.onTimeOut = 1;

      }

        // After shift updated — recalculate today's flat stats from all shifts
        const shiftValues = Object.values(today.shifts);

        today.checkInCount = shiftValues.reduce((sum, s) => sum + (s.checkInCount || 0), 0);
        today.checkOutCount = shiftValues.reduce((sum, s) => sum + (s.checkOutCount || 0), 0);
        today.earlyIn = shiftValues.reduce((sum, s) => sum + (s.earlyIn || 0), 0);
        today.lateIn = shiftValues.reduce((sum, s) => sum + (s.lateIn || 0), 0);
        today.onTimeIn = shiftValues.reduce((sum, s) => sum + (s.onTimeIn || 0), 0);
        today.earlyOut = shiftValues.reduce((sum, s) => sum + (s.earlyOut || 0), 0);
        today.lateOut = shiftValues.reduce((sum, s) => sum + (s.lateOut || 0), 0);
        today.onTimeOut = shiftValues.reduce((sum, s) => sum + (s.onTimeOut || 0), 0);
        today.totalWorkingMinutes = shiftValues.reduce((sum, s) => sum + (s.workingMinutes || 0), 0);
        today.totalBreakMinutes = shiftValues.reduce((sum, s) => sum + (s.breakMinutes || 0), 0);
        today.noOfShifts = shiftValues.length;

  
      $set.today = today;
      if (Object.keys($inc).length) update.$inc = $inc;
      if (Object.keys($set).length) update.$set = $set;
  
      if (!Object.keys(update).length) return;

      const docUpsertQuery = {...query, date: todayStr}

        const docUpsertUpdate = {
            $set: {
                ...docUpsertQuery,
                createdDate: new Date(),
                ...today
            }
      }
      await updateOneWithupsert(docUpsertQuery, docUpsertUpdate, 'ShiftAttendanceSummary',{upsert:true});
      return await findOneAndUpdate(query, update, "attendenceStatistics");
    } catch (error) {
      logger.error("Error in addEmployeeAttendenceStats", { stack: error.stack });
      throw error;
    }
};

export const getAllUserAttendance = async (body) => {
    try {
        let {startDate, endDate} = getUTCDateRange(getCurrentDateTime(), 0)

        let match = {
            orgId: body.user.orgId,
            $and: [
                {
                    transactionDate: {
                        $gte: new Date(
                            startDate
                        )
                    }
                },
                {
                    transactionDate: {
                        $lte: new Date(
                            endDate
                        )
                    }
                }
            ]
        }

        if(body.clientMappedId) match['clientMappedId'] = new ObjectId(body.clientMappedId);
        let query = [
            {
                $match: match
            },
            {
                $sort: {
                    _id: -1
                }
            },
            {
                $group: {
                    _id: "$userId",
                    data: {
                        $push: "$$ROOT"
                    }
                }
            },
            {
                $project:

                {
                    _id: 1,
                    data: {
                        $slice: ["$data", 2]
                    }
                }
            }
        ]
    // console.log(JSON.stringify(query))
    return await aggregate(query, 'attendanceLogs');
    }
    catch (error) {
        logger.error("Error in addEmployeeAttendenceStats", { stack: error.stack });
        throw error;

    }
}



export const getAttendencTotalLogsCount=async(body)=>{
    try{

        const year = body.year;
        const month = body.month;
        
        const start = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00.000Z`);
        const endMonth = month === 12 ? 1 : month + 1;
        const endYear = month === 12 ? year + 1 : year;
        const end = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`);
        const query = {
            userId: new ObjectId(body.employeeId),
            orgId: new ObjectId(body.user.orgId),
            transactionDate: {
                $gte: start,
                $lt: end
            }
        };

        const totalCountPipeline = [
            { $match: query },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$transactionDate",
                    timezone: "Asia/Kolkata"
                  }
                }
              }
            },
            { $count: "count" }
        ];

        return await aggregate(totalCountPipeline, 'attendanceLogs');

    }catch (error) {
        logger.error("Error in addEmployeeAttendenceStats", { stack: error.stack });
        throw error;

    }
}

export const getLogById = async(body) => {
    try {
        let query = {orgId: body.user.orgId,_id : new ObjectId(body.attendanceLogId)}

        return await getOne(query, "attendanceLogs", {clientMappedId:1,branchId : 1,geoJson:1,geoLocation:1,shiftId:1,imagePath:1,_id:1,type:1,transactionDate:1, approvalStatus:1, orgId:1})
    }
    catch(error) {
        logger.error("Error in getLogById", { stack: error.stack });
        throw error;
    }
}


export const updateApproveRejectAttendenceLogs=async(body)=>{
    try {
        let query = {
            orgId: body.user.orgId,
            userId: new ObjectId(body.employeeId),
            employeeAttendanceId: new ObjectId(body.existingCheckInOutData?._id)
        }
        // let status='pending'
        // if(body.approvalStatus===true){
        //     status='approved'
        // }else if(body.approvalStatus===false){
        //     status='rejected'
        // }

        let updateData = {
            approvalStatus: body.approvalStatus,
            modifiedBy: new ObjectId(body.user._id),
            modifiedDate: new Date()
        }

        return await updateMany(query, {$set:updateData}, 'attendanceLogs');
    } catch (error) {
        logger.error("Error in updateApproveRejectAttendenceLogs", { stack: error.stack });
        throw error;
    }
}
  
  