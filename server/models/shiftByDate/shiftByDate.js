import { logger } from "../../helper/logger.js";
import { ObjectId } from "mongodb";
import { aggregate, aggregationWithPegination, createMany, getMany, getOne, updateOne } from "../../helper/mongo.js";
import { QueryBuilder } from '../../helper/filter.js';
import moment from 'moment';

const collection_name = "shiftDate";

export const shiftDateCreate = async (body) => {
  try 
  {
    const { startDate, endDate, employeeIds, swappedUserId, swappedShiftId, assignedShiftId, employeeShiftId, reason,startTime,endTime} = body;
    const orgId = body.orgDetails._id;
    const createdBy = body.user._id;
    const entries = [];
    const end = endDate ? new Date(endDate) : new Date(startDate);
    let current = new Date(startDate);
    while (current <= end) {

      employeeIds.forEach(employeeId => {
        const entry = {
          orgId,
          employeeId: new ObjectId(employeeId),
          // employeeShiftId: new ObjectId(employeeShiftId),
          // assignedShiftId: new ObjectId(assignedShiftId),
          date: new Date(current),
          createdDate: new Date(),
          createdBy,
          isActive: true,
          status: createdBy === new ObjectId(employeeId) ? "pending" : "approved",
          ...(reason && { reason: reason })
        };

        // If single user and swap info exists, add to entry
        if (employeeIds.length === 1 && swappedUserId && swappedShiftId) {
          entry.swappedUserId = new ObjectId(swappedUserId);
          entry.swappedShiftId = new ObjectId(swappedShiftId);
        }

        for (let shifts_i = 0; shifts_i < body.shifts?.length; shifts_i++) {
          const shiftElement = body.shifts[shifts_i];
          let shiftEntry = {
            ...entry,
          }
   if(shiftElement.prevShiftId) shiftEntry['prevShiftId'] =shiftElement.prevShiftId =='WO'?'WO' : new ObjectId(shiftElement.prevShiftId)
                  if(shiftElement.currentShiftId) shiftEntry['currentShiftId'] = shiftElement?.currentShiftId=='WO' ?'WO': new ObjectId(shiftElement.currentShiftId)
                  if(shiftElement.clientId && shiftElement.clientBranchId && shiftElement.clientMappedId){
                    shiftEntry['clientId'] = new ObjectId(shiftElement.clientId)
                    shiftEntry['clientBranchId'] = new ObjectId(shiftElement.clientBranchId)
                    shiftEntry['clientMappedId'] = new ObjectId(shiftElement.clientMappedId)
                  }
                  if(shiftElement.orgId && shiftElement.branchId){
                    shiftEntry['subOrgId'] = new ObjectId(shiftElement.orgId)
                    shiftEntry['branchId'] = new ObjectId(shiftElement.branchId)
                  }
                  //  modifed shift start 
                    if(shiftElement.startTime && shiftElement.currentShiftId!=='WO'){
                  shiftEntry['startTime'] = shiftElement.startTime
              
                  }
                  //modifed shift end
                  if(shiftElement.endTime && shiftElement.currentShiftId!=='WO')
                  {
    shiftEntry['endTime'] =shiftElement.endTime
                  }

          entries.push(shiftEntry);
        }
      });
      current.setDate(current.getDate() + 1); // Move to next day
    }
    return await createMany(entries,collection_name);
  }
  catch(error) 
  {
        logger.error("Error while shiftDateCreate in shift by date model ",{ stack: error.stack });
        throw error;
  }
}

