import { create, getOne, removeOne, findOneAndUpdate, aggregationWithPegination, updateOne, findWithPegination, getMany, bulkWriteOperations,aggregate } from '../../helper/mongo.js';
import { ObjectId } from 'mongodb';
import { logger } from '../../helper/logger.js';
import { attendanceApprovalStatus } from '../../helper/constants.js';
import moment from 'moment-timezone';
import { QueryBuilder } from "../../helper/filter.js";


const collectionName = 'employeeAttendance'

const attendance_log_collection = "attendanceLogs";
//this below function for add employee in daily checkin attendance
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
        logger.error("Error while creating add employee in employeeAttendance model ");
        throw error
    }
}

// update empoyee attendece data firsthalf checkout and second half checkin/checkout
export const updateEmployeeAttendanceData = async (body) => {
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
        logger.error("Error while  updateEmployeeAttendanceData employee in employeeAttendance model ");
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
        logger.error("Error while updating attendanceApprove in employeeAttendance model ");
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
        const userId = body?.user?._id

        if (!userId || !orgId) return { status: false, message: "either userId or orgId Not found" }

        // Get the current date
        const currentDate = new Date(body.transactionDate); // This sets to the current date and time       
        // const momentDate = moment(body.transactionDate)

        // Convert the finalStartDate to Date object and set it to the start of the day
        let start = new Date(body.transactionDate);
        start.setUTCHours(0, 0, 0, 0); // Start of the day

        // Convert the finalEndDate to Date object and set it to the end of the day
        let end = new Date(body.transactionDate);
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
        const getOneStatus = await getOne(query, collectionName);

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
        logger.error("Error while creating add employee in employeeAttendance model ");
        throw error;
    }
}


//get employees data based on branch/dept/desg/year/month
export const getEmployessAttendanceData = async (body) => {
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
        logger.error("Error while getting employee attendance data in employeeAttendance model ");
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

export const addAttendanceData = async (body) => {
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
            transactionDate: transactionDate
            // location: body.location,
        };

        if (body.shiftId) query.shiftId = new ObjectId(body.shiftId);
        if (body.assignmentData?.branchId) query.branchId = new ObjectId(body.assignmentData.branchId);
        if (body.assignmentData?.departmentId) query.departmentId = new ObjectId(body.assignmentData.departmentId);
        if (body.assignmentData?.designationId) query.designationId = new ObjectId(body.assignmentData.designationId);

        let updateData = {};
        if (['checkIn', 'checkOut'].includes(body.type)) {
            const key = body.type; // Dynamically set 'checkIn' or 'checkOut'
            query[key] = updateData[key] = {
                time: transactionDate,
                location: body.location,
            };
        }
        // Check if an attendance record exists for the same user, org, and the same day (ignoring time)
        // const existingRecord = await getOne(
        //     {
        //         userId: new ObjectId(userId),
        //         orgId: new ObjectId(orgId),
        //         transactionDate: { $gte: startOfDay, $lte: endOfDay } // Match only within the same day
        //     },
        //     collectionName
        // );

        if (body.existingCheckInOutData) {
            // Update existing record
            updateData.modifiedAt = new Date();
            updateData.transactionDate = transactionDate;
            
            if(body.type == 'checkOut') {
                if(!body.existingCheckInOutData.modifiedAt){
                    const diffMs = Math.abs(new Date(body.existingCheckInOutData.checkIn.time) - new Date(transactionDate));
                    const diffMinutes = Math.floor(diffMs / (1000 * 60));
                    const hours = Math.floor(diffMinutes / 60);
                    const minutes = diffMinutes % 60;
                
                    updateData.workingHours =   hours + '.' + minutes;
                }else{
                    const diffMs = Math.abs(new Date(body.existingCheckInOutData.modifiedAt) - new Date(transactionDate));
                    const diffMinutes = Math.floor(diffMs / (1000 * 60));
                    const hours = Math.floor(diffMinutes / 60);
                    const minutes = diffMinutes % 60;
                
                    updateData.workingHours = parseFloat(body.existingCheckInOutData.workingHours) + parseFloat(hours + '.' + minutes);                
                }
            }

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
            query.createdAt = new Date();
            const newRecord = await create(query, collectionName);

            if (newRecord.data.insertedId) {
                // Update new record with employeeAttendanceId
                await updateOne(
                    {
                        userId: new ObjectId(userId),
                        orgId: new ObjectId(orgId),
                        transactionDate: { $gte: startOfDay, $lte: endOfDay } // Match only within the same day
                    },
                    { $set: { employeeAttendanceId: newRecord.data.insertedId } },
                    'attendanceLogs'
                );
            }

            return newRecord;
        }
    } catch (error) {
        logger.error("Error while creating or updating employee attendance in employeeAttendance model",{stack: error.stack });
        throw error;
    }
}   

