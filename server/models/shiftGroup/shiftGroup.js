import { logger } from "../../helper/logger.js";
import { ObjectId } from "mongodb";
import { create, getMany, getOne, updateOne, updateMany, aggregate } from "../../helper/mongo.js";
import { toIstDay, addDays, getIstWeekday } from "../../utils/date.js";

const shiftGroupCollection = "shiftGroup";
const shiftDateCollection = 'shiftDate';
const shiftCollection = 'shift';
const usersCollection = 'user';

export const buildShiftGroupObject = async (body) => {
  try {
    const shiftId = new ObjectId(body.shiftId);
    const year = body.year;
    const weekOff = body.weekOff ?? [];
    const isActive = true;
   
    let subOrgId = undefined;
    let branchId = undefined;
    let departmentId = undefined;
    let designationId = undefined;

    let clientMappedId = undefined;
    let clientBranchId = undefined;

    let userIds = undefined;
    let validity = [];

    // for whole year
    if (year && (!body?.months || body?.months?.length === 12) && !body?.weeks) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      validity.push({startDate, endDate});
    }

    // for months only (no particular weeks)
    if (body?.months && body.months.length < 12) {
      let months = body.months;
      months.sort((a, b) => a - b);
      let start = months[0];
      let prev = months[0];

      for (let i = 1; i <= months.length; i++) {
        const current = months[i];

        if (current != prev + 1) {
          const startDate = new Date(year, start - 1, 1);
          const endDate = new Date(year, prev, 0);
          validity.push({startDate, endDate});

          start = current;
        }
        prev = current;
      }
    }

    // for particular weeks of a month
    if (body?.weeks) {
      let weeks = body.weeks;
      const ranges = [];
      
      weeks.forEach(weekStr => {
        const match = weekStr.match(/\((\d{1,2} \w{3}) to (\d{1,2} \w{3})\)/);

        const [ , startStr, endStr ] = match;
        const startDate = new Date(`${startStr} ${year}`);
        const endDate   = new Date(`${endStr} ${year}`);
        ranges.push({ startDate, endDate });
      })

      ranges.sort((a, b) => a.startDate - b.startDate);

      let merged = [];
      let current = ranges[0];

      for (let i = 1; i < ranges.length; i++) {
        const next = ranges[i];

        const nextDay = new Date(current.endDate);
        nextDay.setDate(nextDay.getDate() + 1);

        if (next.startDate.getTime() === nextDay.getTime()) {
          current.endDate = next.endDate;
        } else {
          merged.push(current);
          current = next;
        }
      }
      if (current) merged.push(current);
      validity.push(...merged);
    }

    if (body?.subOrgId) {
      subOrgId = new ObjectId(body.subOrgId);
    }
    if (body?.branchId) {
      branchId = new ObjectId(body.branchId);
    }
    if (body?.departmentId) {
      departmentId = new ObjectId(body.departmentId);
    }
    if (body?.designationId) {
      designationId = new ObjectId(body.designationId)
    }
    if (body?.clientMappedId) {
      clientMappedId = new ObjectId(body.clientMappedId);
    }
    if (body?.clientBranchId) {
      clientBranchId = new ObjectId(body.clientBranchId);
    }
    if (body?.userIds && body.userIds.length > 0) {
      userIds = body.userIds.map(id => new ObjectId(id));
    } else {
      const assignments = body.assignment;
      const users = (await Promise.all(assignments.map(a => getMany({ assignmentId: a._id }, usersCollection))))
                    .flatMap(r => r.data);
      userIds = users.map(u => u._id)
    }
    
    const shiftGroupObj = {
      shiftId,
      validity,
      weekOff,
      isActive,
      userIds,
      ...(subOrgId && { subOrgId }),
      ...(branchId && { branchId }),
      ...(departmentId && { departmentId }),
      ...(designationId && { designationId }),
      ...(clientMappedId && { clientMappedId }),
      ...(clientBranchId && { clientBranchId })
    }

    return { status: true, data: shiftGroupObj };
  } catch (error) {
    logger.error("Error while creating shift group in shiftGroup moudle");
    throw error;
  }
}

export const getOverlappingShift = async (body) => {
  if (body?.shiftsToDisable?.length > 0) return { status: true };
  
  const employeeIds = body.shiftGroupObj.userIds;
  const validity = body.shiftGroupObj.validity;
  const newShiftId = body.shiftGroupObj.shiftId;
  const overlappingShifts = [];
  let newStartTime = '';
  let newEndTime = '';

  // get new shift times
  const { data: newShiftData } = await getOne({_id: newShiftId}, shiftCollection);
  newStartTime = newShiftData.startTime;
  newEndTime = newShiftData.endTime;

  // build date conditions
  const dateConditions = validity.map(v => ({
    $and: [
      { date: { $gte: new Date(v.startDate) } },
      { date: { $lte: new Date(v.endDate) } }
    ]
  }));

  const pipeline = [
    {
      $match: {
        employeeId: { $in: employeeIds },
        isActive: true,
        $or: dateConditions
      }
    },
    {
      $lookup: {
        from: "shift", 
        let: { shiftId: "$currentShiftId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$shiftId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
              startTime: 1,
              endTime: 1,
              bgColor: 1,
              textColor: 1
            }
          }
        ],
        as: "currentShift"
      }
    },
    { $unwind: "$currentShift" },
    {
      $lookup: {
      from: "user",
      let: { empId: "$employeeId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$empId"] } } },
        {
          $project: {
            _id: 1,
            name: 1
          }
        }
      ],
      as: "employee"
    }
    },
    { $unwind: "$employee" }
  ];


  const { data: presentShifts } = await aggregate(pipeline, shiftDateCollection);

  // helper inline fns
  const parseTimeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const getShiftIntervals = (start, end) => {
    const s = parseTimeToMinutes(start);
    const e = parseTimeToMinutes(end);

    if (e > s) {
      // normal shift
      return [[s, e]];
    } else {
      // overnight shift
      return [[s, 1440], [0, e]];
    }
  };

  const isOverlap = (newStart, newEnd, presentStart, presentEnd) => {
    const newIntervals = getShiftIntervals(newStart, newEnd);
    const presentIntervals = getShiftIntervals(presentStart, presentEnd);

    for (let [ns, ne] of newIntervals) {
      for (let [ps, pe] of presentIntervals) {
        // no overlap if one ends exactly when another begins
        if (ns < pe && ps < ne) {
          return true;
        }
      }
    }
    return false;
  };

  // check overlaps
  for (let shift of presentShifts) {
    const presentStartTime = shift.currentShift.startTime;
    const presentEndTime = shift.currentShift.endTime;

    if (isOverlap(newStartTime, newEndTime, presentStartTime, presentEndTime)) {
      overlappingShifts.push(shift);
    }
  }

  return { status: true, data: overlappingShifts};
};