export const getAllShiftDate = async (body) => {
    try
    {    
      body.orgId = body.orgDetails._id
    const query = new QueryBuilder(body)
      .addId()
      // .addOrgId()
      .addIsActive()
      .addEmployeeIds()
      .addDate()
      .addUserId();

    const params = query.getQueryParams();
    // if (body.orgId && body.user.orgId.toString() === body.orgId.toString()) {
    //   params["orgId"] = body.user.orgId;
    // }
    // if (body.orgId) {
    //   params["orgId"] = new ObjectId(body.orgId);
    // }

    // if (body.clientMappedId) {
    //   params["orgId"] = new ObjectId(body.clientMappedId);
    // }
    // if (body.orgId && body?.user?.orgId.toString() !== body.orgId.toString()) {
    //   params["subOrgId"] = body.orgId;
    // }
    // if (body.subOrgId) {
    //   params["subOrgId"] = new ObjectId(body.subOrgId);
    // }

  if(body.shifts?.length>0){
            const subOrgId = body.shifts.map(shift => shift.orgId?new ObjectId(shift.orgId): null).filter(id => id !== null);
           const branchId= body.shifts.map(shift =>shift.branchId?new ObjectId(shift.branchId):null).filter(id => id !== null);
           const currentShiftId= body.shifts.map(shift =>shift.currentShiftId ? shift.currentShiftId =='WO'? 'WO': new ObjectId(shift.currentShiftId):null).filter(id => id !== null);
            // params.subOrgId={ $in: subOrgId };
            // params.branchId={ $in: branchId };
            params.currentShiftId={ $in: currentShiftId };
        }

        params.isActive = params.isActive === false ? false : true;

        console.log("Query Params for getAllShiftDate: ", JSON.stringify(params, null, 2));

        return await getMany(params,collection_name);
    }
    catch(error)
    {
        logger.error("Error while getAllShiftDate in shift by date model ",{ stack: error.stack });
        throw error;
  }
}

export const getListShiftDate = async (body) => {
 try
    
    {
      const users=body.isClient && body.assignmentClientUserIds ? body.assignmentClientUserIds:body.assignmentUserIds
      const clientBranchIds=body.isClient ? body.clientBranchIds.map(cb=>new ObjectId(cb)):[];
      let start = new Date(body?.startDate);
      start.setUTCHours(0, 0, 0, 0);
      let end = new Date(body?.endDate);
      end.setUTCHours(23, 59, 59, 999);

      let aggregation =   [
      {
        $match: {
          employeeId: {
            $in: users.map(id => new ObjectId(id))
          },
          date: { $gte: start, $lt: end },
          isActive: true,
          ...(body.isClient ? { clientBranchId: { $in: clientBranchIds } } : {}),
        }
      }
    ]
    console.log(JSON.stringify(aggregation))
    return await aggregate(aggregation, collection_name)
  }
  catch (error) {
    logger.error("Error while getListShiftDate in shift by date model ", { stack: error.stack });
    throw error;
  }
}

export const getOneShiftDate = async (body) => {
    try
    {
    body.orgId = body.orgDetails._id
    const query = new QueryBuilder(body)
      .addId()

    const params = query.getQueryParams();

        return await getOne(params,collection_name);
  }
    catch(error)
    {
        logger.error("Error while getOneShiftDate in shift by date model ",{ stack: error.stack });
    throw error;
  }
}

export const updateShiftDate = async (body) => {
  try {

    const { user, orgDetails, id, employeeId, shiftId, date, employeeShiftId, swappedUserId, swappedUserShiftId, assignedShiftId, status, reason, isActive } = body;
    if (!ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid mongoId"
      }
    }
    const updateData = {
       modifedDate: new Date(),
      modifedBy:new ObjectId(body?.user?._id),
    }

    if (shiftId) updateData.shiftId = new ObjectId(shiftId);
    if (employeeId) updateData.userId = new ObjectId(employeeId);
    if (employeeShiftId) updateData.userShiftId = new ObjectId(employeeShiftId);
    if (swappedUserId) updateData.swappedUserId = new ObjectId(swappedUserId);
    if (swappedUserShiftId) updateData.swappedUserShiftId = new ObjectId(swappedUserShiftId);
    if (assignedShiftId) updateData.assignedShiftId = new ObjectId(assignedShiftId);
    if (date) updateData.date = new Date(date);
    if (reason) updateData.reason = reason;

    updateData.updatedDate = new Date(Date.now())
    updateData.updatedBy = user._id
    if (updateData.status) {
      updateData.approvedBy = user._id
      updateData.approvedDate = new Date(Date.now())
   

    }
    if (body.hasOwnProperty('isActive')) {
      updateData.isActive = isActive
       
    }

    const updateObj = { $set: updateData }

    return await updateOne({ _id: new ObjectId(id), orgId: orgDetails._id }, updateObj, collection_name)
  }
  catch (error) {
    logger.error("Error while updateShiftDate in shift by date model ", { stack: error.stack });
    throw error;
  }
}