//Add attendance statistics 
export const addEmployeeAttendanceStats = async (body) => {
    try
    {
        const { user, message, type, messageStatus} = body;
        const date = moment(body.transactionDate);
        const year = date.year();
        const month = date.month() + 1;

        const insertObj = {}
        // messageStatus 1.EarlyIn, 2.LateIn, 3.Ontime CheckIn, 4.EarlyOut, 5.LateOut, 6. OnTime checkout
        if(type === 'checkIn')
        {
            if (messageStatus === 1) insertObj['earlyIn'] = 1
            else if (messageStatus === 2) insertObj['lateIn'] = 1
            else if (messageStatus === 3) insertObj['onTimeIn'] = 1
        }
        else if(type === 'checkOut')
        {
            if (messageStatus === 4) insertObj['earlyOut'] = 1
            else if (messageStatus === 5) insertObj['lateOut'] = 1
            else if (messageStatus === 6 ) insertObj['onTimeOut'] = 1
        }

        const query ={
            userId: new ObjectId(user._id),
            orgId: new ObjectId(user.orgId),
            year: year,
            month: month

        }

        return await findOneAndUpdate(query, { $inc: insertObj}, 'attendanceStatistics')
    }
    catch (error) {
        logger.error("Error while creating or updating employee attendance statistics in addEmployeeAttendanceStats model",{stack: error.stack });
        throw error;
    }
}

//get attendance summary data by userId
export const getEmployeeAttendanceStats = async (body) => {
  try
  {
    const query = {
      userId: new ObjectId(body.userId),
      orgId: new ObjectId(body.user.orgId),
      year: body.year,
      ...(body.month && {month:body.month})  
    }

    const aggregateQuery =[
        {$match :query},
        {
            $group: {
                _id: {
                  userId: "$userId",
                  orgId: "$orgId",
                },
                earlyIn: {$sum:{$ifNull: ["$earlyIn", 0]}},
                lateIn: {$sum:{$ifNull: ["$lateIn", 0]}},
                onTimeIn: {$sum:{$ifNull: ["$onTimeIn", 0]}},
                earlyOut: {$sum:{$ifNull: ["$earlyOut", 0]}},
                lateOut: {$sum:{$ifNull: ["$lateOut", 0]}},
                onTimeOut: {$sum:{$ifNull: ["$onTimeOut", 0]}},
            },
        }
    ]

    let result = await aggregate(aggregateQuery,'attendanceStatistics')

    if(result.data.length === 0)
    {
        result = { status: true , 
            data: [{ _id:{userId: query.userId, orgId: query.orgId}, 
                earlyIn:0, 
                lateIn:0, 
                onTimeIn:0, 
                earlyOut:0, 
                lateOut:0, 
                onTimeOut:0
            }]}
    }

    return result

  }
  catch (error) {
    console.error("Error in getEmployeeAttendanceStats in User model:", error.message);
    throw error;
  }
}

//get userId attendance data on date range
export const getAttendanceDataUserId = async (body) => {
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
        logger.error("Error while getting employee attendance data in employeeAttendance model ");
        throw error
    }
}


//get attendance summary data by userId
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
        logger.error("Error while getting employee attendance data in employeeAttendance model ");
        throw error
    }
}


export const getAllAttendanceData = async (body) => {
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
        logger.error("Error while getting employee attendance data in employeeAttendance model ");
        throw error
    }
}

//get attendance data rejected on branch/dept/desg
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
        logger.error("Error while getting employee attendance data in employeeAttendance model ");
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
//         logger.error("Error while getting employee attendance data in employeeAttendance model ");
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
export const approvedAttendanceDataManually = async (body) => {
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



export const getEmployeesSummaryAttendanceData = async (body) => {
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
        console.error("Error in getEmployeesSummaryAttendanceData: ", error.message);
        throw error;
    }
};


export const getEmployeeSummaryAttendanceDataUserId = async (body) => {
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
        console.error("Error in getEmployeesSummaryAttendanceData: ", error.message);
        throw error;
    }
};


// get attendance data of pending for cron job to update approved/rejecetd
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
        console.error("Error in getAttendanceDetails in attendance module");
        throw error;
    }
};

/**
 * get attendance details.
 */

export const listAttendance = async (body) => {
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
        logger.error("Error while listAttendance in attendance module");
        throw error;
    }
}

export const generateTransactionLog = async (body) => {
    try {
        const { user, shiftId, transactionDate, type, existingCheckInOutData } = body
        const query = {
            orgId : new ObjectId(user.orgId),
            userId : new ObjectId(user._id),
            shiftId : new ObjectId(shiftId),
            transactionDate : new Date(transactionDate),
            type,
            createdAt: new Date(),
            location: body.location,
            imagePath: body.imagePath,
            ...(body.clientId && { clientId: new ObjectId(body.clientId) }),
        };
        if(existingCheckInOutData?._id) query.employeeAttendanceId = existingCheckInOutData._id

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
            const start = new Date(`${body.date}T00:00:00.000Z`)
            const end = new Date(`${body.date}T23:59:59.999Z`)

            params["transactionDate"] = {$gte: start,$lte: end}
        }

        return await findWithPegination(params,{orgId:0}, body, 'attendanceLogs');
    }catch(error){
        logger.error("Error while getAttendanceLogs in attendance module");
        throw error;
    }
}