export const handleOverlappingShift = async (body) => {
    try {
      console.log(body)
      const overlappingShifts = body?.overlappingShifts;
      if (overlappingShifts?.length > 0) {
        return {
          status: false,
          data: overlappingShifts
        }
      } else if (body?.shiftsToDisable?.length > 0) {
        const { shiftsToDisable } = body;

        const query = { _id: { $in: shiftsToDisable.map(id => new ObjectId(id)) } };
        const update = { $set: { isActive: false } };

        await updateMany(query, update, shiftDateCollection);
        return {
          status: true
        }
      } else {
        return {
          status: true,
        }
      }
    } catch (error) {
      logger.error("Error while handling overlapping shifts in shiftGroup module");
      throw error;
    }
};


export const createShiftGroup = async (body) => {
  try {
    console.log(body);
    const orgId = new ObjectId(body.user.orgId);
    const createdBy = new ObjectId(body.user._id);
    const createdDate = new Date();
    const final = {...body.shiftGroupObj, orgId, createdBy, createdDate}
    return await create(final, shiftGroupCollection)
  } catch (error) {
    logger.error("Error while creating shift group in shiftGroup moudle");
    throw error;
  }
};

export const getShiftGroupListByDate = async (body) => {
      const users=body.isClient && body.assignmentClientUserIds ? body.assignmentClientUserIds: body.dashboardStatus || body.clientCheckIn || body.teamAttendance || body.extendAttendance ? [body.userId] : body.assignmentUserIds
      const clientBranchIds=body.isClient?body.clientBranchIds.map(cb=>new ObjectId(cb)):[];
      let start = body?.startDate ? new Date(body?.startDate) : new Date();
      start.setUTCHours(0, 0, 0, 0);
      let end = body?.endDate ? new Date(body?.endDate) : new Date();
      end.setUTCHours(23, 59, 59, 999);

  // const start = toIstDay(body.startDate); // inclusive
  // const end   = toIstDay(body.endDate);   // inclusive

  const groupFilter = {
    userIds: { $in: users.map((id) => new ObjectId(id)) },
    validity: {
      $elemMatch: {
        startDate: { $lte: end },
        endDate: { $gte: start }
      }
    }
  }
    // console.log(JSON.stringify(groupFilter))
  const { data: shiftGroups } = await getMany(groupFilter, shiftGroupCollection);
  const expandedDocs = [];

  for (const group of shiftGroups) {
    const {
      orgId,
      shiftId,
      validity,
      weekOff = [],
      subOrgId,
      branchId,
      userIds: groupUsers,
      isActive,
      _id: shiftGroupId,
      exceptions = []
    } = group;

    for (const userId of groupUsers) {
      for (const v of validity) {
        let cur = toIstDay(v.startDate);
        let last = toIstDay(v.endDate);

        // Clamp to requested period
        if (cur < start) cur = start;
        if (last > end) last = end;

        while (cur <= last) {
          const dayName = getIstWeekday(cur);

          const isException = exceptions.some(
            (ex) =>
              String(ex.employeeId) === String(userId) &&
              toIstDay(ex.date).getTime() === cur.getTime()
          );

          if (!weekOff.includes(dayName) && !isException) {
            expandedDocs.push({
              orgId,
              employeeId: userId,
              date: new Date(cur),
              currentShiftId: shiftId,
              subOrgId,
              branchId,
              isActive,
              shiftGroupId,
            });
          }

          cur = addDays(cur, 1);
        }
      }
    }
  }

  return { status: true, data: expandedDocs };
};


export const addGroupExceptions = async (body) => {
  try {
    const date = new Date(body.startDate);
    const employeeId = new ObjectId(body.employeeIds[0]);
    let newShifts = body.shifts;
    const newShiftGroupsId = body.shifts.filter((s) => s.shiftGroupId).map(s => s.shiftGroupId);

    const query = {
      userIds: employeeId,
      validity: {
        $elemMatch: {
          startDate: { $lte: date },
          endDate: { $gte: date }
        }
      }
    }

    const { data: shiftGroups } = await getMany(query, shiftGroupCollection)
    
    for (const group of shiftGroups) {
      if (newShiftGroupsId.includes(String(group._id))) {
        newShifts = newShifts.filter(s => String(s.shiftGroupId) !== String(group._id));
        continue;
      }
      
      const query = { _id: group._id };
      const update = {
        $addToSet: { 
          exceptions: { 
            date, 
            employeeId 
          }
        }
      };

      await updateOne(query, update, shiftGroupCollection);
    }

    return {
      status: true,
      data: newShifts
    }

  } catch (error) {
    logger.error("Error while adding exceptions in shiftGroup module");
    throw error;
  }
};