export const getRosterShiftDate = async (body) => {
  try {
    const { userList, shiftList, shiftGroup, shiftDateList, startDate, endDate } = body;

    const shiftMap = new Map(shiftList.map(s => [s._id.toString(), s]));

    const shiftGroupMap = new Map(
      shiftGroup.map(g => [
        g._id.toString(),
        {
          rotation: g.shiftIds,
          groupStartDate: moment.utc(g.startDate).startOf('day')
        }
      ])
    );

    const approvedOverrideMap = new Map();
    const pendingOverrideMap = new Map();
    for (const entry of shiftDateList) {
      const key = `${entry.employeeId.toString()}-${moment(entry.date).utc().format("YYYY-MM-DD")}`;
      if (entry.status === 'approved') {
        approvedOverrideMap.set(key, entry);
      } else if (entry.status === 'pending') {
        pendingOverrideMap.set(key, entry);
      }
    }

    const start = moment.utc(startDate).startOf('day');
    const end = moment.utc(endDate).startOf('day');

    const roster = userList.data.map(emp => {
      const shiftGroupData = shiftGroupMap.get(emp.shiftGroupId?.toString() || '');
      const rotation = shiftGroupData?.rotation || [];
      const groupStartDate = shiftGroupData?.groupStartDate;

      const days = [];

      for (let d = start.clone(); d.isSameOrBefore(end, 'day'); d.add(1, 'day')) {
        const dateStr = d.format("YYYY-MM-DD");
        const overrideKey = `${emp._id.toString()}-${dateStr}`;
        const approvedOverride = approvedOverrideMap.get(overrideKey);
        const pendingOverride = pendingOverrideMap.get(overrideKey);

        let shift = null;
        let pendingShift = null;

        // Default or approved shift
        if (approvedOverride) {
          const shiftData = shiftMap.get(approvedOverride.assignedShiftId?.toString());
          if (shiftData) {
            shift = {
              name: shiftData.name,
              startTime: shiftData.startTime,
              endTime: shiftData.endTime,
              colorCode: shiftData.colorCode,
            };
          }
        } else if (rotation.length && groupStartDate) {
          const daysSinceStart = d.diff(groupStartDate, 'days');
          if (daysSinceStart >= 0) {
            const index = daysSinceStart % rotation.length;
            const shiftId = rotation[index];
            if (shiftId === 'WO') {
              shift = {
                name: 'Week Off',
                colorCode: '#cccccc',
              };
            } else {
              const shiftData = shiftMap.get(shiftId.toString());
              if (shiftData) {
                shift = {
                  name: shiftData.name,
                  startTime: shiftData.startTime,
                  endTime: shiftData.endTime,
                  colorCode: shiftData.colorCode,
                };
              }
            }
          }
        }

        // Pending shift (separate)
        if (pendingOverride) {
          const shiftData = shiftMap.get(pendingOverride.assignedShiftId?.toString());
          if (shiftData) {
            pendingShift = {
              name: shiftData.name,
              startTime: shiftData.startTime,
              endTime: shiftData.endTime,
              colorCode: shiftData.colorCode,
              status: 'pending'
            };
          }
        }

        const dayData = {
          date: dateStr,
          ...(shift && { shift }),
          ...(pendingShift && { pendingShift })
        };

        days.push(dayData);
      }

      return {
        employeeId: emp._id,
        name: emp.name,
        shiftDetails: days,
      };
    });

    return {
      status: true,
      data: roster,
    };
  } catch (error) {
    logger.error("Error while getRosterShiftDate in shift by date model", { stack: error.stack });
    throw error;
  }
};


// based on date assigned shift
export const getShiftByDate = async (body) => {
  try {
    const orgId = body?.user?.orgId
    const userId = body?.user?._id
    let start = new Date(body.date);
    start.setUTCHours(0, 0, 0, 0); // Start of the day
    let end = new Date(body.date);
    end.setUTCHours(23, 59, 59, 999); // End of the day
    const query = {
      employeeId: new ObjectId(userId),
      orgId: new ObjectId(orgId),
      date: { $gte: start, $lt: end },
      isActive: true
    };

    let aggregation = [
      {
        $match: query
      },
      {
        $lookup: {
          from: 'shift',
          localField: 'currentShiftId',
          foreignField: '_id',
          as: 'shiftDetails'
        }
      }
    ]
        console.log(JSON.stringify(aggregation), 'query')
        return await aggregate(aggregation, collection_name);

  }
  catch (error) {
    logger.error("Error while getShiftByDate in shift by date model ", { stack: error.stack });
    throw error;
  }
}

export const getAssignedShiftDateIds = async (body) => {
  try {
    const orgId = body?.orgId
    const userId = body?.employeeId
    let start = new Date(body?.startDate);
    start.setUTCHours(0, 0, 0, 0);
    let end = new Date(body?.endDate);
    end.setUTCHours(23, 59, 59, 999);
    const isSameDay = start.getTime() === new Date(body?.endDate).setUTCHours(0, 0, 0, 0)
    const query = {
      employeeId: new ObjectId(userId),
      orgId: new ObjectId(orgId),
      date: isSameDay
        ? { $gte: start, $lte: end }
        : { $gte: start, $lte: end },
      isActive: true

    };

    console.log(query, 'query')
    const getAssignedShift = await getMany(query, collection_name);
    if (getAssignedShift.status) {
      return { status: true, data: getAssignedShift.data }
    }
    return { status: false }
  }
  catch (error) {
    logger.error("Error while getAssignedShiftByDateIds in shift by date model ", { stack: error.stack });
    throw error;
  }

}
export const deactiveShiftDateIds = async (body) => {
  try {
    const { shiftId, employeeId } = body;
    if (!ObjectId.isValid(shiftId) || !ObjectId.isValid(employeeId)) {
      return {
        status: false,
        message: "Invalid Mongo ID(s)",
      };
    }
    const filter = {
      _id: new ObjectId(shiftId),
      employeeId: new ObjectId(employeeId),
    };

    const updateObj = { $set: { isActive: false,modifiedDate:new Date(),modifedBy:new ObjectId(body?.user?._id) }}
    console.log("Deactivating shift:", filter);
    const result = await updateOne(filter, updateObj, collection_name);
    if (result?.status) {
      return { status: true, message: "Shift deactivated successfully" };
    } else {
      return { status: false, message: "No shift found or already deactivated" };
    }
  } catch (error) {
    logger.error("Error while deactivating shift in shift model", { stack: error.stack });
    return { status: false, message: "Internal server error" };
  }
};

export const updateShiftSwap = async (body) => {
  try {
    const { updatePayload, shiftId } = body;
    if (!ObjectId.isValid(shiftId)) {
      return {
        status: false,
        message: "Invalid Mongo ID(s)",
      };
    }
    const filter = {
      _id: new ObjectId(shiftId),

    };

    const updateObj = { $set: { ...updatePayload, modifiedDate: new Date(), modifedBy: new ObjectId(body?.user?._id) } }
    console.log("swap shift:", filter, updateObj);
    const result = await updateOne(filter, updateObj, collection_name);
    if (result?.status) {
      return { status: true, message: "Shift Swapped successfully" };
    } else {
      return { status: false, message: "No shift found to swap" };
    }
  } catch (error) {
    logger.error("Error while Swapped shift in shift model", { stack: error.stack });
    return { status: false, message: "Internal server error" };
  }
};






